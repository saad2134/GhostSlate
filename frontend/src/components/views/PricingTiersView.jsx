import React, { useState } from 'react';
import { Check, X, ShieldCheck, Zap, Building2, Lock, FileCode2, ArrowRight } from 'lucide-react';

export default function PricingTiersView({ onLaunchStudio }) {
  const [isAnnual, setIsAnnual] = useState(true);

  const matrixCategories = [
    {
      category: '1. Core AST Repair & Deterministic Verification',
      features: [
        { name: 'Tree-Sitter Surgical Node Isolation', community: true, pro: true, enterprise: true, note: 'Microsecond syntax isolation' },
        { name: 'Isolated Subprocess Pytest Gate', community: true, pro: true, enterprise: true, note: 'Strict Red ➔ Green exit code 0' },
        { name: 'AST Resource Canary Gate', community: true, pro: true, enterprise: true, note: 'Prevents CPU loops & algorithmic regressions' },
        { name: 'State Invariant Trap & Time Scrubber', community: true, pro: true, enterprise: true, note: 'Frame-by-frame memory inspection' },
        { name: 'Resilient In-Memory Stream Sync', community: true, pro: true, enterprise: true, note: 'Causal watermark <10µs latency' },
        { name: 'Multi-Language Grammars (Python, JS, TS, C, Go, Rust)', community: 'Python & JS', pro: 'All standard', enterprise: 'Custom grammars' }
      ]
    },
    {
      category: '2. Privacy & Security Isolation Boundaries',
      features: [
        { name: 'Zero-Exfiltration Guarantee (0.00 KB Leaked)', community: true, pro: true, enterprise: true, note: 'Strict zero network egress' },
        { name: 'Sanitized Subprocess Execution (clean_env)', community: true, pro: true, enterprise: true, note: 'Isolated temporary working directory' },
        { name: 'AST Security Pre-Flight Barrier', community: true, pro: true, enterprise: true, note: 'Blocks os, subprocess, eval, exec calls' },
        { name: 'Air-Gapped Private VPC Cluster Deployment', community: false, pro: false, enterprise: true, note: '100% self-hosted on customer AWS/GCP/Azure' },
        { name: 'Zero Model Training on Customer Code', community: true, pro: true, enterprise: true, note: 'Contractually guaranteed' }
      ]
    },
    {
      category: '3. DevSecOps & Enterprise Auditing',
      features: [
        { name: 'Standardized SARIF v2.1.0 Export', community: true, pro: true, enterprise: true, note: 'GitHub Security Tab native' },
        { name: 'Headless CLI CI/CD Integration', community: true, pro: true, enterprise: true, note: 'Zero-UI audit pipelines' },
        { name: 'Automated 1-Click GitHub PR Generator', community: false, pro: true, enterprise: true, note: 'Includes unified diff & proofs' },
        { name: 'Durable SQLite Session Persistence', community: true, pro: true, enterprise: true, note: 'Survives process reboots' },
        { name: 'Custom AST Invariant Rulesets & Lints', community: false, pro: false, enterprise: true, note: 'Organization-specific rules' }
      ]
    },
    {
      category: '4. Governance, Identity & SLAs',
      features: [
        { name: 'SAML 2.0 / Okta / Azure AD SSO', community: false, pro: false, enterprise: true, note: 'Enterprise identity federation' },
        { name: 'SCIM Directory User Provisioning', community: false, pro: false, enterprise: true, note: 'Automated de-provisioning' },
        { name: 'Uptime & Availability SLA', community: 'Best effort', pro: '99.9%', enterprise: '99.99% Financial SLA' },
        { name: 'Dedicated Technical Account Manager (TAM)', community: false, pro: false, enterprise: true, note: '1-hour critical response' },
        { name: 'Enterprise Billing (ACH / Wire / AWS Marketplace)', community: false, pro: false, enterprise: true, note: 'Custom invoicing' }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '32px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
          Transparent, Predictable Infrastructure Tiers
        </h1>
        <p style={{ color: '#a1a1a1', fontSize: '14px', margin: '0 0 24px 0', lineHeight: 1.6 }}>
          Run GhostSlate free and open source on your local machine, or deploy enterprise-grade zero-exfiltration AST repairs across engineering organizations.
        </p>

        {/* Billing Cadence Switcher */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: '#0a0a0a', border: '1px solid #222222', borderRadius: '9999px', padding: '4px' }}>
          <button
            onClick={() => setIsAnnual(false)}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: !isAnnual ? '#ffffff' : 'transparent',
              color: !isAnnual ? '#000000' : '#888888',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: 'none',
              background: isAnnual ? '#ffffff' : 'transparent',
              color: isAnnual ? '#000000' : '#888888',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Annual Billing</span>
            <span style={{ fontSize: '10px', background: '#10b981', color: '#000000', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Tier Cards Grid */}
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
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Tree-Sitter AST Coordinate Isolation</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> AST Resource Canary Gate</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Monaco Web Diff Studio</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Headless CLI with SARIF Exporter</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Apache 2.0 / MIT Open Source</li>
          </ul>
          <button
            onClick={() => onLaunchStudio && onLaunchStudio('race_condition')}
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
            {isAnnual ? '$23' : '$29'} <span style={{ fontSize: '14px', fontWeight: 400, color: '#888888' }}>/ dev / mo {isAnnual ? '(billed annually)' : ''}</span>
          </div>
          <ul style={{ margin: '0 0 24px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#a1a1a1', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Everything in Community</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Automated GitHub PR Bot Integration</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Multi-Language Grammars (Go, Rust, TS)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Durable SQLite Session Persistence</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Priority CI/CD Execution Queue</li>
          </ul>
          <button
            onClick={() => onLaunchStudio && onLaunchStudio('race_condition')}
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
            Deploy Pro Team (14-Day Pilot)
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
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> SAML / Okta / Azure AD SSO & SCIM</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#10b981" /> Dedicated 99.99% Financial SLA</li>
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
            Request Air-Gapped VPC Pilot
          </a>
        </div>
      </div>

      {/* Exhaustive Enterprise Security & Compliance Comparison Matrix */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
            Comprehensive Feature & Security Matrix
          </h2>
          <p style={{ color: '#888888', fontSize: '13px', margin: 0 }}>
            Line-by-line comparison of capabilities, boundary isolation guarantees, and enterprise compliance standards.
          </p>
        </div>

        <div style={{ background: '#0a0a0a', border: '1px solid #222222', borderRadius: '12px', overflowX: 'auto' }}>
          <table 
            aria-label="GhostSlate tier feature and security comparison matrix"
            style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #222222', background: '#050505' }}>
                <th style={{ padding: '14px 20px', color: '#ffffff', fontSize: '13px', fontWeight: 600, width: '40%' }}>Feature / Capability</th>
                <th style={{ padding: '14px 16px', color: '#a1a1a1', fontSize: '13px', fontWeight: 600, textAlign: 'center', width: '20%' }}>Community</th>
                <th style={{ padding: '14px 16px', color: '#38bdf8', fontSize: '13px', fontWeight: 600, textAlign: 'center', width: '20%' }}>Pro Team</th>
                <th style={{ padding: '14px 16px', color: '#10b981', fontSize: '13px', fontWeight: 600, textAlign: 'center', width: '20%' }}>Enterprise VPC</th>
              </tr>
            </thead>
            <tbody>
              {matrixCategories.map((cat, catIdx) => (
                <React.Fragment key={catIdx}>
                  <tr style={{ background: '#070707', borderBottom: '1px solid #1a1a1a' }}>
                    <td colSpan={4} style={{ padding: '10px 20px', fontSize: '12px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ✦ {cat.category}
                    </td>
                  </tr>
                  {cat.features.map((feat, featIdx) => (
                    <tr key={featIdx} style={{ borderBottom: '1px solid #141414' }}>
                      <td style={{ padding: '12px 20px', fontSize: '13px', color: '#e5e5e5' }}>
                        <div>{feat.name}</div>
                        {feat.note && <div style={{ fontSize: '11px', color: '#666666' }}>{feat.note}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px' }}>
                        {typeof feat.community === 'boolean' ? (
                          feat.community ? <Check size={16} color="#10b981" style={{ margin: '0 auto' }} /> : <X size={16} color="#444444" style={{ margin: '0 auto' }} />
                        ) : (
                          <span style={{ color: '#a1a1a1' }}>{feat.community}</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px' }}>
                        {typeof feat.pro === 'boolean' ? (
                          feat.pro ? <Check size={16} color="#10b981" style={{ margin: '0 auto' }} /> : <X size={16} color="#444444" style={{ margin: '0 auto' }} />
                        ) : (
                          <span style={{ color: '#38bdf8' }}>{feat.pro}</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px' }}>
                        {typeof feat.enterprise === 'boolean' ? (
                          feat.enterprise ? <Check size={16} color="#10b981" style={{ margin: '0 auto' }} /> : <X size={16} color="#444444" style={{ margin: '0 auto' }} />
                        ) : (
                          <span style={{ color: '#10b981', fontWeight: 600 }}>{feat.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
