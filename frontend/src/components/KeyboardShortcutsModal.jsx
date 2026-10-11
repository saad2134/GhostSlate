import React from 'react';
import { X, Keyboard } from 'lucide-react';
import ShinyText from './ui/ShinyText';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1 ✦ 5', description: 'Switch Chaos Scenarios (1: Race, 2: Boundary, 3: Null, 4: Ledger, 5: Stream Sync)' },
    { key: 'Space', description: 'Trigger Chaos Injection & Automated AST Repair Live' },
    { key: 'E', description: 'Open 1-Click Pull Request & SARIF Export Modal' },
    { key: '?', description: 'Toggle Keyboard Shortcuts Cheat Sheet' },
    { key: 'Esc', description: 'Close any active modal or overlay' }
  ];

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
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: '#0a0a0a',
        border: '1px solid #333333',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)'
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#000000'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Keyboard size={18} color="#ffffff" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              <ShinyText text="Keyboard Shortcuts ✦ Rapid Navigation" speed={4} />
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '6px',
                backgroundColor: '#050505',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.78rem', color: '#d4d4d4' }}>
                {sc.description}
              </span>
              <kbd style={{
                backgroundColor: '#171717',
                border: '1px solid #333333',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: '#ffffff',
                fontWeight: 600,
                boxShadow: '0 2px 0 #222222'
              }}>
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: '#000000',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            className="vercel-btn-secondary"
            style={{ padding: '6px 16px', fontSize: '0.76rem' }}
          >
            Close Shortcuts
          </button>
        </div>
      </div>
    </div>
  );
}
