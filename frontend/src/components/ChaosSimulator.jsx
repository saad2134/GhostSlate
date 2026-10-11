import React from 'react';
import { Play, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Code2, Zap } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShimmerButton from './ui/ShimmerButton';
import ShinyText from './ui/ShinyText';

export default function ChaosSimulator({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onTriggerHeal,
  loading,
  stage
}) {
  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const pipelineStages = [
    { key: 'recording_trace', label: '1. Invariant Breach', icon: AlertTriangle, accentColor: '#ef4444' },
    { key: 'ast_isolation', label: '2. AST Node Isolation', icon: Code2, accentColor: '#f59e0b' },
    { key: 'agent_debate', label: '3. Two-Tier Agent Loop', icon: Cpu, accentColor: '#ffffff' },
    { key: 'sandbox_verifying', label: '4. Subprocess Pytest', icon: Zap, accentColor: '#38bdf8' },
    { key: 'healed', label: '5. Green Verified', icon: ShieldCheck, accentColor: '#10b981' },
  ];

  const getStageIndex = (currentStage) => {
    switch (currentStage) {
      case 'recording_trace': return 0;
      case 'ast_isolation': return 1;
      case 'agent_debate': return 2;
      case 'sandbox_verifying': return 3;
      case 'healed': return 4;
      default: return -1;
    }
  };

  const activeIndex = getStageIndex(stage);

  return (
    <SpotlightCard style={{ padding: '22px 24px', margin: '0 20px 24px 20px', backgroundColor: '#050505' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            <ShinyText text="Chaos Injection Simulator ✦ AST Self-Healing Pipeline" speed={4} />
          </h2>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Simulate runtime state corruption ✦ Trigger surgical AST repair & isolated verification
          </p>
        </div>

        {/* Aceternity Shimmer Action Button */}
        <ShimmerButton
          onClick={() => onTriggerHeal(selectedScenarioId)}
          disabled={loading}
          style={{ padding: '9px 20px', fontSize: '0.82rem' }}
        >
          {loading ? (
            <>
              <div style={{
                width: '14px',
                height: '14px',
                border: '2px solid #000000',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
              }}></div>
              <span>Repairing AST in Sandbox...</span>
            </>
          ) : (
            <>
              <Play size={14} fill="#000000" />
              <span>Inject Chaos ✦ Auto-Heal Live</span>
            </>
          )}
        </ShimmerButton>
      </div>

      {/* Aceternity Spotlight Scenario Grid with Generous Padding */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px',
        marginBottom: '18px'
      }}>
        {scenarios.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <SpotlightCard
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              isActive={isSelected}
              activeBorderColor="#ffffff"
              spotlightColor="rgba(255, 255, 255, 0.08)"
              style={{
                padding: '16px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#111111' : '#0a0a0a'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  backgroundColor: isSelected ? '#ffffff' : '#171717',
                  color: isSelected ? '#000000' : 'var(--text-secondary)'
                }}>
                  {sc.category}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#a1a1a1', fontFamily: 'var(--font-mono)' }}>
                  Python AST
                </span>
              </div>
              <h3 style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                {sc.title}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                {sc.description}
              </p>
            </SpotlightCard>
          );
        })}
      </div>

      {/* 5-Stage High-Contrast Pipeline with Proper Padding */}
      <div style={{
        backgroundColor: '#0a0a0a',
        borderRadius: '8px',
        padding: '12px 18px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {pipelineStages.map((stg, idx) => {
          const isPassed = activeIndex >= idx;
          const isCurrent = activeIndex === idx;
          const Icon = stg.icon;

          return (
            <div
              key={stg.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: isCurrent ? '#ffffff' : (isPassed ? '#171717' : 'transparent'),
                color: isCurrent ? '#000000' : (isPassed ? '#ffffff' : 'var(--text-muted)'),
                border: isCurrent ? '1px solid #ffffff' : '1px solid transparent',
                fontSize: '0.76rem',
                fontWeight: isCurrent ? 700 : 500,
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} color={isCurrent ? '#000000' : (isPassed ? stg.accentColor : '#666666')} />
              <span>{stg.label}</span>
              {isPassed && idx < activeIndex && (
                <CheckCircle2 size={13} color="#10b981" />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </SpotlightCard>
  );
}
