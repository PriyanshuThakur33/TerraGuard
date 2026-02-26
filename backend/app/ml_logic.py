import os
import joblib
import numpy as np
import keras
from keras.models import load_model
from keras import Model
from typing import cast 
from app.config import MODELS_DIR
from app.utils import reshape_input

#classification
clf_model = cast(
    Model, 
    load_model(os.path.join(MODELS_DIR, "classification", "classification_lstm.h5"), compile=False))

clf_scaler = joblib.load(
    os.path.join(MODELS_DIR, "classification", "classification_scaler.pkl")
)

clf_imputer = joblib.load(
    os.path.join(MODELS_DIR, "classification", "classification_imputer.pkl")
)

#regression
xgb_model = joblib.load(
    os.path.join(MODELS_DIR, "regression", "regression_xgb.pkl")
)

rf_model = joblib.load(
    os.path.join(MODELS_DIR, "regression", "regression_rf.pkl")
)

dt_model = joblib.load(
    os.path.join(MODELS_DIR, "regression", "regression_dt.pkl")
)

meta_lstm = cast(
    Model, 
    load_model(os.path.join(MODELS_DIR, "regression", "regression_meta_lstm.h5"), compile=False))

reg_scaler = joblib.load(
    os.path.join(MODELS_DIR, "regression", "regression_scaler.pkl")
)

print("Classification scaler expects:", clf_scaler.n_features_in_)
print("Regression scaler expects:", reg_scaler.n_features_in_)


def classify(features: list):
    try:
        data = reshape_input(features)

        data = clf_imputer.transform(data)
        data = clf_scaler.transform(data)
        data = data.reshape(1, 1, clf_scaler.n_features_in_)

        prediction = clf_model.predict(data)

        class_id = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        class_map = {
            0: "Low",
            1: "Moderate",
            2: "High",
            3: "Critical"
        }


        return {
            "status": "success",
            "prediction": class_map[class_id],
            "confidence": confidence
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def regress(features: list):
    try:
        data = reshape_input(features)
        data = reg_scaler.transform(data)

        #base models
        xgb_pred = float(xgb_model.predict(data)[0])
        rf_pred = float(rf_model.predict(data)[0])
        dt_pred = float(dt_model.predict(data)[0])

        stacked_input = np.array([[xgb_pred, rf_pred, dt_pred]])

        stacked_input = stacked_input.reshape(1,1,3)

        risk_score = float(meta_lstm.predict(stacked_input)[0][0])

        if risk_score < 8:
            level = "Low"
        elif risk_score < 20:
            level = "Moderate"
        elif risk_score < 35:
            level = "High"
        else:
            level = "Critical"


        return {
            "status": "success",
            "risk_score": float(risk_score),
            "risk_level": level,
            "base_predictions": {
                "xgb": xgb_pred,
                "rf": rf_pred,
                "dt": dt_pred
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }