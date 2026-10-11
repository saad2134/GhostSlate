import React from 'react';
import { MessageSquareCode, ShieldAlert, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AgentDebateStream({ debateTurns }) {
  if (!debateTurns || debateTurns.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <MessageSquareCode size={28} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.8rem' }}>Waiting for Two-Tier Agent Loop initialization...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageSquareCode size={18} color="#a855f7" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
              Two-Tier Multi-Agent Debate Loop
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
              Adversarial synthesis: Triage Agent (Gemini) ↔ AST Boundary Auditor
            </p>
          </div>
        </div>

        <span className="glass-pill" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          {debateTurns.length} Debate Rounds Completed
        </span>
      </div>

      {/* Debate Stream Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
        {debateTurns.map((turn) => {
          const isTriage = turn.speaker === 'TriageAgent';
          const isCritic = turn.speaker === 'AdversarialCritic';
          const isApproved = turn.status === 'approved';

          return (
            <div
              key={turn.id}
              style={{
                background: isApproved
                  ? 'rgba(16, 185, 129, 0.08)'
                  : (isCritic ? 'rgba(244, 63, 94, 0.05)' : 'rgba(99, 102, 241, 0.05)'),
                border: isApproved
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : (isCritic ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid rgba(99, 102, 241, 0.2)'),
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem' }}>{turn.avatar}</span>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: isCritic ? '#fda4af' : (isApproved ? '#6ee7b7' : '#a5b4fc')
                  }}>
                    {turn.speaker === 'TriageAgent' ? 'Triage Agent (Synthesizer)' : 'Adversarial Critic (Auditor)'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {turn.timestamp}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: isApproved
                      ? 'rgba(16, 185, 129, 0.2)'
                      : (turn.status === 'challenging' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)'),
                    color: isApproved
                      ? '#10b981'
                      : (turn.status === 'challenging' ? '#f43f5e' : '#818cf8')
                  }}>
                    {turn.status}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    {Math.round(turn.confidence_score * 100)}%
                  </span>
                </div>
              </div>

              {/* Message */}
              <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: 0, lineHeight: 1.45 }}>
                {turn.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
