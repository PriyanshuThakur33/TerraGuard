import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

APP_NAME = os.getenv("APP_NAME", "TerraGuard")