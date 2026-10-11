import React, { useState, useEffect } from 'react';
import { History, Play, Pause, ChevronLeft, ChevronRight, AlertOctagon, Layers, Variable } from 'lucide-react';

export default function StateTimeTravelScrubber({ snapshots, violation }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset to first or last step when snapshots change
  useEffect(() => {
    if (snapshots && snapshots.length > 0) {
      setCurrentStepIndex(snapshots.length - 1);
    }
  }, [snapshots]);

  // Automated playback
  useEffect(() => {
    let interval;
    if (isPlaying && snapshots && snapshots.length > 1) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= snapshots.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, snapshots]);

  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <History size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
        <p>No runtime execution trace recorded yet. Trigger a chaos repair to inspect time-travel state deltas.</p>
      </div>
    );
  }

  const activeSnapshot = snapshots[currentStepIndex] || snapshots[0];
  const isBreach = activeSnapshot.status === 'invariant_violation' || activeSnapshot.status === 'exception';

  return (
    <div className={`glass-panel ${isBreach ? 'pulse-red-glow' : ''}`} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <History size={18} color="#818cf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
              State Invariant Time-Travel Scrubber
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
              Step {currentStepIndex + 1} of {snapshots.length} — Frame @ Line {activeSnapshot.line_number} in <code style={{ color: '#a5b4fc' }}>{activeSnapshot.function_name}</code>
            </p>
          </div>
        </div>

        {/* Playback Button Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStepIndex === 0 ? 0.4 : 1
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)',
              border: '1px solid ' + (isPlaying ? '#f43f5e' : '#6366f1'),
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(snapshots.length - 1, prev + 1))}
            disabled={currentStepIndex === snapshots.length - 1}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: currentStepIndex === snapshots.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentStepIndex === snapshots.length - 1 ? 0.4 : 1
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scrub-Bar Timeline Tracks */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', overflowX: 'auto', padding: '4px 0' }}>
        {snapshots.map((snap, idx) => {
          const isSelected = idx === currentStepIndex;
          const isFaulty = snap.status === 'invariant_violation' || snap.status === 'exception';

          return (
            <button
              key={snap.step}
              onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
              style={{
                flex: 1,
                minWidth: '50px',
                height: '36px',
                borderRadius: '8px',
                background: isSelected
                  ? (isFaulty ? 'rgba(244, 63, 94, 0.35)' : 'rgba(99, 102, 241, 0.35)')
                  : (isFaulty ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)'),
                border: isSelected
                  ? (isFaulty ? '2px solid #f43f5e' : '2px solid #6366f1')
                  : (isFaulty ? '1px dashed #f43f5e' : '1px solid var(--border-subtle)'),
                color: isFaulty ? '#fda4af' : (isSelected ? '#ffffff' : '#94a3b8'),
                fontSize: '0.74rem',
                fontWeight: 700,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>#{snap.step}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>L{snap.line_number}</span>
            </button>
          );
        })}
      </div>

      {/* Invariant Breach Alert Banner */}
      {isBreach && violation && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertOctagon size={22} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f43f5e' }}>
                {violation.rule_name} Triggered
              </span>
              <span className="glass-pill" style={{ color: '#fda4af', borderColor: 'rgba(244, 63, 94, 0.3)', fontSize: '0.7rem' }}>
                Culprit: {violation.culprit_variable}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#fecdd3', margin: '0 0 6px 0' }}>
              {activeSnapshot.message || violation.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#94a3b8' }}>Expected: <strong style={{ color: '#10b981' }}>{violation.expected_condition}</strong></span>
              <span style={{ color: '#94a3b8' }}>Actual Corrupt Value: <strong style={{ color: '#f43f5e' }}>{violation.actual_value}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Variable Scope & Mutation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
            <Variable size={14} color="#818cf8" />
            <span>Active Variable Scope ({Object.keys(activeSnapshot.variables || {}).length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(activeSnapshot.variables || {}).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#94a3b8' }}>{key}:</span>
                <span style={{ color: typeof val === 'number' && val < 0 ? '#f43f5e' : '#38bdf8', fontWeight: 600 }}>
                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call Stack Inspection */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
            <Layers size={14} color="#34d399" />
            <span>Call Stack Execution Depth</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {activeSnapshot.call_stack.map((frame, idx) => (
              <div key={idx} style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: idx === activeSnapshot.call_stack.length - 1 ? '#f8fafc' : '#64748b' }}>
                {idx === activeSnapshot.call_stack.length - 1 ? '▶ ' : '  '}{frame}()
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
