import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Split, AlignJustify, Check, Copy, Sparkles, FileDiff } from 'lucide-react';

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
      <div className="vercel-card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <FileDiff size={26} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.78rem' }}>Loading target source code and computing AST diff...</p>
      </div>
    );
  }

  return (
    <div className="vercel-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#0a0a0a' }}>
      {/* Header and Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Monaco AST-Scoped Diff Studio
          </h3>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
            Surgical AST mutation (Lines {patch?.start_line || 1} ✦ {patch?.end_line || 1}) ✦ 100% comments & scope preserved
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setInlineView(!inlineView)}
            className="vercel-btn-secondary"
            style={{ padding: '5px 10px' }}
          >
            {inlineView ? <Split size={13} /> : <AlignJustify size={13} />}
            <span>{inlineView ? 'Side-by-Side' : 'Inline Diff'}</span>
          </button>

          <button
            onClick={handleCopyDiff}
            className="vercel-btn-secondary"
            style={{ padding: '5px 12px' }}
          >
            {copied ? <Check size={13} color="#ffffff" /> : <Copy size={13} />}
            <span>{copied ? 'Diff Copied' : 'Copy Unified Diff'}</span>
          </button>
        </div>
      </div>

      {/* Explanation Banner */}
      {patch?.explanation && (
        <div style={{
          backgroundColor: '#050505',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={14} color="#ffffff" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.76rem', color: '#d4d4d4', margin: 0 }}>
            <strong style={{ color: '#ffffff' }}>AST Repair Rationale: </strong>
            {patch.explanation}
          </p>
        </div>
      )}

      {/* Monaco Diff Editor */}
      <div style={{
        height: '330px',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        backgroundColor: '#000000'
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
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6
            }
          }}
          loading={
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.8rem'
            }}>
              Loading Monaco Diff Engine...
            </div>
          }
        />
      </div>
    </div>
  );
}
