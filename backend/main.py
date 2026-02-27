from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.simulation_routes import router as sim_router
import uvicorn

from app.schemas import SensorInput
from app.ml_logic import classify, regress

app = FastAPI(
    title="TerraGuard Simulation & AI Backend",
    version="1.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://terra-guard-three.vercel.app",
        "https://terra-guard-priyanshuthakur33s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include simulation routes  
app.include_router(sim_router)

@app.get("/")
def health_check():
    return {"message": "TerraGuard Backend Running"}

@app.post("/predict/classification")
def predict_classification(data: SensorInput):
    return classify(data.features)

@app.post("/predict/regression")
def predict_regression(data: SensorInput):
    return regress(data.features)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
