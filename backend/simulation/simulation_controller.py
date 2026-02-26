import threading
import time
from datetime import datetime
from typing import Optional
from simulation.dataset_loader import DatasetLoader
from simulation.state_manager import StateManager
from models.classification_model import ClassificationModel
from models.regression_model import RegressionModel
from alerts.alert_engine import AlertEngine
from database.db_manager import DBManager

class SimulationController:
    def __init__(self,
                 dataset_loader: DatasetLoader,
                 state_manager: StateManager,
                 db_manager: DBManager,
                 classification_model: Optional[ClassificationModel] = None,
                 regression_model: Optional[RegressionModel] = None,
                 alert_engine: Optional[AlertEngine] = None):
        self.dataset = dataset_loader
        self.state = state_manager
        self.db = db_manager
        self.class_model = classification_model
        self.reg_model = regression_model
        self.alert_engine = alert_engine or AlertEngine()
        self._thread = None
        self._stop_event = threading.Event()
        self._thread_lock = threading.Lock()
        self._prev_output = None

    def start(self):
        with self._thread_lock:
            if self.state.get()["running"]:
                return
            self.state.update(running=True)
            self._stop_event.clear()
            self._thread = threading.Thread(target=self._run_loop, daemon=True)
            self._thread.start()

    def stop(self):
        with self._thread_lock:
            self.state.update(running=False)
            self._stop_event.set()
            if self._thread:
                self._thread.join(timeout=2)
                self._thread = None

    def reset(self):
        self.stop()
        self.state.reset_index()
        self.db.reset()
        self._prev_output = None

    def set_speed(self, speed: float):
        self.state.update(speed=float(speed))

    def set_mode(self, mode: str):
        if mode not in ("classification", "regression"):
            raise ValueError("mode must be 'classification' or 'regression'")
        self.state.update(mode=mode)

    def status(self):
        s = self.state.get()
        s["dataset_length"] = self.dataset.length()
        return s

    def history(self, limit: int = 1000):
        return self.db.fetch_history(limit=limit)

    def _run_loop(self):
        while not self._stop_event.is_set():
            s = self.state.get()
            if not s["running"]:
                break
            idx = s["current_index"]
            if idx >= self.dataset.length():
                self.state.update(running=False)
                break
            raw = self.dataset.get_row(idx)
            timestamp = datetime.utcnow().isoformat() 
            mode = s["mode"]
            model_output = {}
            interpreted_risk = 0
            try:
                if mode == "classification":
                    if self.class_model is not None:
                        feature_order = getattr(self.class_model, "feature_order", None)

                        if feature_order:
                            features = [
                                float(raw.get(col, 0.0) or 0.0)
                                for col in feature_order
                            ]
                        else:
                            features = [
                                float(v)
                                for v in raw.values()
                                if isinstance(v, (int, float))
                            ][:33]

                        pred = self.class_model.predict(features)
                    else:
                        pred = {"prediction": 0, "confidence": 0.0}

                    model_output = pred
                    interpreted_risk = int(pred.get("prediction", 0))

                    displacement = float(raw.get("Displacement", 0.0))
                    model_output["displacement_value"] = displacement

                else:
                    window = []
                    start = max(0, idx - 4)
                    for i in range(start, idx + 1):
                        row = self.dataset.get_row(i)
                        window.append([v for v in row.values()])
                    pred = self.reg_model.predict(window) if self.reg_model else {"risk_score": 0.0, "base_predictions": []}
                    model_output = pred
                    interpreted_risk = int(round(pred.get("risk_score", 0.0)))
                    model_output["hazard_level"] = interpreted_risk
                    model_output["displacement_value"] = pred.get("risk_score", 0.0)
            except Exception as e:
                model_output = {"error": str(e)}

            alert = self.alert_engine.evaluate(timestamp, mode, model_output, self._prev_output)
            hazard_level = alert.get("hazard_level")

            if hazard_level is None:
                hazard_level = interpreted_risk

            hazard_level = int(hazard_level)
            self.db.insert_record(timestamp, mode, dict(raw), model_output, hazard_level, alert.get("alert_message", ""))
            self._prev_output = {**model_output, "hazard_level": alert.get("hazard_level"), "displacement_value": alert.get("displacement_value")}
            self.state.update(current_index=idx+1, last_prediction=self._prev_output)
            time.sleep(max(0.0, float(s["speed"])))
