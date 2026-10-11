import React from 'react';
import { Flame, Play, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Code2, Zap } from 'lucide-react';

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
    { key: 'recording_trace', label: '1. Invariant Breach', icon: AlertTriangle, color: '#f43f5e' },
    { key: 'ast_isolation', label: '2. AST Node Isolation', icon: Code2, color: '#f59e0b' },
    { key: 'agent_debate', label: '3. Two-Tier Agent Loop', icon: Cpu, color: '#8b5cf6' },
    { key: 'sandbox_verifying', label: '4. Subprocess Pytest', icon: Zap, color: '#06b6d4' },
    { key: 'healed', label: '5. 100% Green Verified', icon: ShieldCheck, color: '#10b981' },
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
    <div className="glass-panel" style={{ padding: '20px 24px', margin: '0 20px 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={18} color="#f43f5e" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              Chaos Injection Simulator & Verification Pipeline
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Select a production bug scenario to simulate runtime state corruption and trigger autonomous AST self-repair.
            </p>
          </div>
        </div>

        {/* 1-Click Trigger Button */}
        <button
          onClick={() => onTriggerHeal(selectedScenarioId)}
          disabled={loading}
          className="interactive-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: loading
              ? 'rgba(99, 102, 241, 0.3)'
              : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            border: '1px solid #818cf8',
            color: '#ffffff',
            padding: '10px 22px',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              Repairing AST in Sandbox...
            </>
          ) : (
            <>
              <Play size={16} fill="#ffffff" />
              Inject Chaos & Auto-Heal Live
            </>
          )}
        </button>
      </div>

      {/* Scenario Selection Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {scenarios.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <div
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className="interactive-card"
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: isSelected ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#a5b4fc' : 'var(--text-muted)'
                }}>
                  {sc.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                  Python AST
                </span>
              </div>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? '#ffffff' : '#e2e8f0', marginBottom: '4px' }}>
                {sc.title}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {sc.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 5-Stage Live Pipeline Indicator */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        borderRadius: '10px',
        padding: '12px 18px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
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
                borderRadius: '8px',
                background: isCurrent ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: isCurrent ? `1px solid ${stg.color}` : '1px solid transparent',
                opacity: isPassed ? 1 : 0.45,
                transition: 'all 0.3s ease'
              }}
            >
              <Icon size={15} color={isPassed ? stg.color : '#94a3b8'} />
              <span style={{
                fontSize: '0.78rem',
                fontWeight: isCurrent ? 700 : 600,
                color: isPassed ? '#f8fafc' : '#94a3b8'
              }}>
                {stg.label}
              </span>
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
    </div>
  );
}
