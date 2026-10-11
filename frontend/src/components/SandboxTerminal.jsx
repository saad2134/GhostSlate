import React, { useState } from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, Zap } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';
import DecryptedText from './ui/DecryptedText';
import CountUp from './ui/CountUp';

export default function SandboxTerminal({ verification }) {
  const [activeTab, setActiveTab] = useState('post');

  if (!verification) {
    return (
      <SpotlightCard style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Terminal size={26} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.78rem' }}>Awaiting sandbox test execution...</p>
      </SpotlightCard>
    );
  }

  const isVerified = verification.is_verified;

  return (
    <SpotlightCard
      spotlightColor={isVerified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#0a0a0a',
        borderColor: isVerified ? 'rgba(16, 185, 129, 0.4)' : '#ef4444',
        boxShadow: isVerified ? '0 0 24px rgba(16, 185, 129, 0.07)' : 'none'
      }}
    >
      {/* Header and Proof Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShinyText text="Deterministic Sandbox Subprocess Runner" speed={4} />
            {isVerified && (
              <span className="vercel-pill" style={{ color: '#10b981', backgroundColor: '#051b11', borderColor: 'rgba(16, 185, 129, 0.4)', fontSize: '0.68rem', fontWeight: 600 }}>
                <DecryptedText text="● 100% GREEN VERIFIED" speed={30} maxIterations={8} />
              </span>
            )}
          </h3>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
            Isolated subprocess execution in ephemeral temporary workspace ✦ Zero demo flakiness
          </p>
        </div>

        {/* Proof Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#050505',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)'
          }}>
            <Clock size={12} color="#a1a1a1" />
            <span>Duration: <strong style={{ color: '#fff' }}><CountUp to={verification.duration_ms} duration={0.8} suffix="ms" /></strong></span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: isVerified ? '#051b11' : '#1c1012',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid ' + (isVerified ? 'rgba(16, 185, 129, 0.4)' : '#ef4444'),
            fontSize: '0.7rem',
            color: isVerified ? '#10b981' : '#ef4444',
            fontWeight: 600
          }}>
            <Zap size={12} />
            <span>Exit Code: {verification.exit_code}</span>
          </div>
        </div>
      </div>

      {/* Terminal View Tabs (Properly Padded) */}
      <div style={{ display: 'flex', gap: '8px', margin: '4px 0 6px 0', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('pre')}
          style={{
            backgroundColor: activeTab === 'pre' ? '#ffffff' : '#111111',
            border: activeTab === 'pre' ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
            color: activeTab === 'pre' ? '#000000' : 'var(--text-secondary)',
            padding: '7px 14px',
            borderRadius: '6px',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <XCircle size={14} color={activeTab === 'pre' ? '#000000' : '#ef4444'} />
          <span>Pre-Patch Run ✦ Red Failed</span>
        </button>

        <button
          onClick={() => setActiveTab('post')}
          style={{
            backgroundColor: activeTab === 'post' ? '#ffffff' : '#111111',
            border: activeTab === 'post' ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
            color: activeTab === 'post' ? '#000000' : 'var(--text-secondary)',
            padding: '7px 14px',
            borderRadius: '6px',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <CheckCircle2 size={14} color={activeTab === 'post' ? '#000000' : '#ffffff'} />
          <span>Post-Patch Run ✦ 100% Green Passed</span>
        </button>
      </div>

      {/* Terminal Console Output Window with Proper Padding */}
      <div style={{
        backgroundColor: '#000000',
        borderRadius: '8px',
        padding: '14px 16px',
        border: '1px solid var(--border-subtle)',
        maxHeight: '260px',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.76rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', opacity: 0.6 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#333333', display: 'inline-block' }}></span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#444444', display: 'inline-block' }}></span>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#555555', display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.7rem', color: '#888888', marginLeft: '6px' }}>pytest -v --no-header --tb=short ✦ Subprocess Isolation</span>
        </div>

        <pre style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          color: activeTab === 'pre' ? '#fca5a5' : '#ededed',
          lineHeight: 1.55
        }}>
          {activeTab === 'pre'
            ? (verification.pre_patch_test_output || 'No output recorded')
            : (verification.post_patch_test_output || 'No output recorded')}
        </pre>
      </div>
    </SpotlightCard>
  );
}
