from pydantic import BaseModel

class LiverInput(BaseModel):
    age: int
    total_bilirubin: float
    direct_bilirubin: float
    alp: float
    alt: float
    ast: float
    albumin: float