import os
import pytest
from fastapi.testclient import TestClient

# ── Detect if running in CI (no model files available)
IN_CI = not os.path.exists("model.pkl")

# ── File Structure Tests (skip in CI)
@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_model_file_exists():
    assert os.path.exists("model.pkl"), "model.pkl is missing"

@pytest.mark.skipif(IN_CI, reason="scaler.pkl not available in CI")
def test_scaler_file_exists():
    assert os.path.exists("scaler.pkl"), "scaler.pkl is missing"

def test_requirements_exists():
    assert os.path.exists("requirements.txt"), "requirements.txt is missing"

def test_dockerfile_exists():
    assert os.path.exists("Dockerfile"), "Dockerfile is missing"

# ── API Route Tests
@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_home():
    from main import app
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Fraud Detection API is running!"}

@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_health():
    from main import app
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["model"] == "Random Forest"

# ── Prediction Tests
@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_predict_valid_legitimate():
    from main import app
    client = TestClient(app)
    features = [-1.3598071336738, -0.0727811733098497, 2.53634673796914,
                1.37815522427443, -0.338320769942518, 0.462387777762292,
                0.239598554061257, 0.0986979012610507, 0.363786969611213,
                0.0907941719789316, -0.551599533260813, -0.617800855762348,
                -0.991389847235408, -0.311169353699879, 1.46817697209427,
                -0.470400525259478, 0.207971241929242, 0.0257905801985591,
                0.403992960255733, 0.251412098239705, -0.018306777944153,
                0.277837575558899, -0.110473910188767, 0.0669280749146731,
                0.128539358273528, -0.189114843888824, 0.133558376740387,
                -0.0210530534538215, 0.0, 149.62]
    response = client.post("/predict", json={"features": features})
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "fraud_detected" in data
    assert "risk_score" in data
    assert "risk_level" in data
    assert data["risk_level"] in ["LOW RISK", "MEDIUM RISK", "HIGH RISK"]
    assert 0 <= data["risk_score"] <= 100

@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_predict_valid_fraud():
    from main import app
    client = TestClient(app)
    features = [4462.0, -2.30334956758553, 1.759247460267,
                -0.359744743330052, 2.33024305053917, -0.821628328375422,
                -0.0757875706194599, 0.562319782266954, -0.399146578487216,
                -0.238253367661746, -1.52541162656194, 2.03291215755072,
                -6.56012429505962, 0.0229373234890961, -1.47010153611197,
                -0.698826068579047, -2.28219382856251, -4.78183085597533,
                -2.61566494476124, -1.33444106667307, -0.430021867171611,
                -0.294166317554753, -0.932391057274991, 0.172726295799422,
                -0.0873295379700724, -0.156114264651172, -0.542627889040196,
                0.0395659889264757, -0.153028796529788, 239.93]
    response = client.post("/predict", json={"features": features})
    assert response.status_code == 200
    data = response.json()
    assert data["fraud_detected"] == True
    assert data["risk_score"] > 70

@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_predict_wrong_count():
    from main import app
    client = TestClient(app)
    response = client.post("/predict", json={"features": [1.0, 2.0, 3.0]})
    assert response.status_code == 200
    assert "error" in response.json()

@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_predict_empty_array():
    from main import app
    client = TestClient(app)
    response = client.post("/predict", json={"features": []})
    assert response.status_code == 200
    assert "error" in response.json()

@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_predict_wrong_type():
    from main import app
    client = TestClient(app)
    response = client.post("/predict", json={"features": "not_a_list"})
    assert response.status_code == 422

@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_predict_boundary_29():
    from main import app
    client = TestClient(app)
    response = client.post("/predict", json={"features": [0.0] * 29})
    assert response.status_code == 200
    assert "error" in response.json()

@pytest.mark.skipif(IN_CI, reason="model.pkl not available in CI")
def test_predict_boundary_31():
    from main import app
    client = TestClient(app)
    response = client.post("/predict", json={"features": [0.0] * 31})
    assert response.status_code == 200
    assert "error" in response.json()