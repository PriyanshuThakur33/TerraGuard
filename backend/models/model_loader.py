import os
import json
import joblib
from typing import Any

try:
    from keras.models import load_model as keras_load
except Exception:
    keras_load = None

MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")

def load_joblib(path: str) -> Any:
    return joblib.load(path)

def load_keras(path: str) -> Any: 
    if keras_load:
        try:
            # load without compiling to avoid deserializing training-only objects
            return keras_load(path, compile=False)
        except Exception:
            # fallback: attempt a plain load and let caller handle errors
            try:
                return keras_load(path)
            except Exception:
                return None
    raise RuntimeError("Keras not available")

def load_json(path: str):
    with open(path, "r") as f:
        return json.load(f)

def try_load(path: str):
    if not path:
        return None
    if not os.path.exists(path):
        return None
    if path.endswith(".joblib") or path.endswith(".pkl"):
        return load_joblib(path)
    if path.endswith(".h5") or path.endswith(".keras"):
        return load_keras(path)
    if path.endswith(".json"):
        return load_json(path)
    return None
