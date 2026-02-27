from fastapi import APIRouter, HTTPException
from typing import Optional
from simulation.dataset_loader import DatasetLoader
from simulation.state_manager import StateManager
from database.db_manager import DBManager
from simulation.simulation_controller import SimulationController
from alerts.alert_engine import AlertEngine
from models.classification_model import ClassificationModel
from models.regression_model import RegressionModel
from models.model_loader import try_load
import os

router = APIRouter()

# Singleton components
dataset = DatasetLoader(csv_path=None)
state = StateManager()
db = DBManager()
alert_engine = AlertEngine()

# Wire existing trained model files from the repo's top-level `models/` folders
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
class_model_path = os.path.join(repo_root, "models", "classification", "classification_lstm.h5")
class_meta = os.path.join(repo_root, "models", "classification", "classification_metadata.json")
reg_meta_path = os.path.join(repo_root, "models", "regression", "regression_meta_lstm.h5")
reg_meta_json = os.path.join(repo_root, "models", "regression", "regression_metadata.json")

# Default dataset files — relative to backend/data/ (works locally and on Render)
_data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
DEFAULT_CLASSIFICATION_XLSX = os.path.abspath(os.path.join(_data_dir, "classification_data.csv"))
DEFAULT_REGRESSION_TRAIN_XLSX = os.path.abspath(os.path.join(_data_dir, "regression_train.xlsx"))
DEFAULT_REGRESSION_TEST_XLSX = os.path.abspath(os.path.join(_data_dir, "regression_test.xlsx"))

class_model = ClassificationModel(model_path=class_model_path, scaler_path=None)

# Wire base models from metadata for regression
base_model_paths = None
try:
    reg_meta = try_load(reg_meta_json)
    if isinstance(reg_meta, dict):
        base_names = reg_meta.get("base_models") or reg_meta.get("base_model_paths") or []
        if base_names:
            reg_dir = os.path.join(repo_root, "models", "regression")
            base_model_paths = [
                os.path.join(reg_dir, b) if not os.path.isabs(b) else b
                for b in base_names
            ]
except Exception:
    pass

reg_model = RegressionModel(meta_model_path=reg_meta_path, base_model_paths=base_model_paths, scaler_path=None)
controller = SimulationController(dataset, state, db, class_model, reg_model, alert_engine)

@router.post("/simulation/start")
def start_simulation(csv_path: Optional[str] = None, mode: Optional[str] = None):
    # If no csv_path provided, select sensible default based on mode
    if not mode:
        mode = state.get().get("mode", "classification")

    # Ensure controller state reflects requested mode before loading dataset/start
    if mode:
        try:
            controller.set_mode(mode)
        except Exception:
            # ignore and let downstream validation handle invalid modes
            pass

    if not csv_path:
        if mode == "classification":
            csv_path = DEFAULT_CLASSIFICATION_XLSX
        else:
            # use regression test file for simulation playback
            csv_path = DEFAULT_REGRESSION_TEST_XLSX

    try:
        dataset.load(csv_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to load dataset: {e}")
    if dataset.length() == 0:
        raise HTTPException(status_code=400, detail=f"Dataset not loaded or empty: {csv_path}")
    if mode:
        controller.set_mode(mode)
    controller.start()
    return {"status": "started", "state": controller.status(), "loaded_path": csv_path}

@router.post("/simulation/stop")
def stop_simulation():
    controller.stop()
    return {"status": "stopped", "state": controller.status()}

@router.post("/simulation/reset")
def reset_simulation():
    controller.reset()
    return {"status": "reset", "state": controller.status()}

@router.get("/simulation/status")
def get_status():
    return controller.status()

@router.get("/simulation/history")
def get_history(limit: int = 1000):
    import math

    def _sanitize(obj):
        if isinstance(obj, dict):
            return {k: _sanitize(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [_sanitize(v) for v in obj]
        if isinstance(obj, float):
            if math.isnan(obj) or math.isinf(obj):
                return None
            return obj
        return obj

    raw = controller.history(limit=limit)
    return _sanitize(raw)

@router.post("/simulation/set-speed")
def set_speed(speed: float):
    controller.set_speed(speed)
    return {"status": "speed_set", "speed": speed}

@router.post("/simulation/set-mode")
def set_mode(mode: str):
    try:
        controller.set_mode(mode)
        return {"status": "mode_set", "mode": mode}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
