import React, { useState, useEffect } from 'react';
import { X, GitPullRequest, Copy, Check, Download, FileJson, FileText } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, session }) {
  const [prData, setPrData] = useState(null);
  const [copiedType, setCopiedType] = useState(null);
  const [activeTab, setActiveTab] = useState('pr'); // 'pr', 'diff', 'sarif'

  useEffect(() => {
    if (isOpen && session) {
      fetch('http://127.0.0.1:8000/api/export/pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.session_id,
          scenario_id: session.scenario_id,
          patch_id: session.patch?.patch_id || 'patch_default',
          pr_title: `fix(ast): heal ${session.title}`
        })
      })
        .then(res => res.json())
        .then(data => setPrData(data))
        .catch(err => console.error(err));
    }
  }, [isOpen, session]);

  if (!isOpen) return null;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownload = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel-glow" style={{
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        backgroundColor: '#0c1220',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '14px',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GitPullRequest size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                1-Click Pull Request & SARIF Artifact Exporter
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                Verified program repair ready for production merge & CI/CD compliance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <button
            onClick={() => setActiveTab('pr')}
            style={{
              background: activeTab === 'pr' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: activeTab === 'pr' ? '1px solid #6366f1' : '1px solid transparent',
              color: activeTab === 'pr' ? '#fff' : '#94a3b8',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={14} />
            GitHub PR Markdown
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            style={{
              background: activeTab === 'diff' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: activeTab === 'diff' ? '1px solid #6366f1' : '1px solid transparent',
              color: activeTab === 'diff' ? '#fff' : '#94a3b8',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GitPullRequest size={14} />
            Unified Git Patch
          </button>

          <button
            onClick={() => setActiveTab('sarif')}
            style={{
              background: activeTab === 'sarif' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: activeTab === 'sarif' ? '1px solid #6366f1' : '1px solid transparent',
              color: activeTab === 'sarif' ? '#fff' : '#94a3b8',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileJson size={14} />
            SARIF v2.1.0 Report
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '20px 22px', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'pr' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
                  Branch: {prData?.branch_name || 'ghostslate/fix-ast-invariant'}
                </span>
                <button
                  onClick={() => handleCopy(prData?.markdown_body || '', 'pr')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: copiedType === 'pr' ? '#10b981' : '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedType === 'pr' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedType === 'pr' ? 'Copied' : 'Copy PR Description'}
                </button>
              </div>
              <pre style={{
                background: '#090d16',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontFamily: 'var(--font-mono)',
                color: '#e2e8f0',
                whiteSpace: 'pre-wrap',
                margin: 0,
                maxHeight: '320px',
                overflowY: 'auto'
              }}>
                {prData?.markdown_body || 'Loading PR markdown...'}
              </pre>
            </div>
          )}

          {activeTab === 'diff' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => handleCopy(prData?.unified_diff || '', 'diff')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: copiedType === 'diff' ? '#10b981' : '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedType === 'diff' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedType === 'diff' ? 'Copied' : 'Copy Git Patch'}
                </button>
              </div>
              <pre style={{
                background: '#090d16',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontFamily: 'var(--font-mono)',
                color: '#34d399',
                whiteSpace: 'pre-wrap',
                margin: 0,
                maxHeight: '320px',
                overflowY: 'auto'
              }}>
                {prData?.unified_diff || 'No diff available'}
              </pre>
            </div>
          )}

          {activeTab === 'sarif' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => handleDownload(JSON.stringify(prData?.sarif_report || {}, null, 2), 'ghostslate-audit.sarif', 'application/json')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} />
                  Download .sarif
                </button>
              </div>
              <pre style={{
                background: '#090d16',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                color: '#38bdf8',
                whiteSpace: 'pre-wrap',
                margin: 0,
                maxHeight: '320px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(prData?.sarif_report || {}, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
