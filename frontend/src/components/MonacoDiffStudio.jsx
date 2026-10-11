import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { FileDiff, Split, AlignJustify, Sparkles, Check, Copy } from 'lucide-react';

export default function MonacoDiffStudio({ patch, originalCode, language = 'python' }) {
  const [inlineView, setInlineView] = useState(false);
  const [copied, setCopied] = useState(false);

  const modifiedCode = patch?.full_patched_code || originalCode;

  const handleCopyDiff = () => {
    if (patch?.diff_unified) {
      navigator.clipboard.writeText(patch.diff_unified);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!originalCode) {
    return (
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <FileDiff size={28} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.8rem' }}>Loading target source code and computing AST diff...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header and Controls */}
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
            <FileDiff size={18} color="#818cf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
              Monaco AST-Scoped Diff Studio
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
              Surgical AST mutation (Lines {patch?.start_line || 1}–{patch?.end_line || 1}) — 100% comments & scope preserved
            </p>
          </div>
        </div>

        {/* View Controls & Copy Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setInlineView(!inlineView)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: '#f8fafc',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {inlineView ? <Split size={14} /> : <AlignJustify size={14} />}
            {inlineView ? 'Side-by-Side' : 'Inline Diff'}
          </button>

          <button
            onClick={handleCopyDiff}
            style={{
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: '1px solid ' + (copied ? '#10b981' : 'var(--border-subtle)'),
              color: copied ? '#10b981' : '#f8fafc',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Diff Copied' : 'Copy Unified Diff'}
          </button>
        </div>
      </div>

      {/* Explanation Banner */}
      {patch?.explanation && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={16} color="#818cf8" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0 }}>
            <strong style={{ color: '#ffffff' }}>AST Repair Rationale: </strong>
            {patch.explanation}
          </p>
        </div>
      )}

      {/* Embedded Monaco Diff Editor */}
      <div style={{
        height: '340px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        background: '#0d1117'
      }}>
        <DiffEditor
          height="100%"
          language={language}
          original={originalCode || ''}
          modified={modifiedCode}
          theme="vs-dark"
          options={{
            readOnly: true,
            renderSideBySide: !inlineView,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderOverviewRuler: false,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            }
          }}
          loading={
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}>
              Loading Monaco Diff Engine...
            </div>
          }
        />
      </div>
    </div>
  );
}
