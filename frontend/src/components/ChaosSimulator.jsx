import React from 'react';
import { Play, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Code2, Zap, FileCode, RotateCcw } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShimmerButton from './ui/ShimmerButton';
import ShinyText from './ui/ShinyText';

export default function ChaosSimulator({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onTriggerHeal,
  loading,
  stage,
  customCode,
  setCustomCode,
  customTest,
  setCustomTest
}) {
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
    <SpotlightCard className="responsive-chaos-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            <ShinyText text="Chaos Injection Simulator ✦ AST Self-Healing Pipeline" speed={4} />
          </h2>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Simulate runtime state corruption ✦ Trigger surgical AST repair & isolated verification
          </p>
        </div>

        {/* Action Button & FAIE Headless Crawler Reset Cycle CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            id="btn-reset-scenario"
            aria-label="Reset simulation cycle to initial state"
            title="Reset simulation cycle to initial state"
            onClick={() => onSelectScenario(scenarios[0]?.id || 'race_condition')}
            className="vercel-btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.78rem' }}
          >
            <RotateCcw size={13} />
            <span className="hide-on-mobile-xs">Reset Cycle</span>
          </button>

          <ShimmerButton
            id="btn-trigger-chaos"
            aria-label="Inject Chaos and Run Automated AST Repair"
            onClick={() => onTriggerHeal(selectedScenarioId)}
            disabled={loading}
            style={{ padding: '9px 18px', fontSize: '0.82rem' }}
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
      </div>

      {/* Aceternity Spotlight Scenario Grid with Generous Padding */}
      <div className="responsive-scenario-grid">
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

      {/* Interactive Custom Code & Invariant Editor (Visible when Custom Sandbox selected) */}
      {selectedScenarioId === 'custom' && (
        <div style={{
          backgroundColor: '#050505',
          border: '1px solid #333333',
          borderRadius: '8px',
          padding: '16px 18px',
          marginBottom: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={16} color="#10b981" />
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                Custom Evaluator Sandbox ✦ Dynamic Source Code & Test Assertions
              </span>
            </div>
            
            {/* Quick Template Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', color: '#888888' }}>Quick Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setCustomCode(`class DataBuffer:\n    def __init__(self, capacity: int = 4):\n        self.capacity = capacity\n        self.items = []\n\n    def push(self, val: int) -> bool:\n        # BUG: Off-by-one boundary check allows overflow when full\n        if len(self.items) <= self.capacity:\n            self.items.append(val)\n            return True\n        return False\n`);
                  setCustomTest(`import pytest\nfrom target import DataBuffer\n\ndef test_data_buffer_boundary():\n    buf = DataBuffer(capacity=4)\n    for i in range(4):\n        assert buf.push(i) is True\n    # 5th item must be rejected\n    assert buf.push(99) is False, "Buffer overflow: item accepted beyond capacity!"\n    assert len(buf.items) == 4\n`);
                }}
                className="vercel-btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.69rem' }}
              >
                1. Buffer Overflow
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomCode(`class TokenBucket:\n    def __init__(self, burst_limit: int = 5):\n        self.burst_limit = burst_limit\n        self.tokens = 0\n\n    def consume(self, amount: int = 1) -> bool:\n        # BUG: Boundary <= allows tokens to exceed burst_limit\n        if self.tokens + amount <= self.burst_limit:\n            self.tokens += amount\n            return True\n        return False\n`);
                  setCustomTest(`import pytest\nfrom target import TokenBucket\n\ndef test_token_bucket_limit():\n    bucket = TokenBucket(burst_limit=5)\n    assert bucket.consume(3) is True\n    assert bucket.consume(2) is True\n    # Further consumption must be rejected\n    assert bucket.consume(1) is False, "Burst limit exceeded!"\n    assert bucket.tokens == 5\n`);
                }}
                className="vercel-btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.69rem' }}
              >
                2. Token Bucket
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomCode(`class SimpleVault:\n    def __init__(self, balance: float = 100.0):\n        self.balance = balance\n\n    def withdraw(self, amount: float) -> bool:\n        # BUG: Allows negative overdraft balance\n        if self.balance >= 0:\n            self.balance -= amount\n            return True\n        return False\n`);
                  setCustomTest(`import pytest\nfrom target import SimpleVault\n\ndef test_vault_solvency():\n    vault = SimpleVault(100.0)\n    assert vault.withdraw(60.0) is True\n    assert vault.balance == 40.0\n    assert vault.withdraw(50.0) is False, "Overdraft must be barred!"\n    assert vault.balance == 40.0\n`);
                }}
                className="vercel-btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.69rem' }}
              >
                3. Vault Solvency
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '12px'
          }}>
            {/* Source Code Area */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#a1a1a1', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                Target Source Code (`target.py`):
              </label>
              <textarea
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                rows={9}
                style={{
                  width: '100%',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #333333',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: 1.45
                }}
              />
            </div>

            {/* Test Suite Area */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#a1a1a1', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                Pytest Assertion Suite (`test_target.py`):
              </label>
              <textarea
                value={customTest}
                onChange={(e) => setCustomTest(e.target.value)}
                rows={9}
                style={{
                  width: '100%',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #333333',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: 1.45
                }}
              />
            </div>
          </div>

          <p style={{ fontSize: '0.71rem', color: '#888888', margin: 0 }}>
            ✦ Tip: Modify the code above and click <strong>"Inject Chaos ✦ Auto-Heal Live"</strong>. GhostSlate isolates the AST syntax node, synthesizes the fix, and runs subprocess pytest verification.
          </p>
        </div>
      )}

      {/* 5-Stage High-Contrast Pipeline with Proper Padding */}
      <div className="responsive-pipeline-stepper">
        {pipelineStages.map((stg, idx) => {
          const isPassed = activeIndex >= idx;
          const isCurrent = activeIndex === idx;
          const Icon = stg.icon;

          return (
            <div
              key={stg.key}
              className="pipeline-step-chip"
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
