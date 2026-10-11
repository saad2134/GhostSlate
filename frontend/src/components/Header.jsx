import React from 'react';
import { Cpu, GitPullRequest } from 'lucide-react';
import appIcon from '../assets/app-icon.png';

export default function Header({
  provider,
  setProvider,
  onOpenExportModal,
  session
}) {
  return (
    <header className="vercel-card" style={{
      margin: '16px 20px',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      backgroundColor: '#000000',
      borderColor: 'var(--border-subtle)'
    }}>
      {/* Brand & App Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={appIcon}
          alt="GhostSlate Icon"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            border: '1px solid #333333',
            objectFit: 'cover',
            backgroundColor: '#0a0a0a'
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: 0
            }}>
              GhostSlate
            </h1>
            <span className="vercel-pill" style={{ color: '#ffffff', borderColor: '#333333', backgroundColor: '#0a0a0a' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)' }}></span>
              Hexagonal Engine Active ✦ v1.0.0
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Autonomous AST Program Repair ✦ Time-Travel Debugger & Self-Healing Sandbox
          </p>
        </div>
      </div>

      {/* Provider Selector & Export Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#0a0a0a',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.78rem'
        }}>
          <Cpu size={14} color="#a1a1a1" />
          <span style={{ color: 'var(--text-muted)' }}>Provider:</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'var(--font-sans)'
            }}
          >
            <option value="deterministic" style={{ background: '#0a0a0a', color: '#fff' }}>Deterministic Engine (Offline ✦ Zero-Flake)</option>
            <option value="gemini" style={{ background: '#0a0a0a', color: '#fff' }}>Gemini 2.0 Flash (Adapter Connected)</option>
            <option value="openai" style={{ background: '#0a0a0a', color: '#fff' }}>OpenAI GPT-4o Mini (Adapter Ready)</option>
          </select>
        </div>

        {/* Vercel-Style Export Button */}
        <button
          onClick={onOpenExportModal}
          disabled={!session || !session.verification?.is_verified}
          className="vercel-btn-primary"
          style={{
            opacity: session?.verification?.is_verified ? 1 : 0.4,
            cursor: session?.verification?.is_verified ? 'pointer' : 'not-allowed'
          }}
        >
          <GitPullRequest size={14} />
          Export PR ✦ SARIF
        </button>
      </div>
    </header>
  );
}
