import { useState } from 'react'

const SAMPLE_LEGITIMATE = '-1.3598071336738,-0.0727811733098497,2.53634673796914,1.37815522427443,-0.338320769942518,0.462387777762292,0.239598554061257,0.0986979012610507,0.363786969611213,0.0907941719789316,-0.551599533260813,-0.617800855762348,-0.991389847235408,-0.311169353699879,1.46817697209427,-0.470400525259478,0.207971241929242,0.0257905801985591,0.403992960255733,0.251412098239705,-0.018306777944153,0.277837575558899,-0.110473910188767,0.0669280749146731,0.128539358273528,-0.189114843888824,0.133558376740387,-0.0210530534538215,0.0,149.62'

const SAMPLE_FRAUD = '4462.0,-2.30334956758553,1.759247460267,-0.359744743330052,2.33024305053917,-0.821628328375422,-0.0757875706194599,0.562319782266954,-0.399146578487216,-0.238253367661746,-1.52541162656194,2.03291215755072,-6.56012429505962,0.0229373234890961,-1.47010153611197,-0.698826068579047,-2.28219382856251,-4.78183085597533,-2.61566494476124,-1.33444106667307,-0.430021867171611,-0.294166317554753,-0.932391057274991,0.172726295799422,-0.0873295379700724,-0.156114264651172,-0.542627889040196,0.0395659889264757,-0.153028796529788,239.93'

function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const handleSubmit = async () => {
    setError(null)
    setResult(null)

    const values = input.split(',').map(v => parseFloat(v.trim()))

    if (values.length !== 30 || values.some(isNaN)) {
      setError('Please enter exactly 30 valid numeric values separated by commas.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://43.205.192.243:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: values })
      })

      const data = await response.json()
      setResult(data)
      setHistory(prev => [{
        ...data,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5))

    } catch (err) {
      setError('Could not connect to backend. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>🔍 Fraud Detection System</h1>
      <p className="subtitle">AI-powered financial transaction risk analysis</p>

      <div className="form-box">
        <div className="sample-buttons">
          <span className="sample-label">Quick Load:</span>
          <button className="sample-btn safe" onClick={() => setInput(SAMPLE_LEGITIMATE)}>
            ✅ Legitimate Transaction
          </button>
          <button className="sample-btn fraud" onClick={() => setInput(SAMPLE_FRAUD)}>
            🚨 Fraudulent Transaction
          </button>
        </div>

        <textarea
          rows={4}
          placeholder="Paste 30 comma-separated transaction features here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Transaction'}
        </button>
      </div>

      {error && (
        <div className="error-box">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className={`result-box ${result.fraud_detected ? 'high' : 'low'}`}>
          <h2>{result.fraud_detected ? '🚨 Fraud Detected' : '✅ Transaction Safe'}</h2>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Risk Score</span>
              <span className="result-value">{result.risk_score} / 100</span>
            </div>
            <div className="result-item">
              <span className="result-label">Risk Level</span>
              <span className="result-value">{result.risk_level}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Classification</span>
              <span className="result-value">{result.prediction === 1 ? 'Fraudulent' : 'Legitimate'}</span>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-box">
          <h3>Recent Predictions</h3>
          {history.map((item, i) => (
            <div key={i} className={`history-item ${item.fraud_detected ? 'high' : 'low'}`}>
              <span>{item.fraud_detected ? '🚨 Fraud' : '✅ Safe'}</span>
              <span>Score: {item.risk_score}</span>
              <span>{item.risk_level}</span>
              <span className="history-time">{item.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App