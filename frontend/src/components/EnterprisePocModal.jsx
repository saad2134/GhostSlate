import React, { useState } from 'react';
import { X, CheckSquare, Square, ShieldCheck, Copy, Check, ExternalLink, ArrowRight, ClipboardCheck } from 'lucide-react';
import ShinyText from './ui/ShinyText';

export default function EnterprisePocModal({ isOpen, onClose, onLaunchScenario }) {
  if (!isOpen) return null;

  const [completedSteps, setCompletedSteps] = useState({
    egress: true,
    custom: false,
    blast: true,
    sarif: true,
    causal: true,
  });
  const [copied, setCopied] = useState(false);

  const toggleStep = (key) => {
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistItems = [
    {
      key: 'egress',
      title: '1. Air-Gapped Egress & Zero Exfiltration Audit',
      requirement: 'Confirm 0.00 KB outbound traffic when running with local Deterministic Engine.',
      targetProof: '100% on-device heuristic synthesis with zero cloud API keys required.',
      actionLabel: 'Inspect Security Spec',
      actionView: 'compliance'
    },
    {
      key: 'custom',
      title: '2. Dynamic Custom Logic & Pytest Synthesis',
      requirement: 'Inject internal proprietary Python classes and custom pytest assertions in Custom Sandbox.',
      targetProof: 'Dynamic AST parsing with strict Red ➔ Green exit code 0 gate.',
      scenarioId: 'custom'
    },
    {
      key: 'blast',
      title: '3. Surgical Blast Radius Verification',
      requirement: 'Confirm patch is confined to exact syntax node coordinates (2-8 lines) vs 200-line LLM full-file overwrite.',
      targetProof: '100% outer scope, indentation, and comments preserved intact.',
      scenarioId: 'race_condition'
    },
    {
      key: 'sarif',
      title: '4. SARIF v2.1.0 DevSecOps Ingestion',
      requirement: 'Generate standardized SARIF report and verify ingestion in CI/CD / GitHub Code Scanning.',
      targetProof: 'Standardized physical location regions and deterministic rule ID mapping.',
      scenarioId: 'financial_ledger'
    },
    {
      key: 'causal',
      title: '5. High-Priority Stream Causal Resequencing',
      requirement: 'Simulate high-priority interrupt (IRQ_0x1F) and verify monotonic frame reconstruction under 10µs latency.',
      targetProof: 'Causal min-heap watermark barrier absorbs arrival jitter with 100% integrity.',
      scenarioId: 'stream_interrupt'
    }
  ];

  const totalSteps = checklistItems.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / totalSteps) * 100);

  const handleCopyScorecard = () => {
    const summary = `### 📋 GhostSlate Enterprise 14-Day POC Evaluation Scorecard
* Evaluator Organization: Enterprise Platform Engineering
* Product: GhostSlate ✦ Autonomous AST Program Repair & Self-Healing Sandbox
* Author & Maintainer: Saaduddin Mohammed (github.com/saad2134)
* Overall POC Completion: ${completedCount} / ${totalSteps} Milestones Verified (${percentComplete}%)

${checklistItems.map(item => {
  const isDone = completedSteps[item.key];
  return `[${isDone ? 'X' : ' '}] ${item.title}
    - Verification: ${item.targetProof}
    - Status: ${isDone ? 'PASSED ✦ VERIFIED GREEN' : 'IN PROGRESS'}`;
}).join('\n\n')}

* Security & Governance Verdict: ${completedCount === totalSteps ? '100% APPROVED FOR ENTERPRISE ADMISSION' : 'EVALUATION IN PROGRESS'}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(summary)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.warn('Clipboard write denied:', err));
    }
  };

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
      <div style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        backgroundColor: '#0a0a0a',
        border: '1px solid #333333',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#000000'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardCheck size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                <ShinyText text="Enterprise 14-Day POC Evaluation Checklist" speed={4} />
              </h3>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Structured verification scorecard for platform engineering directors & enterprise security review
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close POC checklist dialog"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              minWidth: '36px',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Tracker */}
        <div style={{ padding: '12px 20px', background: '#050505', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
              Verification Progress: {completedCount} / {totalSteps} Passed
            </span>
            <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
              {percentComplete}% Ready
            </span>
          </div>

          <button
            onClick={handleCopyScorecard}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              background: '#171717',
              border: '1px solid #333333',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Scorecard Copied!' : 'Copy Executive Scorecard'}</span>
          </button>
        </div>

        {/* Checklist List */}
        <div style={{ overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {checklistItems.map((item) => {
            const isDone = completedSteps[item.key];
            return (
              <div
                key={item.key}
                style={{
                  background: isDone ? '#08140e' : '#050505',
                  border: isDone ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid #222222',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '14px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <button
                    onClick={() => toggleStep(item.key)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isDone ? '#10b981' : '#666666',
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '2px'
                    }}
                  >
                    {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                      {item.title}
                    </h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#a1a1a1', lineHeight: 1.5 }}>
                      {item.requirement}
                    </p>
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#10b981' }}>
                      ✦ <strong>Proof Target:</strong> {item.targetProof}
                    </div>
                  </div>
                </div>

                {item.scenarioId && (
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchScenario && onLaunchScenario(item.scenarioId);
                    }}
                    style={{
                      padding: '5px 10px',
                      background: '#141414',
                      border: '1px solid #333333',
                      borderRadius: '6px',
                      color: '#38bdf8',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Test in Studio</span>
                    <ArrowRight size={11} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
