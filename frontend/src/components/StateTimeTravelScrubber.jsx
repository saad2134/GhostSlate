import React, { useState, useEffect } from 'react';
import { History, Play, Pause, ChevronLeft, ChevronRight, AlertOctagon, Layers, Variable, CheckCircle2 } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';
import DecryptedText from './ui/DecryptedText';

export default function StateTimeTravelScrubber({ snapshots, violation, streamSync }) {
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStepIndex = selectedStepIndex !== null && selectedStepIndex < (snapshots?.length || 0)
    ? selectedStepIndex
    : (snapshots && snapshots.length > 0 ? snapshots.length - 1 : 0);

  useEffect(() => {
    let interval;
    if (isPlaying && snapshots && snapshots.length > 1) {
      interval = setInterval(() => {
        setSelectedStepIndex((prev) => {
          const current = prev !== null ? prev : (snapshots.length - 1);
          if (current >= snapshots.length - 1) {
            setIsPlaying(false);
            return current;
          }
          return current + 1;
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
            onClick={() => setSelectedStepIndex(Math.max(0, currentStepIndex - 1))}
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
            onClick={() => setSelectedStepIndex(Math.min(snapshots.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === snapshots.length - 1}
            className="vercel-btn-secondary"
            style={{ padding: '5px 8px', opacity: currentStepIndex === snapshots.length - 1 ? 0.3 : 1 }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Causal Stream Synchronization Audit Banner */}
      {streamSync && (
        <div style={{
          backgroundColor: '#050505',
          border: '1px solid #222222',
          borderRadius: '8px',
          padding: '9px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: streamSync.is_out_of_order_detected ? 'rgba(16, 185, 129, 0.12)' : '#111111',
              color: streamSync.is_out_of_order_detected ? '#10b981' : '#a1a1a1',
              border: streamSync.is_out_of_order_detected ? '1px solid #10b981' : '1px solid #222222',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '0.71rem',
              fontWeight: 700
            }}>
              <CheckCircle2 size={12} color={streamSync.is_out_of_order_detected ? '#10b981' : '#a1a1a1'} />
              {streamSync.is_out_of_order_detected ? 'Causal Stream Re-Synchronized' : 'Stream In-Order Verified'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#888888' }}>
              {streamSync.watermark_strategy}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
            {streamSync.events_reordered > 0 && (
              <span style={{ color: '#f59e0b' }}>
                Reordered: <strong>{streamSync.events_reordered} frames</strong> (Jitter: {streamSync.max_jitter_frames})
              </span>
            )}
            {streamSync.interrupt_count > 0 && (
              <span style={{ color: '#ffffff' }}>
                Interrupts: <strong>{streamSync.interrupt_count}</strong>
              </span>
            )}
            <span style={{ color: '#10b981' }}>
              Latency: <strong>{streamSync.sync_latency_us}µs</strong>
            </span>
          </div>
        </div>
      )}

      {/* Scrub-Bar Timeline Tracks (Properly Padded) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', overflowX: 'auto', padding: '4px 2px', margin: '2px 0 4px 0' }}>
        {snapshots.map((snap, idx) => {
          const isSelected = idx === currentStepIndex;
          const isFaulty = snap.status === 'invariant_violation' || snap.status === 'exception';
          const isResequenced = snap.is_out_of_order;
          const isInterrupt = Boolean(snap.interrupt_context);

          return (
            <button
              key={snap.sequence_id || snap.step}
              onClick={() => { setSelectedStepIndex(idx); setIsPlaying(false); }}
              title={isResequenced ? `Sequence #${snap.sequence_id || snap.step} arrived out-of-order ✦ Synchronized by Causal Barrier` : (isInterrupt ? snap.interrupt_context : undefined)}
              style={{
                flex: 1,
                minWidth: '58px',
                height: '44px',
                padding: '6px 8px',
                borderRadius: '8px',
                backgroundColor: isSelected
                  ? '#ffffff'
                  : (isFaulty ? '#1c1012' : '#111111'),
                border: isSelected
                  ? '1px solid #ffffff'
                  : (isFaulty ? '1px dashed #ef4444' : (isResequenced ? '1px solid #10b981' : '1px solid var(--border-subtle)')),
                color: isSelected ? '#000000' : (isFaulty ? '#ef4444' : '#a1a1a1'),
                fontSize: '0.76rem',
                fontWeight: isSelected ? 700 : 600,
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {isResequenced && (
                <span
                  title="Resequenced by causal watermark"
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981'
                  }}
                />
              )}
              <span style={{ fontSize: '0.78rem' }}>#{snap.sequence_id || snap.step}</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.85, marginTop: '2px' }}>L{snap.line_number}</span>
            </button>
          );
        })}
      </div>

      {/* Invariant Breach Warning Box (Properly Padded) */}
      {isBreach && violation && (
        <div style={{
          backgroundColor: '#120a0b',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertOctagon size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ef4444' }}>
                <DecryptedText text={`${violation.rule_name} Breach`} speed={30} maxIterations={8} />
              </span>
              <span className="vercel-pill" style={{ color: '#ffffff', borderColor: '#ef4444', fontSize: '0.7rem', padding: '3px 10px', backgroundColor: '#000000' }}>
                Culprit: {violation.culprit_variable}
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#fca5a5', margin: '0 0 6px 0', lineHeight: 1.5 }}>
              {activeSnapshot.message || violation.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: '#a1a1a1' }}>Expected: <strong style={{ color: '#10b981' }}>{violation.expected_condition}</strong></span>
              <span style={{ color: '#a1a1a1' }}>Corrupt Value: <strong style={{ color: '#ef4444' }}>{violation.actual_value}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Variable Scope & Call Stack Inspection (Vercel Monochrome) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
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
