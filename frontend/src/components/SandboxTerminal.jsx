import React, { useState } from 'react';
import { Terminal, CheckCircle2, XCircle, ShieldCheck, Clock, Zap } from 'lucide-react';

export default function SandboxTerminal({ verification }) {
  const [activeTab, setActiveTab] = useState('post'); // 'pre' or 'post'

  if (!verification) {
    return (
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Terminal size={28} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.8rem' }}>Awaiting sandbox test execution...</p>
      </div>
    );
  }

  const isVerified = verification.is_verified;

  return (
    <div className={`glass-panel ${isVerified ? 'pulse-green-glow' : ''}`} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header and Proof Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Terminal size={18} color={isVerified ? '#10b981' : '#f43f5e'} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Deterministic Sandbox Subprocess Runner
              {isVerified && (
                <span className="glass-pill" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', fontSize: '0.72rem' }}>
                  100% GREEN VERIFIED
                </span>
              )}
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
              Isolated subprocess execution in ephemeral temporary workspace — Zero demo flakiness
            </p>
          </div>
        </div>

        {/* Verification Proof Tokens */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}>
            <Clock size={13} color="#38bdf8" />
            <span>Duration: <strong style={{ color: '#fff' }}>{verification.duration_ms}ms</strong></span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid ' + (isVerified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'),
            fontSize: '0.72rem',
            color: isVerified ? '#10b981' : '#f43f5e',
            fontWeight: 700
          }}>
            <Zap size={13} />
            <span>Exit Code: {verification.exit_code}</span>
          </div>
        </div>
      </div>

      {/* Terminal View Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('pre')}
          style={{
            background: activeTab === 'pre' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.03)',
            border: activeTab === 'pre' ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
            color: activeTab === 'pre' ? '#fda4af' : '#94a3b8',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <XCircle size={14} color="#f43f5e" />
          Pre-Patch Run (❌ Red Failed)
        </button>

        <button
          onClick={() => setActiveTab('post')}
          style={{
            background: activeTab === 'post' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
            border: activeTab === 'post' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
            color: activeTab === 'post' ? '#6ee7b7' : '#94a3b8',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <CheckCircle2 size={14} color="#10b981" />
          Post-Patch Run (✅ 100% Green Passed)
        </button>
      </div>

      {/* Terminal Console Output Window */}
      <div style={{
        background: '#090d16',
        borderRadius: '8px',
        padding: '14px 16px',
        border: '1px solid var(--border-subtle)',
        maxHeight: '260px',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', opacity: 0.5 }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e', display: 'inline-block' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '6px' }}>pytest -v --no-header --tb=short (Subprocess Isolation)</span>
        </div>

        <pre style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          color: activeTab === 'pre' ? '#fda4af' : '#6ee7b7',
          lineHeight: 1.5
        }}>
          {activeTab === 'pre'
            ? (verification.pre_patch_test_output || 'No output recorded')
            : (verification.post_patch_test_output || 'No output recorded')}
        </pre>
      </div>
    </div>
  );
}
