from fastapi import APIRouter
import pandas as pd

from schemas.heart import HeartInput
from utils.load_models import heart_model

router = APIRouter(
    prefix="/predict",
    tags=["Heart"]
)

@router.post("/heart")
def predict(data: HeartInput):

    df = pd.DataFrame([data.model_dump()])

    prediction = heart_model.predict(df)[0]
    confidence = heart_model.predict_proba(df)[0].max()

    return {
        "prediction": int(prediction),
        "confidence": round(float(confidence * 100),2)
    }