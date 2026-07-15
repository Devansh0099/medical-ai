from fastapi import APIRouter
import pandas as pd

from schemas.kidney import KidneyInput
from utils.load_models import kidney_model

router = APIRouter(
    prefix="/predict",
    tags=["Kidney"]
)

@router.post("/kidney")
def predict(data: KidneyInput):

    df = pd.DataFrame([{
        "Age of the patient": data.age,
        "Blood pressure (mm/Hg)": data.blood_pressure,
        "Albumin in urine": data.albumin,
        "Blood urea (mg/dl)": data.blood_urea,
        "Serum creatinine (mg/dl)": data.serum_creatinine,
        "Estimated Glomerular Filtration Rate (eGFR)": data.egfr,
        "Hemoglobin level (gms)": data.hemoglobin,
        "Diabetes mellitus (yes/no)": data.diabetes
    }])

    prediction = kidney_model.predict(df)[0]
    confidence = kidney_model.predict_proba(df)[0].max()

    return {
        "prediction": int(prediction),
        "confidence": round(float(confidence * 100),2)
    }