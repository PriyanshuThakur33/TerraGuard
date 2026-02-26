from pydantic import BaseModel
from typing import List

class SensorInput(BaseModel):
    features: List[float]