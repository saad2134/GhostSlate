import React, { useState, useRef, useEffect } from 'react';
import { Cpu, GitPullRequest, Keyboard, ChevronDown, Check, Code, Globe, Shield, BookOpen, DollarSign, ClipboardCheck } from 'lucide-react';
import appIcon from '../assets/app-icon.png';
import ShinyText from './ui/ShinyText';
import DecryptedText from './ui/DecryptedText';
import ShimmerButton from './ui/ShimmerButton';

export default function Header({
  provider,
  setProvider,
  onOpenExportModal,
  onOpenShortcuts,
  onOpenPocModal,
  session,
  activeView = 'studio',
  setActiveView
}) {
  const isVerified = session?.verification?.is_verified;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const providers = [
    {
      id: 'deterministic',
      label: 'Deterministic Engine',
      badge: 'Offline / Zero-Flake',
      description: 'Local heuristic AST engine with 0 external API calls'
    },
    {
      id: 'gemini',
      label: 'Gemini 2.0 Flash',
      badge: 'Adapter Connected',
      description: 'Google Deepmind multimodal LLM adapter'
    },
    {
      id: 'openai',
      label: 'OpenAI GPT-4o Mini',
      badge: 'Adapter Ready',
      description: 'OpenAI program synthesis adapter'
    }
  ];

  const currentProvider = providers.find(p => p.id === provider) || providers[0];

  const navTabs = [
    { id: 'studio', label: 'Studio', icon: Code },
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'architecture', label: 'Architecture & Docs', icon: BookOpen },
    { id: 'compliance', label: 'Compliance & Security', icon: Shield },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="vercel-card responsive-header" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Row: Brand, Health Badges, and Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
        {/* Brand & App Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={appIcon}
            alt="GhostSlate Icon"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              border: '1px solid #333333',
              objectFit: 'cover',
              backgroundColor: '#0a0a0a',
              flexShrink: 0
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{
                fontSize: '1.18rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                margin: 0
              }}>
                <ShinyText text="GhostSlate" speed={3.5} />
              </h1>
              <span
                className="hide-on-mobile-xs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '24px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  fontSize: '0.69rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #333333',
                  lineHeight: 1,
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)', flexShrink: 0 }}></span>
                <DecryptedText text="Hexagonal Engine Active ✦ v1.0.0" speed={30} maxIterations={10} />
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '24px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  fontSize: '0.69rem',
                  fontWeight: 600,
                  color: '#10b981',
                  backgroundColor: '#05140d',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  lineHeight: 1,
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)', flexShrink: 0 }}></span>
                <span>Stream Sync: Resilient</span>
              </span>
            </div>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Autonomous AST Program Repair ✦ Time-Travel Debugger & Self-Healing Sandbox
            </p>
          </div>
        </div>

        {/* Provider Selector & Export Button */}
        <div className="header-actions-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Custom High-Contrast Provider Dropdown */}
          <div ref={dropdownRef} className="header-provider-box" style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-label="Select Execution Provider"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0a0a0a',
                padding: '6px 12px',
                borderRadius: '6px',
                border: isDropdownOpen ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                width: '100%',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Cpu size={14} color="#a1a1a1" style={{ flexShrink: 0 }} />
                <span style={{ color: 'var(--text-muted)' }}>Provider:</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{currentProvider.label}</span>
                <span className="hide-on-mobile-xs" style={{
                  fontSize: '0.67rem',
                  backgroundColor: '#171717',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  {currentProvider.badge}
                </span>
              </div>
              <ChevronDown
                size={13}
                color="#a1a1a1"
                style={{
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                  flexShrink: 0
                }}
              />
            </button>

            {isDropdownOpen && (
              <div
                role="listbox"
                aria-label="Available execution providers"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  zIndex: 1000,
                  width: 'max-content',
                  minWidth: '240px',
                  maxWidth: 'calc(100vw - 24px)', // GS-UI-08: mobile viewport constraint
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #333333',
                  borderRadius: '8px',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.95)',
                  padding: '5px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                {providers.map((p) => {
                  const isSelected = p.id === provider;
                  return (
                    <button
                      key={p.id}
                      role="option"
                      aria-selected={isSelected}
                      type="button"
                      onClick={() => {
                        setProvider(p.id);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? '#141414' : 'transparent',
                        border: isSelected ? '1px solid #333333' : '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.12s ease',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#111111'; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ffffff' }}>{p.label}</span>
                          <span style={{ fontSize: '0.67rem', color: isSelected ? '#10b981' : '#888888' }}>✦ {p.badge}</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#777777', display: 'block', marginTop: '2px' }}>{p.description}</span>
                      </div>
                      {isSelected && <Check size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px', marginLeft: '8px' }} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hotkeys Button */}
          <button
            onClick={onOpenShortcuts}
            className="vercel-btn-secondary"
            title="Keyboard Shortcuts (?)"
            style={{ padding: '7px 12px', fontSize: '0.78rem' }}
          >
            <Keyboard size={13} />
            <span>Hotkeys (?)</span>
          </button>

          {/* Enterprise POC Checklist Button */}
          <button
            onClick={onOpenPocModal}
            className="vercel-btn-secondary"
            title="Enterprise 14-Day POC Evaluation Checklist"
            style={{ padding: '7px 12px', fontSize: '0.78rem' }}
          >
            <ClipboardCheck size={13} color="#38bdf8" />
            <span className="hide-on-mobile-xs">POC Checklist</span>
          </button>

          {/* Aceternity Shimmer Export Button */}
          <ShimmerButton
            onClick={onOpenExportModal}
            disabled={!isVerified}
            background={isVerified ? '#ffffff' : '#222222'}
            textColor={isVerified ? '#000000' : '#888888'}
            style={{
              padding: '7px 16px',
              fontSize: '0.78rem',
              border: isVerified ? '1px solid #ffffff' : '1px solid #333333'
            }}
          >
            <GitPullRequest size={13} />
            <span>Export PR ✦ SARIF</span>
          </ShimmerButton>
        </div>
      </div>

      {/* Bottom Row: Tab Navigation Bar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          borderTop: '1px solid #1a1a1a',
          paddingTop: '10px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          width: '100%',
        }}
        aria-label="Application View Navigation"
      >
        {navTabs.map((tab) => {
          const isActive = activeView === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView && setActiveView(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#888888',
                background: isActive ? '#171717' : 'transparent',
                border: isActive ? '1px solid #333333' : '1px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#cccccc';
                  e.currentTarget.style.background = '#0f0f0f';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#888888';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={14} color={isActive ? '#ffffff' : '#888888'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
