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
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        backgroundColor: '#0a0a0a',
        border: '1px solid #333333',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#000000'
        }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
              1-Click Pull Request ✦ SARIF Artifact Exporter
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Verified program repair ready for merge ✦ CI/CD compliance
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '10px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#050505'
        }}>
          <button
            onClick={() => setActiveTab('pr')}
            style={{
              backgroundColor: activeTab === 'pr' ? '#ffffff' : '#111111',
              border: activeTab === 'pr' ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
              color: activeTab === 'pr' ? '#000000' : 'var(--text-secondary)',
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={13} />
            <span>GitHub PR Markdown</span>
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            style={{
              backgroundColor: activeTab === 'diff' ? '#ffffff' : '#111111',
              border: activeTab === 'diff' ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
              color: activeTab === 'diff' ? '#000000' : 'var(--text-secondary)',
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GitPullRequest size={13} />
            <span>Unified Git Patch</span>
          </button>

          <button
            onClick={() => setActiveTab('sarif')}
            style={{
              backgroundColor: activeTab === 'sarif' ? '#ffffff' : '#111111',
              border: activeTab === 'sarif' ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
              color: activeTab === 'sarif' ? '#000000' : 'var(--text-secondary)',
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileJson size={13} />
            <span>SARIF v2.1.0 Report</span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'pr' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#a1a1a1', fontFamily: 'var(--font-mono)' }}>
                  Branch: {prData?.branch_name || 'ghostslate/fix-ast-invariant'}
                </span>
                <button
                  onClick={() => handleCopy(prData?.markdown_body || '', 'pr')}
                  className="vercel-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                >
                  {copiedType === 'pr' ? <Check size={13} color="#ffffff" /> : <Copy size={13} />}
                  <span>{copiedType === 'pr' ? 'Copied' : 'Copy Description'}</span>
                </button>
              </div>
              <pre style={{
                backgroundColor: '#000000',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                color: '#ededed',
                whiteSpace: 'pre-wrap',
                margin: 0,
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)'
              }}>
                {prData?.markdown_body || 'Loading PR markdown...'}
              </pre>
            </div>
          )}

          {activeTab === 'diff' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                <button
                  onClick={() => handleCopy(prData?.unified_diff || '', 'diff')}
                  className="vercel-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                >
                  {copiedType === 'diff' ? <Check size={13} color="#ffffff" /> : <Copy size={13} />}
                  <span>{copiedType === 'diff' ? 'Copied' : 'Copy Git Patch'}</span>
                </button>
              </div>
              <pre style={{
                backgroundColor: '#000000',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                color: '#ededed',
                whiteSpace: 'pre-wrap',
                margin: 0,
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)'
              }}>
                {prData?.unified_diff || 'No diff available'}
              </pre>
            </div>
          )}

          {activeTab === 'sarif' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                <button
                  onClick={() => handleDownload(JSON.stringify(prData?.sarif_report || {}, null, 2), 'ghostslate-audit.sarif', 'application/json')}
                  className="vercel-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                >
                  <Download size={13} />
                  <span>Download .sarif</span>
                </button>
              </div>
              <pre style={{
                backgroundColor: '#000000',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: '#ededed',
                whiteSpace: 'pre-wrap',
                margin: 0,
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)'
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
