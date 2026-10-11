import React from 'react';
import { Cpu, GitPullRequest } from 'lucide-react';
import appIcon from '../assets/app-icon.png';
import ShinyText from './ui/ShinyText';
import DecryptedText from './ui/DecryptedText';
import ShimmerButton from './ui/ShimmerButton';

export default function Header({
  provider,
  setProvider,
  onOpenExportModal,
  session
}) {
  const isVerified = session?.verification?.is_verified;

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
              fontSize: '1.18rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              margin: 0
            }}>
              <ShinyText text="GhostSlate" speed={3.5} />
            </h1>
            <span className="vercel-pill" style={{ color: '#ffffff', borderColor: '#333333', backgroundColor: '#0a0a0a' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)' }}></span>
              <DecryptedText text="Hexagonal Engine Active ✦ v1.0.0" speed={30} maxIterations={10} />
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

        {/* Aceternity Shimmer Export Button */}
        <ShimmerButton
          onClick={onOpenExportModal}
          disabled={!isVerified}
          background={isVerified ? '#ffffff' : '#222222'}
          textColor={isVerified ? '#000000' : '#888888'}
          style={{
            padding: '7px 16px',
            fontSize: '0.78rem',
            border: isVerified ? '1px solid #ffffff' : '1px solid #333333'
          }}
        >
          <GitPullRequest size={13} />
          <span>Export PR ✦ SARIF</span>
        </ShimmerButton>
      </div>
    </header>
  );
}
