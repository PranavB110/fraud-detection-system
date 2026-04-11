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
      const response = await fetch('http://13.232.115.1:8000/predict', {
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
    <div className="page">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <div className="brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="#6ea8fe"/>
              </svg>
            </div>
            <span className="brand-name">FraudGuard AI</span>
          </div>
          <div className="nav-links">
            <a href="#analyzer" className="nav-link">Analyzer</a>
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="http://13.232.115.1:8000/docs" target="_blank" rel="noreferrer" className="nav-link">API Docs</a>
            <a href="https://github.com/PranavB110/fraud-detection-system" target="_blank" rel="noreferrer" className="nav-btn">GitHub</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="badge-dot" />
            Live on AWS EC2 · Model Accuracy 96%
          </div>
          <h1 className="hero-title">
            Detect Financial Fraud<br />
            <span className="hero-accent">in Milliseconds</span>
          </h1>
          <p className="hero-sub">
            AI-powered transaction risk analysis using Random Forest trained on 284,807 real transactions.
            Get instant LOW / MEDIUM / HIGH risk classification.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">96%</span>
              <span className="hero-stat-label">Precision</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">0.84</span>
              <span className="hero-stat-label">F1 Score</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">284K</span>
              <span className="hero-stat-label">Transactions Trained</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">&lt;100ms</span>
              <span className="hero-stat-label">Response Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how-it-works">
        <div className="section-inner">
          <p className="section-label">How it works</p>
          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <div className="step-text">
                <div className="step-title">Paste Features</div>
                <div className="step-desc">Input 30 comma-separated transaction values (V1–V28 + Time + Amount)</div>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">02</div>
              <div className="step-text">
                <div className="step-title">ML Analysis</div>
                <div className="step-desc">Random Forest model scores the transaction in real time via FastAPI</div>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">03</div>
              <div className="step-text">
                <div className="step-title">Risk Result</div>
                <div className="step-desc">Instant verdict — risk score, level, and fraud classification</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ANALYZER ── */}
      <section className="analyzer-section" id="analyzer">
        <div className="section-inner">
          <p className="section-label">Transaction Analyzer</p>
          <div className="analyzer-grid">

            {/* Input panel */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Input Transaction</span>
                <div className="sample-buttons">
                  <button className="sample-btn safe" onClick={() => { setInput(SAMPLE_LEGITIMATE); setResult(null); setError(null); }}>
                    Load Legitimate
                  </button>
                  <button className="sample-btn fraud" onClick={() => { setInput(SAMPLE_FRAUD); setResult(null); setError(null); }}>
                    Load Fraud
                  </button>
                </div>
              </div>
              <div className="panel-body">
                <p className="input-hint">Paste 30 comma-separated values — V1 through V28, then Time, then Amount</p>
                <textarea
                  rows={6}
                  placeholder="e.g. -1.359, -0.072, 2.536, ... , 149.62"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                {error && (
                  <div className="error-box">
                    ⚠ {error}
                  </div>
                )}
                <button className="analyze-btn" onClick={handleSubmit} disabled={loading}>
                  {loading
                    ? <><span className="spinner" /> Analyzing...</>
                    : '→ Analyze Transaction'
                  }
                </button>
              </div>
            </div>

            {/* Result panel */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Risk Analysis</span>
              </div>
              <div className="panel-body">
                {!result ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="#2a3a5a" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </div>
                    <p>Submit a transaction to see the analysis</p>
                  </div>
                ) : (
                  <div className="result-content">
                    <div className={`verdict-banner ${result.fraud_detected ? 'high' : 'low'}`}>
                      <span className="verdict-icon">{result.fraud_detected ? '⚠' : '✓'}</span>
                      <span className="verdict-text">{result.fraud_detected ? 'Fraud Detected' : 'Transaction Legitimate'}</span>
                    </div>

                    <div className="score-section">
                      <div className="score-label">Risk Score</div>
                      <div className="score-value">{result.risk_score}<span className="score-max">/100</span></div>
                      <div className="score-bar-track">
                        <div
                          className="score-bar-fill"
                          style={{
                            width: `${result.risk_score}%`,
                            backgroundColor: result.risk_score >= 70 ? '#e53e3e' : result.risk_score >= 40 ? '#d97706' : '#2563eb'
                          }}
                        />
                      </div>
                    </div>

                    <div className="result-grid">
                      <div className="result-item">
                        <span className="result-label">Risk Level</span>
                        <span className={`result-value risk-${result.risk_level?.toLowerCase()}`}>{result.risk_level}</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Classification</span>
                        <span className="result-value">{result.prediction === 1 ? 'Fraudulent' : 'Legitimate'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="history-box">
              <div className="panel-header">
                <span className="panel-title">Recent Analyses</span>
                <span className="history-count">{history.length} total this session</span>
              </div>
              <div className="history-list">
                {history.map((item, i) => (
                  <div key={i} className={`history-item ${item.fraud_detected ? 'high' : 'low'}`}>
                    <span className="history-verdict">{item.fraud_detected ? 'Fraud' : 'Legitimate'}</span>
                    <span className="history-score">Score: {item.risk_score}</span>
                    <span className={`history-level risk-${item.risk_level?.toLowerCase()}`}>{item.risk_level}</span>
                    <span className="history-time">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="brand">
            <div className="brand-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="#6ea8fe"/>
              </svg>
            </div>
            <span className="brand-name" style={{ fontSize: '0.85rem' }}>FraudGuard AI</span>
          </div>
          <p className="footer-text">Built with FastAPI · React · Docker · AWS EC2 · GitHub Actions</p>
        </div>
      </footer>

    </div>
  )
}

export default App