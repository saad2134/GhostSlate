import React from 'react';
import { MessageSquareCode } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';
import CountUp from './ui/CountUp';

export default function AgentDebateStream({ debateTurns }) {
  if (!debateTurns || debateTurns.length === 0) {
    return (
      <SpotlightCard style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <MessageSquareCode size={26} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.78rem' }}>Waiting for Two-Tier Agent Loop initialization...</p>
      </SpotlightCard>
    );
  }

  return (
    <SpotlightCard style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#0a0a0a' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            <ShinyText text="Two-Tier Multi-Agent Debate Loop" speed={4} />
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Triage Synthesizer ✦ Adversarial Boundary Auditor
          </p>
        </div>

        <span className="vercel-pill" style={{ padding: '4px 10px' }}>
          <CountUp to={debateTurns.length} duration={0.8} /> Debate Rounds Completed
        </span>
      </div>

      {/* Debate Stream Cards (Properly Padded) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '2px' }}>
        {debateTurns.map((turn) => {
          const isTriage = turn.speaker === 'TriageAgent';
          const isApproved = turn.status === 'approved';

          return (
            <div
              key={turn.id}
              style={{
                backgroundColor: isApproved ? '#121212' : '#050505',
                border: isApproved ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.95rem' }}>{turn.avatar}</span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: isApproved ? '#ffffff' : (isTriage ? '#ffffff' : '#a1a1a1')
                  }}>
                    {turn.speaker === 'TriageAgent' ? 'Triage Agent (Synthesizer)' : 'Adversarial Critic (Auditor)'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#666666' }}>
                    ✦ {turn.timestamp}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    backgroundColor: isApproved ? '#ffffff' : '#171717',
                    color: isApproved ? '#000000' : '#a1a1a1',
                    border: '1px solid ' + (isApproved ? '#ffffff' : '#333333')
                  }}>
                    {turn.status}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#888888', fontFamily: 'var(--font-mono)' }}>
                    <CountUp to={Math.round(turn.confidence_score * 100)} suffix="%" duration={1} />
                  </span>
                </div>
              </div>

              {/* Message */}
              <p style={{ fontSize: '0.78rem', color: '#d4d4d4', margin: 0, lineHeight: 1.55 }}>
                {turn.message}
              </p>
            </div>
          );
        })}
      </div>
    </SpotlightCard>
  );
}
