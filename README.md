# 🔍 Fraud Detection System

![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React+Vite-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_EC2-FF9900?logo=amazonaws&logoColor=white)
![CI/CD](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

> AI-powered financial fraud detection — React + FastAPI + Random Forest, containerized with Docker, deployed on AWS EC2 with automated CI/CD.

🌐 **Live:** http://13.232.115.1

---

## ⚡ Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------| 
| Frontend | React 18 + Vite 7 + Nginx     |
| Backend  | FastAPI + Uvicorn             |
| ML       | Scikit-learn Random Forest    |
| Infra    | AWS EC2 t3.micro + Elastic IP |
| DevOps   | Docker + GitHub Actions CI/CD |

---

## 🤖 Model

| Metric         | Value                                   |
|----------------|-----------------------------------------|
| Algorithm      | Random Forest                           |
| Dataset        | Kaggle Credit Card Fraud (284,807 rows) |
| Precision      | 0.96                                    |
| F1 Score       | 0.84                                    |
| Input Features | 30 (Time, V1–V28, Amount)               |

---

## 🏗️ Architecture
```
User → http://13.232.115.1 → Nginx (port 80) → React UI
                                    ↓
                     React → POST /predict → FastAPI (port 8000) → Model → Risk Score
```
```
git push → GitHub Actions → SSH into EC2 → git pull → docker build → docker run ✅
```

---

## 📊 API

**POST /predict**
```json
// Request
{ "features": [0.0, -1.35, -0.07, ...] }

// Response
{ "prediction": 1, "fraud_detected": true, "risk_score": 71.0, "risk_level": "HIGH RISK" }
```

Risk: `0–29 LOW` · `30–69 MEDIUM` · `70–100 HIGH`

**GET /health** → model status

---

## 🛠️ Local Setup
```bash
git clone https://github.com/PranavB110/fraud-detection-system.git
cd fraud-detection-system
```

**Backend**
```bash
cd backend
python -m venv venv && source venv/Scripts/activate
pip install fastapi uvicorn scikit-learn pandas numpy joblib
uvicorn main:app --reload
```

> ⚠️ `model.pkl` and `scaler.pkl` are not in the repo. Run `day5_preprocessing_model.ipynb` → `day6_save_model.ipynb` to generate them.

**Frontend**
```bash
cd frontend
npm install && npm run dev
```

---

## 🐳 Docker
```bash
docker build -t fraud-api ./backend && docker run -d -p 8000:8000 fraud-api
docker build -t frontend-app ./frontend && docker run -d -p 80:80 frontend-app
```

---

**Author:** [PranavB110](https://github.com/PranavB110)