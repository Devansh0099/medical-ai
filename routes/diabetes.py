from fastapi import APIRouter
import pandas as pd

from schemas.diabetes import DiabetesInput
from utils.load_models import diabetes_model

router = APIRouter(
    prefix="/predict",
    tags=["Diabetes"]
)

@router.post("/diabetes")
def predict(data: DiabetesInput):

    df = pd.DataFrame([data.model_dump()])

    prediction = diabetes_model.predict(df)[0]

    probability = diabetes_model.predict_proba(df)[0].max()

    return {
        "prediction": int(prediction),
        "confidence": round(float(probability * 100),2)
    }