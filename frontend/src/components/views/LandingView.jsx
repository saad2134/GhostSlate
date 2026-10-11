import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  GitPullRequest, 
  Layers, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Code2, 
  Lock, 
  Activity 
} from 'lucide-react';
import ShimmerButton from '../ui/ShimmerButton';

export default function LandingView({ onLaunchStudio }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '32px' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '48px 32px',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), rgba(255, 255, 255, 0))',
          borderRadius: '16px',
          border: '1px solid #222222',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid #333333',
            borderRadius: '9999px',
            fontSize: '12px',
            color: '#a1a1a1',
            marginBottom: '20px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          <span style={{ color: '#10b981' }}>✦</span>
          Deterministic AST Program Repair & Self-Healing Sandbox
        </div>

        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            maxWidth: '820px',
            margin: '0 auto 20px auto',
          }}
        >
          Autonomous AST Program Repair That Never Breaks Your Build
        </h1>

        <p
          style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: '#a1a1a1',
            maxWidth: '680px',
            margin: '0 auto 32px auto',
            lineHeight: 1.6,
          }}
        >
          Replace destructive full-file LLM rewrites with surgical Tree-Sitter coordinate surgery,
          two-tier adversarial agent debates, and deterministic 100% green subprocess verification gates.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={onLaunchStudio}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.15s, opacity 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Zap size={16} color="#000000" />
            Launch Live Studio
            <ArrowRight size={16} />
          </button>

          <a
            href="https://github.com/saad2134/GhostSlate"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: '1px solid #333333',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            <Terminal size={16} />
            GitHub Repository
          </a>
        </div>
      </section>

      {/* Head-to-Head Comparison Matrix */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
            Why Engineering Teams Reject Stochastic LLM Rewrites
          </h2>
          <p style={{ color: '#a1a1a1', fontSize: '14px', margin: 0 }}>
            Compare standard generative coding assistants against GhostSlate&apos;s deterministic AST surgery.
          </p>
        </div>

        <div
          style={{
            background: '#0a0a0a',
            border: '1px solid #222222',
            borderRadius: '12px',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '640px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222222', background: '#050505' }}>
                <th style={{ padding: '16px 20px', color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>Capability Dimension</th>
                <th style={{ padding: '16px 20px', color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>Traditional LLMs (Copilot / Cursor / Devin)</th>
                <th style={{ padding: '16px 20px', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>GhostSlate AST Engine</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 500 }}>Diff Radius</td>
                <td style={{ padding: '14px 20px', color: '#888888' }}>Full-file overwrite (150–500 lines modified)</td>
                <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: 500 }}>Surgical AST slice (2–8 exact lines)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 500 }}>Code Verification Gate</td>
                <td style={{ padding: '14px 20px', color: '#ef4444' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <XCircle size={14} /> None / Stochastic hallucinated pass
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: 500 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> Deterministic Pytest Subprocess (100% Green)
                  </span>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 500 }}>Comments & Outer Scope</td>
                <td style={{ padding: '14px 20px', color: '#ef4444' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <XCircle size={14} /> Wipes custom comments & refactors unrelated code
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: 500 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> 100% Bit-for-bit preserved outside AST bounds
                  </span>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 500 }}>Execution Sandboxing</td>
                <td style={{ padding: '14px 20px', color: '#888888' }}>Unchecked local writes or blind command execution</td>
                <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: 500 }}>Ephemeral isolated tempfile with sanitized env</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 500 }}>Time-Travel Inspection</td>
                <td style={{ padding: '14px 20px', color: '#888888' }}>Static terminal traceback at failure point</td>
                <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: 500 }}>Frame-by-frame runtime state mutation scrubber</td>
              </tr>
              <tr>
                <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 500 }}>DevSecOps Compliance</td>
                <td style={{ padding: '14px 20px', color: '#888888' }}>Unstructured conversational chat markdown</td>
                <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: 500 }}>Standardized SARIF v2.1.0 JSON & 1-Click GitHub PRs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4 Core Pillars Bento Grid */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
            Built on Bounded Systems Architecture
          </h2>
          <p style={{ color: '#a1a1a1', fontSize: '14px', margin: 0 }}>
            Hexagonal Ports & Adapters decouple presentation, core domain logic, and execution sandboxes.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: '#38bdf8', marginBottom: '16px' }}><Activity size={24} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 8px 0' }}>State Invariant Trap</h3>
            <p style={{ fontSize: '13px', color: '#a1a1a1', margin: 0, lineHeight: 1.5 }}>
              Intercepts invalid variable mutations and frame-by-frame call stacks, enabling engineers to scrub backward in time to pinpoint exact invariant breaches.
            </p>
          </div>

          <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: '#10b981', marginBottom: '16px' }}><Layers size={24} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 8px 0' }}>Resilient In-Memory Stream</h3>
            <p style={{ fontSize: '13px', color: '#a1a1a1', margin: 0, lineHeight: 1.5 }}>
              Absorbs high-priority interrupts and out-of-order events using a causal watermark priority queue, re-sequencing frames under 10µs latency.
            </p>
          </div>

          <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: '#f59e0b', marginBottom: '16px' }}><Code2 size={24} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 8px 0' }}>Tree-Sitter AST Surgery</h3>
            <p style={{ fontSize: '13px', color: '#a1a1a1', margin: 0, lineHeight: 1.5 }}>
              Isolates the exact comparison or statement node coordinate without full-file rewriting, guaranteeing surgical precision and comment preservation.
            </p>
          </div>

          <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
            <div style={{ color: '#ec4899', marginBottom: '16px' }}><Lock size={24} /></div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 8px 0' }}>Deterministic Sandbox Gate</h3>
            <p style={{ fontSize: '13px', color: '#a1a1a1', margin: 0, lineHeight: 1.5 }}>
              Executes pytest in an ephemeral subprocess sandbox with sanitized environment variables. Zero code is accepted without a verified Red ➔ Green transition.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section
        style={{
          background: '#0a0a0a',
          border: '1px solid #222222',
          borderRadius: '16px',
          padding: '36px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', margin: 0 }}>
          Ready to experience deterministic program repair?
        </h3>
        <p style={{ color: '#a1a1a1', fontSize: '14px', margin: 0, maxWidth: '540px' }}>
          Explore race condition healing, stream interrupt re-synchronization, and custom evaluator code in the live workbench.
        </p>
        <button
          onClick={onLaunchStudio}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Zap size={14} color="#000000" />
          Enter Studio Workbench
        </button>
      </section>
    </div>
  );
}
