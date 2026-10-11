import React, { useState } from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, Server, EyeOff, Scale, Download, Check, Copy } from 'lucide-react';

export default function LegalComplianceView() {
  const [downloaded, setDownloaded] = useState(false);
  const [copiedSig, setCopiedSig] = useState(false);

  const handleCopySigLite = () => {
    const content = `### 📋 GhostSlate Enterprise Security Questionnaire (SIG Lite & CAIQ Summary)
* Vendor & Product: GhostSlate ✦ Autonomous AST Program Repair & Self-Healing Sandbox
* Author & Maintainer: Saaduddin Mohammed (github.com/saad2134)
* Architecture Standard: Hexagonal Ports & Adapters (Strict Separation of Presentation, Domain, Infrastructure)

1. Data Retention & Privacy Guarantees:
- Customer Code Retention: 0 Days. Volatile in-memory processing only.
- Model Training Ingestion: Contractually 0% of customer source code or tests used for model training.
- Network Egress Policy: 0.00 KB. Offline Deterministic Heuristic Engine operates completely air-gapped.

2. Subprocess Sandbox Security:
- Execution Boundary: Ephemeral tempfile.mkdtemp directory destroyed immediately upon exit code emission.
- Process Quota: Strict 5.0-second execution deadline terminating runaway computation.
- Secret Scrubbing: clean_env barrier strips parent API keys, cloud tokens, and environment variables.

3. Static Security Pre-Flight:
- Syntax Inspection: Concrete AST tree parses imports before sandbox execution.
- Prohibited Modules: Rejection of os, subprocess, socket, shutil, sys, ctypes.
- Dynamic Execution Prohibition: Blocks eval(), exec(), __import__().

4. Compliance & Auditability:
- Standard Format: Standardized SARIF v2.1.0 output for GitHub Advanced Security and SonarQube.
- Cryptographic Provenance: Append-only SHA-256 hash block chaining for tamper-evident verification audit.`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(content)
        .then(() => {
          setCopiedSig(true);
          setTimeout(() => setCopiedSig(false), 2000);
        })
        .catch(err => console.warn('Clipboard write denied:', err));
    }
  };

  const handleDownloadSpec = (format) => {
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'bundle') {
      content = JSON.stringify({
        bundle_format: "GhostSlate Enterprise Compliance & Attestation Bundle v2.1.0",
        generated_at: new Date().toISOString(),
        auditor: "Saaduddin Mohammed (github.com/saad2134)",
        zero_exfiltration_guarantee: {
          outbound_network_egress_bytes: 0.00,
          offline_engine_verified: true,
          secrets_isolation: "Sanitized clean_env environment"
        },
        sandbox_isolation: {
          runtime: "Ephemeral Subprocess with Sanitized Env",
          timeout_seconds: 5.0,
          ast_preflight: "Rejection of os, subprocess, socket, sys, eval, exec"
        },
        sarif_compliance: "SARIF v2.1.0 oasis-tcs standard",
        caiq_sig_answers: {
          "AAS-01.1": "Affirmative: Zero customer code is retained, logged, or exfiltrated.",
          "DCS-02.1": "Affirmative: Ephemeral tempfile subprocesses are automatically purged upon test completion.",
          "SEF-03.1": "Affirmative: AST security pre-flight barrier strictly blocks os, subprocess, and eval calls."
        }
      }, null, 2);
      filename = 'ghostslate-full-compliance-bundle.json';
      mimeType = 'application/json';
    } else if (format === 'json') {
      content = JSON.stringify({
        specification: "GhostSlate Enterprise Security & Compliance Audit",
        version: "1.0.0",
        author: "Saaduddin Mohammed (github.com/saad2134)",
        zero_exfiltration_guarantee: {
          offline_mode: "100% On-Device Deterministic Engine",
          cloud_lock: "0 outbound network requests",
          retention_policy: "Zero user code retention or training ingestion"
        },
        sandbox_isolation: {
          runtime: "Ephemeral Subprocess with Sanitized Env",
          timeout_seconds: 5.0,
          ast_preflight: "Rejection of os, subprocess, socket, sys, eval, exec"
        },
        industry_standards: {
          sarif_compliance: "SARIF v2.1.0 JSON format",
          license: "Apache 2.0 / MIT Open Source"
        }
      }, null, 2);
      filename = 'ghostslate-security-spec.json';
      mimeType = 'application/json';
    } else {
      content = `# GhostSlate Enterprise Security & Compliance Specification

**Product:** GhostSlate ✦ Autonomous AST Program Repair & Self-Healing Sandbox  
**Author:** Saaduddin Mohammed (github.com/saad2134)  
**License:** Apache 2.0 / MIT  

---

### 1. Zero-Exfiltration Privacy Guarantee
- When using the Offline Deterministic Engine, GhostSlate makes 0 external network requests.
- Proprietary source code and unit tests never leave the host machine.
- Zero telemetry harvesting, tracking pixels, or model training ingestion.

### 2. Subprocess Sandbox Isolation Boundary
- Tests execute inside ephemeral directories generated via \`tempfile.mkdtemp\`.
- \`clean_env\` purges parent environment variables, tokens, and cloud secrets.
- Strict 5.0-second execution quota terminates runaway processes.

### 3. AST Static Security Pre-Flight
- User code undergoes AST analysis before sandbox execution.
- Prohibits imports of \`os\`, \`subprocess\`, \`socket\`, \`shutil\`, \`sys\`, and \`ctypes\`.
- Rejects dynamic execution routines (\`eval\`, \`exec\`, \`__import__\`) with exit code -99.

### 4. DevSecOps Standards
- Standardized SARIF v2.1.0 output for GitHub Advanced Security and CI/CD pipelines.
`;
      filename = 'ghostslate-security-spec.md';
      mimeType = 'text/markdown';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 4vw, 32px)', paddingBottom: '32px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: '#0a0a0a',
          border: '1px solid #222222',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 32px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
            <ShieldCheck size={18} />
            <span>ENTERPRISE SECURITY & PRIVACY SPECIFICATION</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleDownloadSpec('md')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: '#171717',
                border: '1px solid #333333',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {downloaded ? <Check size={13} color="#10b981" /> : <Download size={13} />}
              <span>{downloaded ? 'Downloaded' : 'Download Spec (.md)'}</span>
            </button>
            <button
              onClick={() => handleDownloadSpec('json')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: '#171717',
                border: '1px solid #333333',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {downloaded ? <Check size={13} color="#10b981" /> : <Download size={13} />}
              <span>Download Audit (.json)</span>
            </button>
            <button
              onClick={() => handleDownloadSpec('bundle')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: '#10b981',
                border: '1px solid #10b981',
                borderRadius: '6px',
                color: '#000000',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Download size={13} />
              <span>Full Compliance Bundle (.json)</span>
            </button>
            <button
              onClick={handleCopySigLite}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: '#171717',
                border: '1px solid #333333',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {copiedSig ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copiedSig ? 'SIG Lite Copied!' : 'Copy SIG Lite / CAIQ'}</span>
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
          Zero-Exfiltration & Deterministic Sandbox Guarantees
        </h1>
        <p style={{ color: '#a1a1a1', fontSize: '14px', margin: 0, lineHeight: 1.6, maxWidth: '780px' }}>
          GhostSlate was engineered from inception to satisfy the stringent security criteria of air-gapped enterprise environments, financial institutions, and security audit teams.
        </p>
      </div>

      {/* Grid of Security Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
        {/* Pillar 1: Zero-Exfiltration */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: 'clamp(18px, 3.5vw, 24px)' }}>
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
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: 'clamp(18px, 3.5vw, 24px)' }}>
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
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: 'clamp(18px, 3.5vw, 24px)' }}>
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
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: 'clamp(18px, 3.5vw, 24px)' }}>
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
          padding: 'clamp(16px, 3vw, 24px)',
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
