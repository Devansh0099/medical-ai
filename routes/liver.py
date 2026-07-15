from fastapi import APIRouter
import pandas as pd

from schemas.liver import LiverInput
from utils.load_models import liver_model

router = APIRouter(
    prefix="/predict",
    tags=["Liver"]
)

@router.post("/liver")
def predict(data: LiverInput):

    df = pd.DataFrame([{
        "Age of the patient": data.age,
        "Total Bilirubin": data.total_bilirubin,
        "Direct Bilirubin": data.direct_bilirubin,
        "Alkphos Alkaline Phosphotase": data.alp,
        "Sgpt Alamine Aminotransferase": data.alt,
        "Sgot Aspartate Aminotransferase": data.ast,
        "ALB Albumin": data.albumin
    }])

    prediction = liver_model.predict(df)[0]
    confidence = liver_model.predict_proba(df)[0].max()

    return {
        "prediction": int(prediction),
        "confidence": round(float(confidence * 100),2)
    }