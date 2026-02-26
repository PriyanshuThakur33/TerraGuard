import os
import numpy as np
from .model_loader import try_load


def _is_keras_model(m) -> bool:
    """Check if a model object is a Keras model by inspecting for input_shape attribute."""
    return hasattr(m, 'input_shape')


class RegressionModel:
    def __init__(self, meta_model_path=None, base_model_paths=None, scaler_path=None):
        # Attempt to locate repo-level regression models if paths not provided
        if not meta_model_path:
            repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            default_dir = os.path.join(repo_root, "models", "regression")
            candidate = os.path.join(default_dir, "regression_meta_lstm.h5") 
            if os.path.exists(candidate):
                meta_model_path = candidate
            meta_candidate = os.path.join(default_dir, "regression_metadata.json")
            if os.path.exists(meta_candidate) and not base_model_paths:
                meta = try_load(meta_candidate)
                if isinstance(meta, dict):
                    base_names = meta.get("base_models") or meta.get("base_model_paths") or []
                    if base_names:
                        base_model_paths = [os.path.join(default_dir, b) if not os.path.isabs(b) else b for b in base_names]
                    scaler_name = meta.get("scaler") or meta.get("scaler_path")
                    if scaler_name and not scaler_path:
                        scaler_path = os.path.join(default_dir, scaler_name) if not os.path.isabs(scaler_name) else scaler_name

        self.meta_model = try_load(meta_model_path) if meta_model_path else None
        self.base_models = [
            model for model in (try_load(p) for p in (base_model_paths or []))
            if model is not None
        ]
        self.scaler = try_load(scaler_path) if scaler_path else None


    def predict(self, sequence):
        x = np.asarray(sequence)
        
        # Ensure x is at least 2D; if 1D, reshape to (1, -1)
        if x.ndim == 1:
            x = x.reshape(1, -1)
        
        if self.scaler:
            try:
                # scaler may expect 2D
                x = self.scaler.transform(x)
            except Exception:
                pass

        base_preds = []
        for m in self.base_models:
            try:
                if m is None:
                    continue
                
                # Determine input shape for this model
                if _is_keras_model(m):
                    # Keras model: inspect input_shape
                    input_shape = m.input_shape
                    if isinstance(input_shape, (list, tuple)):
                        # input_shape is typically (batch, timesteps, features) or (batch, features)
                        if len(input_shape) == 3:
                            # Expects 3D input (batch, timesteps, features)
                            try:
                                x_reshaped = x.reshape(1, x.shape[0], x.shape[1])
                                p = m.predict(x_reshaped)
                            except Exception:
                                base_preds.append(0.0)
                                continue
                        elif len(input_shape) == 2:
                            # Expects 2D input (batch, features)
                            try:
                                x_reshaped = x.reshape(1, -1)
                                p = m.predict(x_reshaped)
                            except Exception:
                                base_preds.append(0.0)
                                continue
                        else:
                            # Fallback: try as-is
                            p = m.predict(x)
                    else:
                        # Fallback: try as-is
                        p = m.predict(x)
                else:
                    # sklearn-style model: always pass 2D (batch, features)
                    try:
                        x_reshaped = x.reshape(1, -1)
                        p = m.predict(x_reshaped)
                    except Exception:
                        base_preds.append(0.0)
                        continue
                
                # Extract prediction value
                if hasattr(p, "__len__"):
                    base_preds.append(float(np.mean(p)))
                else:
                    base_preds.append(float(p))
            except Exception:
                base_preds.append(0.0)

        if self.meta_model and base_preds:
            try:
                # Meta-model (LSTM) expects 3D input: (samples, timesteps, features)
                # Here we have 1 sample, 1 timestep, len(base_preds) features
                try:
                    inp = np.asarray(base_preds).reshape(1, 1, -1)
                except Exception:
                    inp = np.asarray(base_preds).reshape(1, -1)
                
                risk = float(self.meta_model.predict(inp)[0])
                return {"risk_score": risk, "base_predictions": base_preds}
            except Exception:
                pass

        # fallback
        risk = float(x.mean()) if x.size else 0.0
        return {"risk_score": risk, "base_predictions": base_preds}
 