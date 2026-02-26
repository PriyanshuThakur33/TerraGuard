from typing import Dict, Any, Optional
from collections import deque
 
class AlertEngine:
    def __init__(self, sustained_threshold=2, sustained_steps=3, displacement_spike=0.5):
        self.sustained_threshold = sustained_threshold
        self.sustained_steps = sustained_steps
        self.displacement_spike = displacement_spike
        self._history = deque(maxlen=1000)

    def evaluate(self, timestamp: str, mode: str, output: Dict[str, Any], prev_output: Optional[Dict[str, Any]]):
        alert_flag = False
        alert_msgs = []

        hazard = output.get("prediction") if mode == "classification" else output.get("hazard_level")
        confidence = output.get("confidence", 0.0)
        displacement = output.get("risk_score") if mode == "regression" else output.get("displacement_value", 0.0)

        # Escalation detection
        if prev_output:
            prev_hazard = prev_output.get("hazard_level") if prev_output.get("hazard_level") is not None else prev_output.get("prediction")
            if prev_hazard is not None and hazard is not None and hazard > prev_hazard:
                alert_flag = True
                alert_msgs.append("Escalation detected: hazard class increased.")

        # Sustained risk
        self._history.append(hazard)
        if hazard is not None and hazard >= self.sustained_threshold:
            cnt = 0
            for h in reversed(self._history):
                if h is not None and h >= self.sustained_threshold:
                    cnt += 1
                else:
                    break
            if cnt >= self.sustained_steps:
                alert_flag = True
                alert_msgs.append(f"Sustained high risk for {cnt} steps.")

        # Displacement spike
        if prev_output:
            prev_disp = prev_output.get("displacement_value") if prev_output.get("displacement_value") is not None else prev_output.get("risk_score", 0.0)
            if displacement is not None and (displacement - prev_disp) > self.displacement_spike:
                alert_flag = True
                alert_msgs.append("Displacement spike detected.")

        message = "; ".join(alert_msgs) if alert_msgs else ""
        return {
            "timestamp": timestamp,
            "mode": mode,
            "hazard_level": hazard,
            "hazard_confidence": confidence,
            "displacement_value": displacement,
            "alert_flag": alert_flag,
            "alert_message": message
        }
