import React, { useState, useCallback } from 'react';
import './Dashboard.css';
import ValidationRuleCard from './ValidationRuleCard';
import DeployModal from './DeployModal';

function Dashboard({ accessToken, instanceUrl, userInfo, onLogout }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showDeploy, setShowDeploy] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [deployResult, setDeployResult] = useState(null);
  const [fetched, setFetched] = useState(false);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const fetchValidationRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRules([]);
    setPendingChanges({});
    setDeployResult(null);

    try {
      const res = await fetch(
        `https://sf-validation-manager-hmd5.onrender.com/api/rules?instanceUrl=${encodeURIComponent(instanceUrl)}&token=${accessToken}`
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setRules(data.records || []);
      setFetched(true);
      showSuccess(`Fetched ${data.records?.length || 0} validation rules`);
    } catch (err) {
      setError(`Failed to fetch rules: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [accessToken, instanceUrl]);

  const toggleRule = useCallback((ruleId, newActive) => {
    setRules(prev =>
      prev.map(r => r.Id === ruleId ? { ...r, Active: newActive } : r)
    );
    setPendingChanges(prev => ({ ...prev, [ruleId]: newActive }));
  }, []);

  const toggleAll = useCallback((activate) => {
    const newPending = {};
    setRules(prev =>
      prev.map(r => {
        newPending[r.Id] = activate;
        return { ...r, Active: activate };
      })
    );
    setPendingChanges(newPending);
  }, []);

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  const handleDeploy = useCallback(async () => {
    setDeploying(true);
    setError(null);
    setShowDeploy(false);

    const results = [];
    const errors = [];

    for (const [ruleId, active] of Object.entries(pendingChanges)) {
      try {
        const res = await fetch('https://sf-validation-manager-hmd5.onrender.com/api/rules/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instanceUrl, token: accessToken, ruleId, active }),
        });

        const ruleName = rules.find(r => r.Id === ruleId)?.ValidationName || ruleId;

        if (res.ok || res.status === 204) {
          results.push({ id: ruleId, name: ruleName, active, success: true });
        } else {
          const errData = await res.json().catch(() => ({}));
          errors.push({ id: ruleId, name: ruleName, error: errData.error || `HTTP ${res.status}` });
        }
      } catch (err) {
        const ruleName = rules.find(r => r.Id === ruleId)?.ValidationName || ruleId;
        errors.push({ id: ruleId, name: ruleName, error: err.message });
      }
    }

    setPendingChanges({});
    setDeploying(false);
    setDeployResult({ results, errors });

    if (errors.length === 0) {
      showSuccess(`Successfully deployed ${results.length} change(s)`);
    }
  }, [pendingChanges, accessToken, instanceUrl, rules]);

  const activeCount = rules.filter(r => r.Active).length;
  const inactiveCount = rules.length - activeCount;
  const changedCount = Object.keys(pendingChanges).length;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header-left">
          <div className="dash-logo">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M13.3 6.4a5.9 5.9 0 0 1 4.5-2.1 5.9 5.9 0 0 1 5.3 3.3 4.7 4.7 0 0 1 1.9-.4 4.8 4.8 0 0 1 4.8 4.8 4.8 4.8 0 0 1-.5 2.1A4.1 4.1 0 0 1 31 18a4.1 4.1 0 0 1-4.1 4.1H8.3a5.1 5.1 0 0 1-5.1-5.1 5.1 5.1 0 0 1 3.5-4.8 5.6 5.6 0 0 1-.2-1.5 5.5 5.5 0 0 1 6.8-5.3z" fill="#00A1E0"/>
            </svg>
            <div>
              <span className="dash-logo-title">SF Validation Manager</span>
              <span className="dash-logo-sub">Account Object</span>
            </div>
          </div>
        </div>
        <div className="dash-header-right">
          <div className="user-badge">
            <div className="user-avatar">
              {userInfo?.display_name?.[0] || userInfo?.name?.[0] || '?'}
            </div>
            <div className="user-info">
              <span className="user-name">{userInfo?.display_name || userInfo?.name || 'User'}</span>
              <span className="user-org">{instanceUrl?.replace('https://', '').split('.')[0]}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={onLogout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </header>

      {successMsg && (
        <div className="toast toast-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          {successMsg}
        </div>
      )}
      {error && (
        <div className="toast toast-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
          <button className="toast-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <main className="dash-main">
        <div className="action-bar">
          <div className="action-bar-left">
            <h1 className="page-title">Validation Rules</h1>
            {fetched && (
              <div className="stats-row">
                <span className="stat-chip total">{rules.length} Total</span>
                <span className="stat-chip active">{activeCount} Active</span>
                <span className="stat-chip inactive">{inactiveCount} Inactive</span>
                {changedCount > 0 && <span className="stat-chip pending">{changedCount} Pending</span>}
              </div>
            )}
          </div>

          <div className="action-bar-right">
            <button className="btn btn-primary" onClick={fetchValidationRules} disabled={loading}>
              {loading ? (
                <><span className="btn-spinner" />Fetching...</>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  Get Validation Rules
                </>
              )}
            </button>

            {fetched && rules.length > 0 && (
              <>
                <button className="btn btn-secondary" onClick={() => toggleAll(true)} disabled={deploying}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  Enable All
                </button>
                <button className="btn btn-secondary" onClick={() => toggleAll(false)} disabled={deploying}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Disable All
                </button>
                <button
                  className={`btn btn-deploy ${hasPendingChanges ? 'has-changes' : ''}`}
                  onClick={() => setShowDeploy(true)}
                  disabled={!hasPendingChanges || deploying}
                >
                  {deploying ? (
                    <><span className="btn-spinner white" />Deploying...</>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="16,16 12,12 8,16"/>
                        <line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                      </svg>
                      Deploy {changedCount > 0 ? `(${changedCount})` : ''}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {deployResult && (
          <div className={`deploy-result ${deployResult.errors.length > 0 ? 'has-errors' : 'success'}`}>
            <div className="deploy-result-header">
              <strong>Deploy Result</strong>
              <button onClick={() => setDeployResult(null)}>×</button>
            </div>
            {deployResult.results.length > 0 && (
              <div className="deploy-result-list">
                {deployResult.results.map(r => (
                  <div key={r.id} className="deploy-result-item success">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                    {r.name} → {r.active ? 'Activated' : 'Deactivated'}
                  </div>
                ))}
              </div>
            )}
            {deployResult.errors.length > 0 && (
              <div className="deploy-result-list">
                {deployResult.errors.map(r => (
                  <div key={r.id} className="deploy-result-item error">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                    {r.name}: {r.error}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!fetched && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h2>No Rules Loaded</h2>
            <p>Click <strong>"Get Validation Rules"</strong> to fetch all Account validation rules from your Salesforce org.</p>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="loading-bars">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="loading-bar" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <p>Fetching validation rules from Salesforce...</p>
          </div>
        )}

        {fetched && rules.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h2>No Validation Rules Found</h2>
            <p>The Account object has no validation rules in your org.</p>
          </div>
        )}

        {rules.length > 0 && (
          <div className="rules-grid">
            {rules.map((rule, idx) => (
              <ValidationRuleCard
                key={rule.Id}
                rule={rule}
                index={idx}
                isPending={rule.Id in pendingChanges}
                onToggle={toggleRule}
              />
            ))}
          </div>
        )}
      </main>

      {showDeploy && (
        <DeployModal
          pendingChanges={pendingChanges}
          rules={rules}
          onConfirm={handleDeploy}
          onCancel={() => setShowDeploy(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;