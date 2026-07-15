from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.diabetes import router as diabetes_router
from routes.heart import router as heart_router
from routes.kidney import router as kidney_router
from routes.liver import router as liver_router

app = FastAPI(
    title="AI Medical Diagnosis API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(diabetes_router)
app.include_router(heart_router)
app.include_router(kidney_router)
app.include_router(liver_router)

@app.get("/")
def home():
    return {
        "message": "AI Medical Diagnosis API Running"
    }