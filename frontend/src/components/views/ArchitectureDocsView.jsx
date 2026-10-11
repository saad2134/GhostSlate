import React, { useState } from 'react';
import { Layers, Terminal, Cpu, GitBranch, Check, Copy, Code, BookOpen } from 'lucide-react';

export default function ArchitectureDocsView() {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const ciWorkflowYaml = `name: GhostSlate Autonomous AST Program Repair

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  self-heal-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

      - name: Install Dependencies
        run: |
          pip install -r backend/requirements.txt
          pip install pytest

      - name: Run Deterministic AST Program Repair CLI
        run: |
          python -m backend.adapters.presentation.cli_adapter \\
            --scenario stream_interrupt \\
            --output-sarif audit.sarif

      - name: Upload SARIF to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: audit.sarif
`;

  const cliUsageCmd = `# Run headless AST self-healing audit across scenarios
python -m backend.adapters.presentation.cli_adapter --scenario race_condition

# Export standardized SARIF report for DevSecOps pipelines
python -m backend.adapters.presentation.cli_adapter --scenario stream_interrupt --output-sarif artifacts/audit.sarif
`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
      {/* Overview Header */}
      <div
        style={{
          background: '#0a0a0a',
          border: '1px solid #222222',
          borderRadius: '16px',
          padding: '32px',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
          <BookOpen size={18} />
          <span>TECHNICAL SPECIFICATIONS & ARCHITECTURAL REFERENCE</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
          Hexagonal Ports & Adapters Architecture
        </h1>
        <p style={{ color: '#a1a1a1', fontSize: '14px', margin: '8px 0 0 0', lineHeight: 1.6, maxWidth: '780px' }}>
          GhostSlate decouples presentation adapters, core domain logic, and infrastructure providers.
          This guarantees deterministic execution, zero vendor lock-in, and instant adaptability.
        </p>
      </div>

      {/* Hexagonal Ports Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8', marginBottom: '12px' }}>
            <Layers size={20} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Presentation Adapters (Inbound)</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#a1a1a1', lineHeight: 1.7 }}>
            <li><strong>Monaco Web UI:</strong> Interactive React bento grid with diff viewer and time scrubber.</li>
            <li><strong>Headless CLI Bot:</strong> Zero-UI execution exporting SARIF reports in CI/CD.</li>
            <li><strong>FastAPI REST & WebSockets:</strong> Streaming real-time healing events.</li>
          </ul>
        </div>

        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', marginBottom: '12px' }}>
            <Cpu size={20} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Core Domain Ports (Interfaces)</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#a1a1a1', lineHeight: 1.7 }}>
            <li><code>ASTParserPort</code>: Token-to-node scoping & block boundary discovery.</li>
            <li><code>ExecutionSandboxPort</code>: Isolated subprocess verification execution.</li>
            <li><code>ModelProviderPort</code>: Surgical patch synthesis & dual-agent debate.</li>
            <li><code>SessionRepositoryPort</code>: In-memory LRU session caching.</li>
          </ul>
        </div>

        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', marginBottom: '12px' }}>
            <GitBranch size={20} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Infrastructure Adapters (Outbound)</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#a1a1a1', lineHeight: 1.7 }}>
            <li><strong>Tree-Sitter C Grammar:</strong> Precision syntax coordinate isolation.</li>
            <li><strong>Deterministic Heuristic Engine:</strong> 100% offline, zero-cloud synthesis.</li>
            <li><strong>Subprocess Pytest Runner:</strong> Strict Red ➔ Green exit code 0 gate.</li>
          </ul>
        </div>
      </div>

      {/* Headless CLI Section */}
      <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
            <Terminal size={18} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Headless CLI Quickstart</h3>
          </div>
          <button
            onClick={() => copyToClipboard(cliUsageCmd, 'cli')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: '#171717',
              border: '1px solid #333333',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {copiedCode === 'cli' ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            {copiedCode === 'cli' ? 'Copied' : 'Copy Commands'}
          </button>
        </div>
        <pre
          style={{
            margin: 0,
            background: '#000000',
            border: '1px solid #1f1f1f',
            borderRadius: '8px',
            padding: '16px',
            color: '#a1a1a1',
            fontSize: '13px',
            fontFamily: 'monospace',
            overflowX: 'auto',
            lineHeight: 1.5,
          }}
        >
          {cliUsageCmd}
        </pre>
      </div>

      {/* GitHub Actions CI/CD Integration */}
      <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
            <Code size={18} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>GitHub Actions CI/CD Workflow (`.github/workflows/ghostslate-ci.yml`)</h3>
          </div>
          <button
            onClick={() => copyToClipboard(ciWorkflowYaml, 'ci')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: '#171717',
              border: '1px solid #333333',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {copiedCode === 'ci' ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            {copiedCode === 'ci' ? 'Copied' : 'Copy YAML'}
          </button>
        </div>
        <pre
          style={{
            margin: 0,
            background: '#000000',
            border: '1px solid #1f1f1f',
            borderRadius: '8px',
            padding: '16px',
            color: '#a1a1a1',
            fontSize: '12px',
            fontFamily: 'monospace',
            overflowX: 'auto',
            lineHeight: 1.5,
          }}
        >
          {ciWorkflowYaml}
        </pre>
      </div>

      {/* REST API Endpoints Specification */}
      <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', background: '#050505', borderBottom: '1px solid #222222' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>REST API Specification</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1f1f1f', color: '#888888', fontSize: '12px' }}>
              <th style={{ padding: '12px 20px' }}>Method</th>
              <th style={{ padding: '12px 20px' }}>Endpoint</th>
              <th style={{ padding: '12px 20px' }}>Description</th>
            </tr>
          </thead>
          <tbody style={{ color: '#a1a1a1' }}>
            <tr style={{ borderBottom: '1px solid #171717' }}>
              <td style={{ padding: '12px 20px', color: '#10b981', fontFamily: 'monospace' }}>GET</td>
              <td style={{ padding: '12px 20px', color: '#ffffff', fontFamily: 'monospace' }}>/api/health</td>
              <td style={{ padding: '12px 20px' }}>Live system diagnostics, subsystem checks & uptime.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #171717' }}>
              <td style={{ padding: '12px 20px', color: '#10b981', fontFamily: 'monospace' }}>GET</td>
              <td style={{ padding: '12px 20px', color: '#ffffff', fontFamily: 'monospace' }}>/api/benchmarks</td>
              <td style={{ padding: '12px 20px' }}>Microsecond parse latencies and sandbox execution telemetry.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #171717' }}>
              <td style={{ padding: '12px 20px', color: '#10b981', fontFamily: 'monospace' }}>GET</td>
              <td style={{ padding: '12px 20px', color: '#ffffff', fontFamily: 'monospace' }}>/api/compliance</td>
              <td style={{ padding: '12px 20px' }}>Zero-exfiltration guarantees & SARIF v2.1.0 specifications.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #171717' }}>
              <td style={{ padding: '12px 20px', color: '#38bdf8', fontFamily: 'monospace' }}>POST</td>
              <td style={{ padding: '12px 20px', color: '#ffffff', fontFamily: 'monospace' }}>/api/heal</td>
              <td style={{ padding: '12px 20px' }}>Executes end-to-end self-healing session in worker thread.</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 20px', color: '#38bdf8', fontFamily: 'monospace' }}>POST</td>
              <td style={{ padding: '12px 20px', color: '#ffffff', fontFamily: 'monospace' }}>/api/export/pr</td>
              <td style={{ padding: '12px 20px' }}>Generates GitHub PR markdown and SARIF report from cached session.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
