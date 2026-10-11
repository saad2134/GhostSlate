import React, { useState } from 'react';
import { 
  X, 
  Users, 
  CheckCircle2, 
  ShieldAlert, 
  Copy, 
  Check, 
  Terminal, 
  Clock, 
  GitBranch, 
  FileCheck2,
  Lock,
  ArrowRight,
  Key
} from 'lucide-react';
import ShinyText from './ui/ShinyText';

export default function TeamWorkspaceModal({ isOpen, onClose, onLaunchScenario }) {
  const [activeTab, setActiveTab] = useState('consensus'); // 'consensus' | 'audit_stream' | 'rules_tokens'
  const [copied, setCopied] = useState(false);
  const [apiToken, setApiToken] = useState('gs_live_9f81a4b2c019d84e72aa1b');
  const [tokenCopied, setTokenCopied] = useState(false);

  const [rules, setRules] = useState([
    {
      id: 'ast_security',
      name: 'GS-SEC-01 AST Sandbox Barrier',
      desc: 'Disallow arbitrary imports, os.system, exec(), eval() dynamic code execution',
      enabled: true
    },
    {
      id: 'canary_gate',
      name: 'AST Resource & Memory Canary Gate',
      desc: 'Reject candidate patches exceeding 64MB RSS growth or 3x duration blowup',
      enabled: true
    },
    {
      id: 'watermark_order',
      name: 'Monotonic Watermark Barrier',
      desc: 'Enforce causal sequence reordering with microsecond jitter absorption',
      enabled: true
    },
    {
      id: 'multi_role_quorum',
      name: 'Cryptographic Multi-Signature Quorum',
      desc: 'Require 3 of 3 signatures (Platform Architect, InfoSec Auditor, Pytest Runner)',
      enabled: true
    }
  ]);

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleCopyToken = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(apiToken)
        .then(() => {
          setTokenCopied(true);
          setTimeout(() => setTokenCopied(false), 2000);
        })
        .catch(err => console.warn('Clipboard write denied:', err));
    }
  };

  // Mock consensus participants
  const [participants, setParticipants] = useState([
    {
      id: 'arch',
      role: 'Lead Platform Architect',
      user: 'elena.rostova@enterprise.internal',
      status: 'approved',
      verdict: 'Diff bounds verified (Lines 18-24) ✦ Zero outer scope mutation',
      timestamp: '2 mins ago',
      color: '#38bdf8'
    },
    {
      id: 'sec',
      role: 'Enterprise InfoSec Auditor',
      user: 'marcus.vance@security.corp',
      status: 'approved',
      verdict: 'Sanitized env & zero network egress verified ✦ 0.00 KB outbound',
      timestamp: '1 min ago',
      color: '#10b981'
    },
    {
      id: 'gate',
      role: 'Automated Pytest Gate',
      user: 'ghostslate-runner@ephemeral.sandbox',
      status: 'approved',
      verdict: '100% Green (Exit Code 0) in 185ms ✦ Subprocess sandbox verified',
      timestamp: 'Just now',
      color: '#10b981'
    }
  ]);

  const auditEvents = [
    {
      id: 'evt_01',
      action: 'AST_MUTATION_CONSENSUS_REACHED',
      session_id: 'sess_9f81a4b2',
      branch: 'ghostslate/fix-order-book-race',
      block_hash: '9a8d2e...4f1c',
      time: '14:22:08'
    },
    {
      id: 'evt_02',
      action: 'SUBPROCESS_CANARY_PASSED',
      session_id: 'sess_9f81a4b2',
      branch: 'ghostslate/fix-order-book-race',
      block_hash: '3c7b1a...8e9d',
      time: '14:22:07'
    },
    {
      id: 'evt_03',
      action: 'SARIF_V2_AUDIT_INGESTED',
      session_id: 'sess_9f81a4b2',
      branch: 'ghostslate/fix-order-book-race',
      block_hash: '5e4d2a...1b0f',
      time: '14:22:05'
    }
  ];

  const handleCopyBundle = () => {
    const summary = `### 👥 GhostSlate Team Consensus & RBAC Audit Certificate
* Session Target: sess_9f81a4b2 ✦ Order Book Race Condition
* Required Quorum: 3 of 3 Multi-Role Signatures (100% Consensus)
* Status: VERIFIED & APPROVED FOR PRODUCTION MERGE
* Signed Roles:
  - Lead Platform Architect: APPROVED (elena.rostova@enterprise.internal)
  - Enterprise InfoSec Auditor: APPROVED (marcus.vance@security.corp)
  - Automated Subprocess Pytest Gate: VERIFIED EXIT CODE 0 (ghostslate-runner)
* SHA-256 Ledger Anchor: 9a8d2e3f4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e
* Governance Engine: GhostSlate Hexagonal Ports & Adapters (Saaduddin Mohammed)`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(summary)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.warn('Clipboard write failed:', err));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(10px, 3vw, 20px)'
    }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-workspace-modal-title"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '90vh',
          backgroundColor: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#000000'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#38bdf8" />
              <h3 id="team-workspace-modal-title" style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                <ShinyText text="Team Workspace & Multi-Role Consensus Mode" speed={4} />
              </h3>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Multi-signature governance matrix for platform leads, security auditors & automated test gates
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Team Workspace dialog"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              minWidth: '36px',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls & Copy Button */}
        <div style={{
          padding: '10px 20px',
          background: '#050505',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('consensus')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                background: activeTab === 'consensus' ? '#171717' : 'transparent',
                border: activeTab === 'consensus' ? '1px solid #333333' : '1px solid transparent',
                color: activeTab === 'consensus' ? '#ffffff' : '#888888',
                cursor: 'pointer'
              }}
            >
              Consensus Matrix (3/3)
            </button>
            <button
              onClick={() => setActiveTab('audit_stream')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                background: activeTab === 'audit_stream' ? '#171717' : 'transparent',
                border: activeTab === 'audit_stream' ? '1px solid #333333' : '1px solid transparent',
                color: activeTab === 'audit_stream' ? '#ffffff' : '#888888',
                cursor: 'pointer'
              }}
            >
              Immutable Audit Stream
            </button>
            <button
              onClick={() => setActiveTab('rules_tokens')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                background: activeTab === 'rules_tokens' ? '#171717' : 'transparent',
                border: activeTab === 'rules_tokens' ? '1px solid #333333' : '1px solid transparent',
                color: activeTab === 'rules_tokens' ? '#ffffff' : '#888888',
                cursor: 'pointer'
              }}
            >
              Invariant Rules & API Tokens
            </button>
          </div>

          <button
            onClick={handleCopyBundle}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              background: '#171717',
              border: '1px solid #333333',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Certificate Copied!' : 'Copy Audit Certificate'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div style={{ overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'consensus' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#05140d', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                    Multi-Signature Quorum Reached ✦ 3 of 3 Roles Approved
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Ready to Merge
                </span>
              </div>

              {participants.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: '#050505',
                    border: '1px solid #222222',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{p.role}</span>
                      <span style={{ fontSize: '11px', color: p.color, background: 'rgba(255, 255, 255, 0.05)', padding: '1px 6px', borderRadius: '4px' }}>
                        ✦ {p.status.toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#666666' }}>{p.user} ✦ {p.timestamp}</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#a1a1a1', lineHeight: 1.4 }}>
                      {p.verdict}
                    </p>
                  </div>

                  <span style={{ fontSize: '11px', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    <span>Cryptographically Signed</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audit_stream' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '12px', color: '#a1a1a1', margin: '0 0 4px 0' }}>
                Immutable append-only SHA-256 ledger event sequence recorded for target session:
              </p>
              {auditEvents.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    background: '#050505',
                    border: '1px solid #222222',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#38bdf8' }}>{evt.time}</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{evt.action}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888888', fontSize: '11px' }}>
                    <span>Block: <strong style={{ color: '#10b981' }}>{evt.block_hash}</strong></span>
                    <span style={{ color: '#444444' }}>✦</span>
                    <span>Branch: {evt.branch}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rules_tokens' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Organization API Token Section */}
              <div style={{
                background: '#050505',
                border: '1px solid #222222',
                borderRadius: '8px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={16} color="#38bdf8" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Organization Scoped API Token</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    Active ✦ Ephemeral Subprocess Isolation
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    readOnly
                    value={apiToken}
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      background: '#0a0a0a',
                      border: '1px solid #333333',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleCopyToken}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: tokenCopied ? '#10b981' : '#171717',
                      border: '1px solid #333333',
                      borderRadius: '6px',
                      color: tokenCopied ? '#000000' : '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {tokenCopied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{tokenCopied ? 'Copied' : 'Copy Token'}</span>
                  </button>
                  <button
                    onClick={() => {
                      const next = 'gs_live_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
                      setApiToken(next);
                      setTokenCopied(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      background: 'transparent',
                      border: '1px solid #333333',
                      borderRadius: '6px',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Rotate Token
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                  {['read:ast', 'verify:sandbox', 'admin:quorum', 'export:sarif'].map((scope) => (
                    <span key={scope} style={{ fontSize: '10px', color: '#888888', background: '#111111', padding: '2px 6px', borderRadius: '4px', border: '1px solid #222222', fontFamily: 'monospace' }}>
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              {/* Invariant Rules Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Active AST Governance Invariants</span>
                  <span style={{ fontSize: '11px', color: '#888888' }}>{rules.filter(r => r.enabled).length}/{rules.length} Enforced</span>
                </div>
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    style={{
                      background: '#050505',
                      border: '1px solid #222222',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>{rule.name}</span>
                      <span style={{ fontSize: '11px', color: '#777777' }}>{rule.desc}</span>
                    </div>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: rule.enabled ? 'rgba(16, 185, 129, 0.15)' : '#111111',
                        border: rule.enabled ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #333333',
                        color: rule.enabled ? '#10b981' : '#666666',
                        cursor: 'pointer'
                      }}
                    >
                      {rule.enabled ? 'ENFORCED ✦ STRICT' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
