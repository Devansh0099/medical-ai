from pydantic import BaseModel

class KidneyInput(BaseModel):
    age: int
    blood_pressure: float
    albumin: int
    blood_urea: float
    serum_creatinine: float
    egfr: float
    hemoglobin: float
    diabetes: int