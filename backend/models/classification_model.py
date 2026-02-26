import os
import numpy as np
from .model_loader import try_load


class ClassificationModel:
    def __init__(self, model_path=None, scaler_path=None):
        # If explicit paths not provided, attempt to load from repo-level models/classification
        if not model_path:
            repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            default_dir = os.path.join(repo_root, "models", "classification")
            candidate = os.path.join(default_dir, "classification_lstm.h5")
            if os.path.exists(candidate):
                model_path = candidate
            meta_candidate = os.path.join(default_dir, "classification_metadata.json")
            if os.path.exists(meta_candidate) and not scaler_path:
                meta = try_load(meta_candidate)
                if isinstance(meta, dict):
                    scaler_name = meta.get("scaler") or meta.get("scaler_path")
                    if scaler_name:
                        scaler_path = os.path.join(default_dir, scaler_name) if not os.path.isabs(scaler_name) else scaler_name
                    self.feature_order = meta.get("features")
                else:
                    self.feature_order = None
        else:
            self.feature_order = None

        self.model = try_load(model_path) if model_path else None 
        self.scaler = try_load(scaler_path) if scaler_path else None

    def predict(self, features):
        # features can be list/array (ordered) or dict (named)
        if isinstance(features, dict):
            if hasattr(self, "feature_order") and self.feature_order:
                ordered = [features.get(f) for f in self.feature_order]
            else:
                # fallback to insertion order
                ordered = list(features.values())
            x = np.asarray(ordered).reshape(1, -1)
        else:
            x = np.asarray(features).reshape(1, -1)

        # Replace NaN with 0
        x = np.nan_to_num(x, nan=0.0)

        if self.scaler:
            try:
                x = self.scaler.transform(x)
            except Exception:
                pass

        if self.model:
            try:
                probs = self.model.predict(x)
                if isinstance(probs, (list, tuple)):
                    probs = np.asarray(probs)
                if hasattr(probs, "ndim") and probs.ndim == 2:
                    class_idx = int(np.argmax(probs, axis=1)[0])
                    conf = float(np.max(probs, axis=1)[0])
                else:
                    class_idx = int(probs[0]) if hasattr(probs, "__len__") else int(probs)
                    conf = 1.0
                # Check for NaN
                if np.isnan(class_idx) or np.isnan(conf):
                    class_idx = 0
                    conf = 0.5
                return {"prediction": class_idx, "confidence": conf}
            except Exception:
                pass

        # fallback deterministic heuristic
        return {"prediction": int(np.clip(int(x.sum()) % 3, 0, 2)), "confidence": 0.5}
 