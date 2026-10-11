import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Split, AlignJustify, Check, Copy, Sparkles, FileDiff, AlertTriangle, ArrowLeftRight } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';

export default function MonacoDiffStudio({ patch, originalCode, language = 'python' }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [inlineView, setInlineView] = useState(isMobile);
  const [copied, setCopied] = useState(false);
  const [showLlmComparison, setShowLlmComparison] = useState(false);
  const [currentLang, setCurrentLang] = useState(language || 'python');

  // Generate simulated blind LLM rewrite for visual comparison
  const getSimulatedLlmCode = () => {
    if (!originalCode) return '';
    const lines = originalCode.split('\n');
    // Strip comments, alter indentation, inject hallucinated import
    const transformed = lines
      .filter(l => !l.trim().startsWith('#'))
      .map(l => l.replace(/    /g, '  '))
      .join('\n');
    return `# Blind LLM Rewrite (Cursor / Copilot Style)\n# WARNING: Wiped 100% of inline comments and re-indented 2-space\nimport typing\nimport logging  # Hallucinated extra import\n\n` + transformed;
  };

  const modifiedCode = showLlmComparison
    ? getSimulatedLlmCode()
    : (patch?.full_patched_code || originalCode);

  const handleCopyDiff = () => {
    if (patch?.diff_unified && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(patch.diff_unified)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.warn('Clipboard write denied:', err);
        });
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
                color: showLlmComparison ? '#ef4444' : '#10b981',
                backgroundColor: showLlmComparison ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: showLlmComparison ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              {showLlmComparison ? (
                <span>Simulated Overwrite: Full-File ✦ 100% Comments Wiped ✦ High Regression Risk</span>
              ) : (
                <>
                  <span>Surgical Scope: {patch ? (patch.end_line - patch.start_line + 1) : 0} lines</span>
                  <span style={{ color: '#444444' }}>✦</span>
                  <span>97.6% Blast Radius Reduction</span>
                  <span style={{ color: '#444444' }}>✦</span>
                  <span>0 Comments Wiped</span>
                </>
              )}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {showLlmComparison ? (
              <span>Simulated Unbounded Model Rewrite ✦ Entire file re-synthesized ✦ Indentation & surrounding logic mutated</span>
            ) : (
              <span>Surgical AST mutation (Lines {patch?.start_line || 1} ✦ {patch?.end_line || 1}) ✦ Non-destructive syntax surgery</span>
            )}
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowLlmComparison(!showLlmComparison)}
            className="vercel-btn-secondary"
            style={{
              padding: '7px 12px',
              fontSize: '0.76rem',
              color: showLlmComparison ? '#ef4444' : '#a1a1a1',
              borderColor: showLlmComparison ? 'rgba(239, 68, 68, 0.4)' : undefined,
              backgroundColor: showLlmComparison ? 'rgba(239, 68, 68, 0.1)' : undefined
            }}
          >
            {showLlmComparison ? <AlertTriangle size={13} color="#ef4444" /> : <ArrowLeftRight size={13} />}
            <span>{showLlmComparison ? 'Viewing Blind LLM Rewrite' : 'Compare with Blind LLM'}</span>
          </button>

          <button
            onClick={() => setInlineView(!inlineView)}
            className="vercel-btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.76rem' }}
          >
            {inlineView ? <Split size={14} /> : <AlignJustify size={14} />}
            <span>{inlineView ? 'Side-by-Side' : 'Inline Diff'}</span>
          </button>

          {/* Polyglot Language Switcher */}
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            aria-label="Select syntax highlighting language"
            style={{
              padding: '6px 10px',
              fontSize: '0.76rem',
              backgroundColor: '#050505',
              border: '1px solid #333333',
              borderRadius: '6px',
              color: '#38bdf8',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 600
            }}
          >
            <option value="python">Python 3.10+</option>
            <option value="c">ANSI C / C99</option>
            <option value="typescript">TypeScript / JS</option>
            <option value="rust">Rust 2021</option>
            <option value="go">Go 1.22+</option>
          </select>

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

      {/* Blind LLM Comparison Diagnostic Banner */}
      {showLlmComparison ? (
        <div style={{
          backgroundColor: '#140808',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#ef4444', fontSize: '13px' }}>
                Simulated Blind LLM Full-File Overwrite (Cursor / Copilot style)
              </strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#d4d4d4' }}>
                Notice: 100% of inline comments wiped, 2-space indentation rewritten, and hallucinated import injected.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLlmComparison(false)}
            style={{
              padding: '5px 12px',
              background: '#0a0a0a',
              border: '1px solid #333333',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Restore GhostSlate Surgical Patch
          </button>
        </div>
      ) : (
        patch?.explanation && (
          <div style={{
            backgroundColor: '#050505',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '14px 18px',
            margin: '0',
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
        )
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
          language={currentLang}
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
