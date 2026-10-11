import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Split, AlignJustify, Check, Copy, Sparkles, FileDiff } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';

export default function MonacoDiffStudio({ patch, originalCode, language = 'python' }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [inlineView, setInlineView] = useState(isMobile);
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
      <SpotlightCard style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <FileDiff size={26} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.78rem' }}>Loading target source code and computing AST diff...</p>
      </SpotlightCard>
    );
  }

  return (
    <SpotlightCard style={{ padding: 'var(--card-p)', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#0a0a0a' }}>
      {/* Header and Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
              <ShinyText text="Monaco AST-Scoped Diff Studio" speed={4} />
            </h3>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.68rem',
                fontWeight: 600,
                color: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <span>Blast Radius: {patch ? (patch.end_line - patch.start_line + 1) : 0} lines</span>
              <span style={{ color: '#444444' }}>✦</span>
              <span>100% Comments Preserved</span>
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Surgical AST mutation (Lines {patch?.start_line || 1} ✦ {patch?.end_line || 1}) ✦ Non-destructive syntax surgery
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setInlineView(!inlineView)}
            className="vercel-btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.76rem' }}
          >
            {inlineView ? <Split size={14} /> : <AlignJustify size={14} />}
            <span>{inlineView ? 'Side-by-Side' : 'Inline Diff'}</span>
          </button>

          <button
            onClick={handleCopyDiff}
            className="vercel-btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.76rem' }}
          >
            {copied ? <Check size={14} color="#ffffff" /> : <Copy size={14} />}
            <span>{copied ? 'Diff Copied' : 'Copy Unified Diff'}</span>
          </button>
        </div>
      </div>

      {/* Explanation Banner (Properly Padded) */}
      {patch?.explanation && (
        <div style={{
          backgroundColor: '#050505',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px 18px',
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Sparkles size={16} color="#ffffff" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.77rem', color: '#d4d4d4', margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: '#ffffff' }}>AST Repair Rationale: </strong>
            {patch.explanation}
          </p>
        </div>
      )}

      {/* Monaco Diff Editor */}
      <div style={{
        height: isMobile ? '280px' : '350px',
        borderRadius: '8px',
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
    </SpotlightCard>
  );
}
