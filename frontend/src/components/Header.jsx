import React from 'react';
import { Shield, Cpu, GitPullRequest } from 'lucide-react';

export default function Header({
  provider,
  setProvider,
  onOpenExportModal,
  session
}) {
  return (
    <header className="glass-panel" style={{ margin: '16px 20px', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      {/* Brand & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
        }}>
          <Shield size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GhostSlate
            </h1>
            <span className="glass-pill" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
              Hexagonal Engine Active
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Autonomous AST Program Repair & Self-Healing Execution Sandbox
          </p>
        </div>
      </div>

      {/* Hexagonal Adapter Status & Provider Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem'
        }}>
          <Cpu size={14} color="#818cf8" />
          <span style={{ color: 'var(--text-muted)' }}>Provider:</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f8fafc',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="deterministic" style={{ background: '#0f172a', color: '#fff' }}>Deterministic Engine (Offline / Zero-Flake)</option>
            <option value="gemini" style={{ background: '#0f172a', color: '#fff' }}>Gemini 2.0 Flash (Adapter Connected)</option>
            <option value="openai" style={{ background: '#0f172a', color: '#fff' }}>OpenAI GPT-4o Mini (Adapter Ready)</option>
          </select>
        </div>

        {/* PR Export Button */}
        <button
          onClick={onOpenExportModal}
          disabled={!session || !session.verification?.is_verified}
          className="interactive-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: session?.verification?.is_verified
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid ' + (session?.verification?.is_verified ? '#10b981' : 'var(--border-subtle)'),
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: session?.verification?.is_verified ? 'pointer' : 'not-allowed',
            opacity: session?.verification?.is_verified ? 1 : 0.5,
            boxShadow: session?.verification?.is_verified ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
          }}
        >
          <GitPullRequest size={14} color="#ffffff" />
          Export PR & SARIF
        </button>
      </div>
    </header>
  );
}
