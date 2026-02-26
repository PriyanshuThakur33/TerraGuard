import time
import json
from simulation.dataset_loader import DatasetLoader
from simulation.state_manager import StateManager
from database.db_manager import DBManager
from alerts.alert_engine import AlertEngine
from models.classification_model import ClassificationModel
from models.regression_model import RegressionModel
from simulation.simulation_controller import SimulationController
import os

def main():
    # Use user-provided default paths
    class_xlsx = r"C:\Users\priya\OneDrive\Desktop\IIT Mandi\Data\classification_data.xlsx"
    reg_train = r"C:\Users\priya\OneDrive\Desktop\IIT Mandi\Data\regression_train.xlsx"
    reg_test = r"C:\Users\priya\OneDrive\Desktop\IIT Mandi\Data\regression_test.xlsx"

    ds = DatasetLoader()
    if os.path.exists(class_xlsx):
        ds.load(class_xlsx)
    else:
        print(f"Classification file not found: {class_xlsx}")
        return

    db = DBManager()
    state = StateManager()
    alert_engine = AlertEngine()

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    class_model_path = os.path.join(repo_root, "models", "classification", "classification_lstm.h5")
    reg_meta_path = os.path.join(repo_root, "models", "regression", "regression_meta_lstm.h5")

    class_model = ClassificationModel(model_path=class_model_path)
    reg_model = RegressionModel(meta_model_path=reg_meta_path)

    controller = SimulationController(ds, state, db, class_model, reg_model, alert_engine)
    print("Starting simulation for 5 seconds...")
    controller.start()
    time.sleep(5)
    controller.stop()

    history = db.fetch_history(limit=10)
    print(json.dumps(history, indent=2))

if __name__ == '__main__':
    main()
