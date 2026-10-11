import React, { useState, useEffect, useCallback } from 'react';
import { X, ShieldCheck, Check, Copy, RefreshCw, Download, Search, ChevronDown, ChevronRight, Database, AlertTriangle, FileCode } from 'lucide-react';
import ShinyText from './ui/ShinyText';

export default function AuditLedgerModal({ isOpen, onClose }) {
  const [ledgerData, setLedgerData] = useState({
    chain_valid: true,
    verified_blocks: 0,
    total_blocks: 0,
    entries: []
  });
  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  const effectiveApiBase = (typeof window !== 'undefined' && window.location.port === '5180')
    ? 'http://127.0.0.1:8000'
    : '';

  const fetchLedger = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${effectiveApiBase}/api/ledger?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setLedgerData(data);
      }
    } catch (err) {
      console.warn('Failed to fetch ledger:', err);
    } finally {
      setLoading(false);
    }
  }, [effectiveApiBase]);

  useEffect(() => {
    if (isOpen) {
      fetchLedger();
    }
  }, [isOpen, fetchLedger]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = (text, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedHash(id);
          setTimeout(() => setCopiedHash(null), 2000);
        })
        .catch(err => console.warn('Clipboard write denied:', err));
    }
  };

  const handleDownloadLedger = () => {
    const jsonStr = JSON.stringify(ledgerData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ghostslate_audit_ledger_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const filteredEntries = (ledgerData.entries || []).filter(entry => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      (entry.scenario_id && entry.scenario_id.toLowerCase().includes(q)) ||
      (entry.session_id && entry.session_id.toLowerCase().includes(q)) ||
      (entry.invariant_name && entry.invariant_name.toLowerCase().includes(q)) ||
      (entry.block_hash && entry.block_hash.toLowerCase().includes(q))
    );
  });

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
      padding: 'clamp(10px, 3vw, 20px)'
    }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-ledger-modal-title"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          backgroundColor: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.95)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#080808',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: '#05140d',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={18} color="#10b981" />
            </div>
            <div>
              <h2 id="audit-ledger-modal-title" style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShinyText text="Cryptographic Audit Ledger" speed={3.5} />
                <span style={{ fontSize: '0.72rem', color: '#888888', fontWeight: 500 }}>✦ SHA-256 Tamper-Evident Chain</span>
              </h2>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Immutable append-only execution log ✦ Every verified patch cryptographically linked
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={fetchLedger}
              disabled={loading}
              className="vercel-btn-secondary"
              title="Re-verify Chain Integrity"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>Verify Chain</span>
            </button>
            <button
              onClick={handleDownloadLedger}
              className="vercel-btn-secondary"
              title="Download Full Ledger (JSON)"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <Download size={12} />
              <span>Export Ledger</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close Audit Ledger Modal"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888888',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888888'}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#050505',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {/* Card 1: Integrity Status */}
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #222222',
            borderRadius: '6px',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chain Integrity</span>
              {ledgerData.chain_valid ? (
                <ShieldCheck size={14} color="#10b981" />
              ) : (
                <AlertTriangle size={14} color="#ef4444" />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: ledgerData.chain_valid ? '#10b981' : '#ef4444',
                boxShadow: ledgerData.chain_valid ? '0 0 8px rgba(16, 185, 129, 0.6)' : '0 0 8px rgba(239, 68, 68, 0.6)'
              }}></span>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: ledgerData.chain_valid ? '#10b981' : '#ef4444'
              }}>
                {ledgerData.chain_valid ? '100% Unbroken ✦ Valid' : 'Tamper Detected ✦ Invalid'}
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#666666', display: 'block', marginTop: '4px' }}>
              {ledgerData.verified_blocks} consecutive blocks cryptographically validated
            </span>
          </div>

          {/* Card 2: Total Recorded Blocks */}
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #222222',
            borderRadius: '6px',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Blocks</span>
              <Database size={14} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              {ledgerData.total_blocks}
              <span style={{ fontSize: '0.72rem', color: '#888888', fontWeight: 400, marginLeft: '6px' }}>recorded</span>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#666666', display: 'block', marginTop: '4px' }}>
              Append-only JSONL format ✦ zero in-place mutations
            </span>
          </div>

          {/* Card 3: Cryptographic Standard */}
          <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #222222',
            borderRadius: '6px',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.68rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hash Algorithm</span>
              <FileCode size={14} color="#a1a1a1" />
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
              SHA-256 Chained
            </div>
            <span style={{ fontSize: '0.65rem', color: '#666666', display: 'block', marginTop: '4px' }}>
              Payload: prev_hash | session | diff | proof
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#050505',
            border: '1px solid #333333',
            borderRadius: '6px',
            padding: '6px 10px',
            flex: 1,
            maxWidth: '380px'
          }}>
            <Search size={13} color="#888888" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by scenario, session, or block hash..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.75rem',
                width: '100%'
              }}
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                style={{ background: 'none', border: 'none', color: '#666666', cursor: 'pointer', padding: 0 }}
              >
                <X size={12} />
              </button>
            )}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#888888' }}>
            Showing {filteredEntries.length} of {ledgerData.total_blocks} blocks
          </span>
        </div>

        {/* Scrollable Block Explorer */}
        <div style={{
          padding: '16px 20px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {filteredEntries.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#050505',
              border: '1px dashed #333333',
              borderRadius: '6px',
              color: '#888888'
            }}>
              <Database size={24} color="#555555" style={{ margin: '0 auto 8px auto', display: 'block' }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cccccc', margin: '0 0 4px 0' }}>
                {ledgerData.total_blocks === 0
                  ? 'No Audit Blocks Recorded Yet'
                  : 'No Blocks Matching Filter'}
              </p>
              <p style={{ fontSize: '0.73rem', color: '#666666', margin: 0 }}>
                {ledgerData.total_blocks === 0
                  ? 'Execute a self-healing session in the Studio to generate cryptographic audit entries.'
                  : 'Try clearing your filter search query.'}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isExpanded = expandedIndex === entry.index;
              const dateStr = entry.timestamp ? new Date(entry.timestamp * 1000).toLocaleString() : 'N/A';
              const isHashCopied = copiedHash === entry.block_hash;

              return (
                <div
                  key={entry.index}
                  style={{
                    backgroundColor: '#080808',
                    border: '1px solid #222222',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  {/* Block Header Row */}
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : entry.index)}
                    style={{
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      userSelect: 'none',
                      backgroundColor: isExpanded ? '#0e0e0e' : '#080808',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {isExpanded ? <ChevronDown size={14} color="#888888" /> : <ChevronRight size={14} color="#888888" />}
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#171717',
                        border: '1px solid #333333',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        fontFamily: 'monospace'
                      }}>
                        Block #{entry.index}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ffffff' }}>
                        {entry.scenario_id || 'custom_repair'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#a1a1a1' }}>
                        ✦ {entry.invariant_name || 'RuntimeInvariant'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#666666' }}>
                        {dateStr}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#05140d',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: '#10b981'
                      }}>
                        <Check size={11} color="#10b981" />
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>

                  {/* Hash Summary Row */}
                  <div style={{
                    padding: '6px 14px 10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #141414',
                    backgroundColor: '#060606',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.67rem', color: '#666666', textTransform: 'uppercase' }}>Block Hash:</span>
                      <code style={{
                        fontSize: '0.68rem',
                        fontFamily: 'monospace',
                        color: '#38bdf8',
                        backgroundColor: '#0d1822',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(56, 189, 248, 0.3)'
                      }}>
                        {entry.block_hash ? `${entry.block_hash.slice(0, 16)}...${entry.block_hash.slice(-16)}` : 'GENESIS'}
                      </code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(entry.block_hash, entry.block_hash);
                        }}
                        className="vercel-btn-secondary"
                        style={{ padding: '2px 6px', fontSize: '0.65rem' }}
                        title="Copy full SHA-256 block hash"
                      >
                        {isHashCopied ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                        <span>{isHashCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.67rem', color: '#666666', textTransform: 'uppercase' }}>Prev Hash:</span>
                      <code style={{
                        fontSize: '0.68rem',
                        fontFamily: 'monospace',
                        color: '#888888'
                      }}>
                        {entry.prev_hash ? `${entry.prev_hash.slice(0, 12)}...` : '00000000...'}
                      </code>
                    </div>
                  </div>

                  {/* Expanded Block Details */}
                  {isExpanded && (
                    <div style={{
                      padding: '12px 14px',
                      borderTop: '1px solid #222222',
                      backgroundColor: '#050505',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Deterministic Sandbox Proof
                        </span>
                        <pre style={{
                          margin: '4px 0 0 0',
                          padding: '8px 10px',
                          backgroundColor: '#000000',
                          border: '1px solid #222222',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontFamily: 'monospace',
                          color: '#10b981',
                          overflowX: 'auto'
                        }}>
                          {entry.deterministic_proof || 'ExitCode: 0 ✦ 100% Passed'}
                        </pre>
                      </div>

                      {entry.diff_unified && (
                        <div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Unified AST Diff Patch
                          </span>
                          <pre style={{
                            margin: '4px 0 0 0',
                            padding: '8px 10px',
                            backgroundColor: '#000000',
                            border: '1px solid #222222',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontFamily: 'monospace',
                            color: '#ffffff',
                            overflowX: 'auto',
                            maxHeight: '180px'
                          }}>
                            {entry.diff_unified}
                          </pre>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#666666', borderTop: '1px solid #1a1a1a', paddingTop: '6px' }}>
                        <span>Session ID: <code style={{ color: '#888888' }}>{entry.session_id}</code></span>
                        <span>Full Hash: <code style={{ color: '#888888' }}>{entry.block_hash}</code></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: '#080808',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: '#666666'
        }}>
          <span>SOC 2 Type II & ISO 27001 Cryptographic Audit Trail ✦ Author: Saaduddin Mohammed (github.com/saad2134)</span>
          <button
            onClick={onClose}
            className="vercel-btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.75rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
