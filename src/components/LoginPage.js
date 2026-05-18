import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [consumerKey, setConsumerKey] = useState('');
  const [orgType, setOrgType] = useState('production');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!consumerKey.trim()) {
      setError('Please enter your Consumer Key');
      return;
    }
    const loginUrl = orgType === 'sandbox' 
      ? 'https://test.salesforce.com' 
      : 'https://login.salesforce.com';
    onLogin(loginUrl, consumerKey.trim());
  };

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      <div className="login-bg-glow" />

      <nav className="login-nav">
        <div className="nav-logo">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path d="M13.3 6.4a5.9 5.9 0 0 1 4.5-2.1 5.9 5.9 0 0 1 5.3 3.3 4.7 4.7 0 0 1 1.9-.4 4.8 4.8 0 0 1 4.8 4.8 4.8 4.8 0 0 1-.5 2.1A4.1 4.1 0 0 1 31 18a4.1 4.1 0 0 1-4.1 4.1H8.3a5.1 5.1 0 0 1-5.1-5.1 5.1 5.1 0 0 1 3.5-4.8 5.6 5.6 0 0 1-.2-1.5 5.5 5.5 0 0 1 6.8-5.3z" fill="#00A1E0"/>
            </svg>
          <span>SF Validation Manager</span>
        </div>
      </nav>

      <main className="login-main">
        <div className="login-card">
          <div className="login-card-header">
            <div className="sf-cloud-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M13.3 6.4a5.9 5.9 0 0 1 4.5-2.1 5.9 5.9 0 0 1 5.3 3.3 4.7 4.7 0 0 1 1.9-.4 4.8 4.8 0 0 1 4.8 4.8 4.8 4.8 0 0 1-.5 2.1A4.1 4.1 0 0 1 31 18a4.1 4.1 0 0 1-4.1 4.1H8.3a5.1 5.1 0 0 1-5.1-5.1 5.1 5.1 0 0 1 3.5-4.8 5.6 5.6 0 0 1-.2-1.5 5.5 5.5 0 0 1 6.8-5.3z" fill="white"/>
              </svg>
            </div>
            <h1>Salesforce Validation<br/>Rule Manager</h1>
            <p>Enter your Salesforce Connected App credentials to manage Account validation rules.</p>
          </div>

          <div className="login-card-body">
            <div className="input-group">
              <label>Org Type</label>
              <select 
                value={orgType} 
                onChange={e => setOrgType(e.target.value)}
                className="login-select"
              >
                <option value="production">Production / Developer Org</option>
                <option value="sandbox">Sandbox</option>
              </select>
            </div>

            <div className="input-group">
              <label>Consumer Key (Client ID)</label>
              <input
                type="text"
                placeholder="Enter your Connected App Consumer Key"
                value={consumerKey}
                onChange={e => setConsumerKey(e.target.value)}
                className="login-input"
              />
              <small>Found in Salesforce Setup → App Manager → Your Connected App → Consumer Key</small>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button className="btn-login-sf" onClick={handleLogin}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M13.3 6.4a5.9 5.9 0 0 1 4.5-2.1 5.9 5.9 0 0 1 5.3 3.3 4.7 4.7 0 0 1 1.9-.4 4.8 4.8 0 0 1 4.8 4.8 4.8 4.8 0 0 1-.5 2.1A4.1 4.1 0 0 1 31 18a4.1 4.1 0 0 1-4.1 4.1H8.3a5.1 5.1 0 0 1-5.1-5.1 5.1 5.1 0 0 1 3.5-4.8 5.6 5.6 0 0 1-.2-1.5 5.5 5.5 0 0 1 6.8-5.3z" fill="white"/>
              </svg>
              <span>Log in with Salesforce</span>
              <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <div className="login-divider">
              <span>Uses OAuth 2.0 Implicit Flow</span>
            </div>

            <div className="login-features">
              <div className="feature-item">
                <div className="feature-dot green" />
                <span>Works with any Salesforce org</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot blue" />
                <span>Tooling API for Validation Rules</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot orange" />
                <span>Real-time Deploy via Tooling API</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <p>Built for CloudVandana ASE Assignment • OAuth 2.0 + Salesforce Tooling API</p>
      </footer>
    </div>
  );
}

export default LoginPage;