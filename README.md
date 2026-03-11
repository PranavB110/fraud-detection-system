# 🔍 Fraud Detection System

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-green)
![React](https://img.shields.io/badge/React+Vite-61DAFB)

AI-powered financial fraud detection system. Analyzes transactions using a Random Forest model and returns a real-time risk score — built as a full-stack web app with React + FastAPI.

---

## 🏗️ Architecture
```
React (Vite) → POST /predict → FastAPI → RandomForest → Risk Score
```

## 🤖 Model Performance
| Metric | Value |
|--------|-------|
| Algorithm | Random Forest |
| Dataset | Kaggle Credit Card Fraud (284,807 rows) |
| Precision | 0.96 |
| F1 Score | 0.84 |
| Features | 30 (Time, V1–V28, Amount) |

## 🛠️ Tech Stack
React + Vite · FastAPI · Scikit-learn · Docker (coming) · GitHub Actions (coming)

---

## ⚙️ Setup

### 1. Clone
```bash
git clone https://github.com/PranavB110/fraud-detection-system.git
cd fraud-detection-system
```

### 2. Dataset
Download `creditcard.csv` from [Kaggle](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) and place it in the project root.

### 3. Backend
```bash
python -m venv venv
source venv/Scripts/activate   # Windows
pip install fastapi uvicorn scikit-learn pandas numpy joblib
```

> ⚠️ `model.pkl` and `scaler.pkl` are not included in the repo.
> Run notebooks `day5_preprocessing_model.ipynb` → `day6_save_model.ipynb` to generate them, then copy both to `backend/`.
```bash
cd backend
uvicorn main:app --reload
# API running at http://localhost:8000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
# UI running at http://localhost:5173
```

---

## 📊 API

**POST /predict**
```json
// Request
{ "features": [0.0, -1.35, -0.07, ...] }  // 30 values: Time, V1-V28, Amount

// Response
{ "prediction": 1, "fraud_detected": true, "risk_score": 71.0, "risk_level": "HIGH RISK" }
```

Risk levels: `0-29 LOW` · `30-69 MEDIUM` · `70-100 HIGH`

---

## 🐳 Docker · 🔁 CI/CD · 🌐 Deployment
> In progress — will be updated after completion.

---

**Author:** [PranavB110](https://github.com/PranavB110)