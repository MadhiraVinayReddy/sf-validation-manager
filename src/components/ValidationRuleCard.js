import React from 'react';
import './ValidationRuleCard.css';

function ValidationRuleCard({ rule, index, isPending, onToggle }) {
  const handleToggle = () => {
    onToggle(rule.Id, !rule.Active);
  };

  return (
    <div className={`rule-card ${rule.Active ? 'active' : 'inactive'} ${isPending ? 'pending' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}>
      
      <div className="rule-card-header">
        <div className="rule-title-row">
          <div className="rule-index">#{index + 1}</div>
          <h3 className="rule-name">{rule.ValidationName}</h3>
        </div>
        <div className="rule-status-badge">
          {isPending && <span className="pending-dot" title="Pending deploy" />}
          <span className={`status-badge ${rule.Active ? 'active' : 'inactive'}`}>
            {rule.Active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {rule.Description && (
        <p className="rule-description">{rule.Description}</p>
      )}

      <div className="rule-meta">
        {rule.ErrorMessage && (
          <div className="rule-meta-item">
            <span className="meta-label">Error Message</span>
            <span className="meta-value error-msg">{rule.ErrorMessage}</span>
          </div>
        )}
        {rule.ErrorDisplayField && (
          <div className="rule-meta-item">
            <span className="meta-label">Display Field</span>
            <span className="meta-value mono">{rule.ErrorDisplayField || 'Page Level'}</span>
          </div>
        )}
        <div className="rule-meta-item">
          <span className="meta-label">Rule ID</span>
          <span className="meta-value mono id-val">{rule.Id}</span>
        </div>
      </div>

      <div className="rule-card-footer">
        <label className="toggle-switch" title={rule.Active ? 'Click to deactivate' : 'Click to activate'}>
          <input
            type="checkbox"
            checked={rule.Active}
            onChange={handleToggle}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          <span className="toggle-label">{rule.Active ? 'Enabled' : 'Disabled'}</span>
        </label>

        {isPending && (
          <span className="pending-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Pending Deploy
          </span>
        )}
      </div>
    </div>
  );
}

export default ValidationRuleCard;
