import React from 'react';
import { MessageSquareCode } from 'lucide-react';

export default function AgentDebateStream({ debateTurns }) {
  if (!debateTurns || debateTurns.length === 0) {
    return (
      <div className="vercel-card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <MessageSquareCode size={26} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.78rem' }}>Waiting for Two-Tier Agent Loop initialization...</p>
      </div>
    );
  }

  return (
    <div className="vercel-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#0a0a0a' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Two-Tier Multi-Agent Debate Loop
          </h3>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
            Triage Synthesizer ✦ Adversarial Boundary Auditor
          </p>
        </div>

        <span className="vercel-pill">
          {debateTurns.length} Debate Rounds Completed
        </span>
      </div>

      {/* Debate Stream Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '270px', overflowY: 'auto' }}>
        {debateTurns.map((turn) => {
          const isTriage = turn.speaker === 'TriageAgent';
          const isApproved = turn.status === 'approved';

          return (
            <div
              key={turn.id}
              style={{
                backgroundColor: isApproved ? '#121212' : '#050505',
                border: isApproved ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.88rem' }}>{turn.avatar}</span>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: isApproved ? '#ffffff' : (isTriage ? '#ffffff' : '#a1a1a1')
                  }}>
                    {turn.speaker === 'TriageAgent' ? 'Triage Agent (Synthesizer)' : 'Adversarial Critic (Auditor)'}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#555555' }}>
                    ✦ {turn.timestamp}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isApproved ? '#ffffff' : '#171717',
                    color: isApproved ? '#000000' : '#a1a1a1',
                    border: '1px solid ' + (isApproved ? '#ffffff' : '#333333')
                  }}>
                    {turn.status}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#888888', fontFamily: 'var(--font-mono)' }}>
                    {Math.round(turn.confidence_score * 100)}%
                  </span>
                </div>
              </div>

              {/* Message */}
              <p style={{ fontSize: '0.76rem', color: '#d4d4d4', margin: 0, lineHeight: 1.45 }}>
                {turn.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
