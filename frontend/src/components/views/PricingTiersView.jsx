import React from 'react';
import { Check, Zap, ShieldCheck, Building2 } from 'lucide-react';

export default function PricingTiersView({ onLaunchStudio }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
          Transparent, Predictable Infrastructure Tiers
        </h1>
        <p style={{ color: '#a1a1a1', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
          Run GhostSlate free and open source on your local machine, or deploy enterprise-grade zero-exfiltration AST repairs across engineering organizations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Tier 1: Community */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', margin: '0 0 4px 0' }}>Community</h3>
            <p style={{ fontSize: '12px', color: '#888888', margin: 0 }}>Free & Open Source for individual developers.</p>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
            $0 <span style={{ fontSize: '14px', fontWeight: 400, color: '#888888' }}>/ forever</span>
          </div>
          <ul style={{ margin: '0 0 24px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#a1a1a1', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> 100% Offline Deterministic Engine</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Tree-Sitter Python & JS Grammars</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Monaco Web Diff Studio</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Headless CLI with SARIF Exporter</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Apache 2.0 / MIT Open Source</li>
          </ul>
          <button
            onClick={onLaunchStudio}
            style={{
              padding: '10px',
              background: '#171717',
              border: '1px solid #333333',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Launch Free Studio
          </button>
        </div>

        {/* Tier 2: Pro Team */}
        <div style={{ background: '#0a0a0a', border: '1px solid #38bdf8', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              right: '20px',
              background: '#38bdf8',
              color: '#000000',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
            }}
          >
            Popular
          </div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', margin: '0 0 4px 0' }}>Pro Team</h3>
            <p style={{ fontSize: '12px', color: '#888888', margin: 0 }}>High-throughput teams running continuous CI.</p>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
            $29 <span style={{ fontSize: '14px', fontWeight: 400, color: '#888888' }}>/ dev / mo</span>
          </div>
          <ul style={{ margin: '0 0 24px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#a1a1a1', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Everything in Community</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Automated GitHub PR Bot Integration</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Multi-Language Grammars (Go, Rust, TS)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Optional LLM Provider Adapters</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Priority CI/CD Execution Queue</li>
          </ul>
          <button
            onClick={onLaunchStudio}
            style={{
              padding: '10px',
              background: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              color: '#000000',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try in Studio
          </button>
        </div>

        {/* Tier 3: Enterprise Air-Gapped */}
        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', margin: '0 0 4px 0' }}>Enterprise VPC</h3>
            <p style={{ fontSize: '12px', color: '#888888', margin: 0 }}>Self-hosted air-gapped security & compliance.</p>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
            Custom <span style={{ fontSize: '14px', fontWeight: 400, color: '#888888' }}>/ annual</span>
          </div>
          <ul style={{ margin: '0 0 24px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#a1a1a1', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> 100% Air-Gapped Private VPC Cluster</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Zero-Exfiltration Compliance Guarantee</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Custom AST Invariant Rulesets & Lints</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> SAML / SSO / Audit Log Streaming</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Dedicated 99.99% Availability SLA</li>
          </ul>
          <a
            href="https://github.com/saad2134/GhostSlate"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px',
              background: '#171717',
              border: '1px solid #333333',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 500,
              textAlign: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Contact via GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
