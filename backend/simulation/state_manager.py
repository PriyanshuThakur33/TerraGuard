import threading
from typing import Dict, Any

class StateManager:
    def __init__(self):
        self._lock = threading.Lock()
        self.state: Dict[str, Any] = {
            "running": False,
            "current_index": 0,
            "mode": "classification",
            "speed": 1.0,
            "last_prediction": None
        }

    def get(self) -> Dict[str, Any]:
        with self._lock:
            return dict(self.state)

    def update(self, **kwargs):
        with self._lock:
            self.state.update(kwargs)

    def reset_index(self):
        with self._lock:
            self.state["current_index"] = 0
            self.state["last_prediction"] = None
