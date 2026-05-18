import React from 'react';
import './DeployModal.css';

function DeployModal({ pendingChanges, rules, onConfirm, onCancel }) {
  const changes = Object.entries(pendingChanges).map(([id, active]) => {
    const rule = rules.find(r => r.Id === id);
    return { id, name: rule?.ValidationName || id, active };
  });

  const activating = changes.filter(c => c.active);
  const deactivating = changes.filter(c => !c.active);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16,16 12,12 8,16"/>
              <line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
          </div>
          <div>
            <h2>Confirm Deploy</h2>
            <p>{changes.length} change{changes.length !== 1 ? 's' : ''} will be deployed to Salesforce</p>
          </div>
          <button className="modal-close" onClick={onCancel}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {activating.length > 0 && (
            <div className="change-group activating">
              <div className="change-group-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                Activating ({activating.length})
              </div>
              {activating.map(c => (
                <div key={c.id} className="change-item activating">
                  <span className="change-dot green" />
                  <span className="change-name">{c.name}</span>
                  <span className="change-arrow">→ Active</span>
                </div>
              ))}
            </div>
          )}

          {deactivating.length > 0 && (
            <div className="change-group deactivating">
              <div className="change-group-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Deactivating ({deactivating.length})
              </div>
              {deactivating.map(c => (
                <div key={c.id} className="change-item deactivating">
                  <span className="change-dot gray" />
                  <span className="change-name">{c.name}</span>
                  <span className="change-arrow">→ Inactive</span>
                </div>
              ))}
            </div>
          )}

          <div className="modal-warning">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>These changes will be applied directly to your Salesforce org via the Tooling API. This action affects live data validation.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-modal-confirm" onClick={onConfirm}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="16,16 12,12 8,16"/>
              <line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
            Deploy to Salesforce
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeployModal;
