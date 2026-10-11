import React, { useState, useEffect } from 'react';
import { History, Play, Pause, ChevronLeft, ChevronRight, AlertOctagon, Layers, Variable } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';
import DecryptedText from './ui/DecryptedText';

export default function StateTimeTravelScrubber({ snapshots, violation }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (snapshots && snapshots.length > 0) {
      setCurrentStepIndex(snapshots.length - 1);
    }
  }, [snapshots]);

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
      <SpotlightCard style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <History size={28} style={{ marginBottom: '8px', opacity: 0.5 }} />
        <p style={{ fontSize: '0.8rem' }}>No runtime execution trace recorded yet. Trigger a chaos repair to inspect time-travel state deltas.</p>
      </SpotlightCard>
    );
  }

  const activeSnapshot = snapshots[currentStepIndex] || snapshots[0];
  const isBreach = activeSnapshot.status === 'invariant_violation' || activeSnapshot.status === 'exception';

  return (
    <SpotlightCard
      spotlightColor={isBreach ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.08)'}
      style={{
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        border: isBreach ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
        backgroundColor: '#0a0a0a'
      }}
    >
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            <ShinyText text="State Invariant Time-Travel Scrubber" speed={4} />
          </h3>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
            Step {currentStepIndex + 1} of {snapshots.length} ✦ Frame @ Line {activeSnapshot.line_number} in <code style={{ color: '#ffffff' }}>{activeSnapshot.function_name}</code>
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="vercel-btn-secondary"
            style={{ padding: '5px 8px', opacity: currentStepIndex === 0 ? 0.3 : 1 }}
          >
            <ChevronLeft size={14} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="vercel-btn-secondary"
            style={{ padding: '5px 12px' }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(snapshots.length - 1, prev + 1))}
            disabled={currentStepIndex === snapshots.length - 1}
            className="vercel-btn-secondary"
            style={{ padding: '5px 8px', opacity: currentStepIndex === snapshots.length - 1 ? 0.3 : 1 }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Scrub-Bar Timeline Tracks (Vercel Monochrome) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', overflowX: 'auto', padding: '2px 0' }}>
        {snapshots.map((snap, idx) => {
          const isSelected = idx === currentStepIndex;
          const isFaulty = snap.status === 'invariant_violation' || snap.status === 'exception';

          return (
            <button
              key={snap.step}
              onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
              style={{
                flex: 1,
                minWidth: '46px',
                height: '34px',
                borderRadius: '6px',
                backgroundColor: isSelected
                  ? '#ffffff'
                  : (isFaulty ? '#1c1012' : '#111111'),
                border: isSelected
                  ? '1px solid #ffffff'
                  : (isFaulty ? '1px dashed #ef4444' : '1px solid var(--border-subtle)'),
                color: isSelected ? '#000000' : (isFaulty ? '#ef4444' : '#a1a1a1'),
                fontSize: '0.72rem',
                fontWeight: isSelected ? 700 : 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>#{snap.step}</span>
              <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>L{snap.line_number}</span>
            </button>
          );
        })}
      </div>

      {/* Invariant Breach Warning Box */}
      {isBreach && violation && (
        <div style={{
          backgroundColor: '#120a0b',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          <AlertOctagon size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444' }}>
                <DecryptedText text={`${violation.rule_name} Breach`} speed={30} maxIterations={8} />
              </span>
              <span className="vercel-pill" style={{ color: '#ffffff', borderColor: '#ef4444', fontSize: '0.68rem', backgroundColor: '#000000' }}>
                Culprit: {violation.culprit_variable}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#fca5a5', margin: '0 0 4px 0' }}>
              {activeSnapshot.message || violation.description}
            </p>
            <div style={{ display: 'flex', gap: '14px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#a1a1a1' }}>Expected: <strong style={{ color: '#10b981' }}>{violation.expected_condition}</strong></span>
              <span style={{ color: '#a1a1a1' }}>Corrupt Value: <strong style={{ color: '#ef4444' }}>{violation.actual_value}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Variable Scope & Call Stack Inspection (Vercel Monochrome) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '8px'
      }}>
        <div style={{
          backgroundColor: '#050505',
          borderRadius: '6px',
          padding: '10px 12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.73rem' }}>
            <Variable size={13} color="#a1a1a1" />
            <span>Active Variable Scope ({Object.keys(activeSnapshot.variables || {}).length})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(activeSnapshot.variables || {}).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#888888' }}>{key}:</span>
                <span style={{ color: typeof val === 'number' && val < 0 ? '#ef4444' : '#ffffff', fontWeight: 600 }}>
                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call Stack */}
        <div style={{
          backgroundColor: '#050505',
          borderRadius: '6px',
          padding: '10px 12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.73rem' }}>
            <Layers size={13} color="#a1a1a1" />
            <span>Call Stack Execution Depth</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {activeSnapshot.call_stack.map((frame, idx) => (
              <div key={idx} style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: idx === activeSnapshot.call_stack.length - 1 ? '#ffffff' : '#555555' }}>
                {idx === activeSnapshot.call_stack.length - 1 ? '▶ ' : '  '}{frame}()
              </div>
            ))}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
