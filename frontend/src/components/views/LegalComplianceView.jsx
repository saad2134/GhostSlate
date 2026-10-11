import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, Server, EyeOff, Scale } from 'lucide-react';

export default function LegalComplianceView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: '#0a0a0a',
          border: '1px solid #222222',
          borderRadius: '16px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
          <ShieldCheck size={18} />
          <span>ENTERPRISE SECURITY & PRIVACY SPECIFICATION</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
          Zero-Exfiltration & Deterministic Sandbox Guarantees
        </h1>
        <p style={{ color: '#a1a1a1', fontSize: '14px', margin: 0, lineHeight: 1.6, maxWidth: '780px' }}>
          GhostSlate was engineered from inception to satisfy the stringent security criteria of air-gapped enterprise environments, financial institutions, and security audit teams.
        </p>
      </div>

      {/* Grid of Security Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Pillar 1: Zero-Exfiltration */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#10b981' }}>
            <EyeOff size={20} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Zero-Exfiltration Privacy Guarantee</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#a1a1a1', lineHeight: 1.6, marginBottom: '14px' }}>
            When running in offline deterministic mode, GhostSlate makes <strong>zero outbound network calls</strong>. Proprietary source code, unit tests, and runtime traces never leave the host boundary.
          </p>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#888888', lineHeight: 1.6 }}>
            <li>No code retention, indexing, or LLM training pipelines.</li>
            <li>In-memory causal streams drain and purge upon session completion.</li>
            <li>No telemetry trackers or third-party behavioral analytics.</li>
          </ul>
        </div>

        {/* Pillar 2: Subprocess Sandbox Security */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#38bdf8' }}>
            <Server size={20} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Subprocess Sandbox Isolation Boundary</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#a1a1a1', lineHeight: 1.6, marginBottom: '14px' }}>
            Code verification executes inside ephemeral filesystem sandboxes with strictly sanitized environments to prevent host credential leakage.
          </p>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#888888', lineHeight: 1.6 }}>
            <li><code>tempfile.mkdtemp</code> generates isolated directories torn down after run.</li>
            <li><code>clean_env</code> strips parent environment variables, API tokens, and secrets.</li>
            <li>Strict 5.0-second execution quota terminates runaway processes.</li>
          </ul>
        </div>

        {/* Pillar 3: AST Pre-Flight Security */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#f59e0b' }}>
            <Lock size={20} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>AST-Level Static Security Pre-Flight</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#a1a1a1', lineHeight: 1.6, marginBottom: '14px' }}>
            Arbitrary user code and tests undergo concrete syntax tree analysis prior to sandbox execution to intercept dangerous calls.
          </p>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#888888', lineHeight: 1.6 }}>
            <li>Prohibits module imports for <code>os</code>, <code>subprocess</code>, <code>socket</code>, <code>shutil</code>.</li>
            <li>Blocks dynamic evaluation routines: <code>eval()</code>, <code>exec()</code>, <code>__import__()</code>.</li>
            <li>Violations trigger immediate <code>exit_code: -99</code> sandbox rejection.</li>
          </ul>
        </div>

        {/* Pillar 4: SARIF v2.1.0 Compliance */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#a855f7' }}>
            <FileText size={20} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0 }}>SARIF v2.1.0 DevSecOps Standard</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#a1a1a1', lineHeight: 1.6, marginBottom: '14px' }}>
            All detected invariant violations, isolated AST coordinate ranges, and verified patches export to industry-standard Static Analysis Results Interchange Format.
          </p>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#888888', lineHeight: 1.6 }}>
            <li>Directly ingestible into GitHub Advanced Security Code Scanning.</li>
            <li>Integrates into SonarQube, Snyk, and standard enterprise CI/CD gates.</li>
            <li>Includes deterministic cryptographic rule IDs and physical line mappings.</li>
          </ul>
        </div>
      </div>

      {/* Licensing & Attribution */}
      <div
        style={{
          background: '#0a0a0a',
          border: '1px solid #222222',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#ffffff' }}><Scale size={24} /></div>
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Open Source Licensing & Attribution</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888888' }}>
              GhostSlate is published under the Apache 2.0 / MIT Open Source license.
            </p>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#a1a1a1' }}>
          Author & Maintainer: <strong style={{ color: '#ffffff' }}>Saaduddin Mohammed</strong> (<code>github.com/saad2134</code>)
        </div>
      </div>
    </div>
  );
}
