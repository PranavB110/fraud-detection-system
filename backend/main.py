# ── Imports ──────────────────────────────────────────────
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import logging
import warnings
warnings.filterwarnings("ignore")

# ── Logging Setup ─────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ── App Setup ─────────────────────────────────────────────
app = FastAPI()

# ── CORS Middleware ───────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'http://localhost:5173'],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load Model ────────────────────────────────────────────
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")
logger.info("Model loaded successfully")
logger.info("Scaler loaded successfully")

# ── Input Schema ──────────────────────────────────────────
class Transaction(BaseModel):
    features: List[float]

# ── Routes ────────────────────────────────────────────────
@app.get("/")
def home():
    return {"message": "Fraud Detection API is running!"}

@app.get("/health")
def health():
    return {"status": "ok", "model": "Random Forest", "version": "1.0"}

@app.post("/predict")
def predict(transaction: Transaction):

    logger.info(f"Prediction requested - features received: {len(transaction.features)}")

    # ── Input Validation ─────────────────────────────────
    if len(transaction.features) != 30:
        logger.error(f"Invalid input - expected 30 features, got {len(transaction.features)}")
        return {
            "error": f"Expected 30 features, received {len(transaction.features)}"
        }

    # ── Prediction ────────────────────────────────────────
    try:
        data = np.array(transaction.features).reshape(1, -1)
        data_scaled = scaler.transform(data)

        prediction = model.predict(data_scaled)[0]
        probability = model.predict_proba(data_scaled)[0][1]

        risk_score = round(probability * 100, 2)

        if risk_score < 30:
            risk_level = "LOW RISK"
        elif risk_score < 70:
            risk_level = "MEDIUM RISK"
        else:
            risk_level = "HIGH RISK"

        logger.info(f"Result - prediction: {int(prediction)} | risk_score: {risk_score} | level: {risk_level}")

        return {
            "prediction": int(prediction),
            "fraud_detected": bool(prediction == 1),
            "risk_score": risk_score,
            "risk_level": risk_level
        }

    except Exception as e:
        logger.error(f"Prediction failed - {str(e)}")
        return {
            "error": "Prediction failed. Please check your input and try again."
        }
