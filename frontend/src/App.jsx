import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import ChaosSimulator from './components/ChaosSimulator';
import StateTimeTravelScrubber from './components/StateTimeTravelScrubber';
import ASTVisualizer from './components/ASTVisualizer';
import AgentDebateStream from './components/AgentDebateStream';
import MonacoDiffStudio from './components/MonacoDiffStudio';
import SandboxTerminal from './components/SandboxTerminal';
import ExportModal from './components/ExportModal';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import EnterprisePocModal from './components/EnterprisePocModal';
import BackgroundGrid from './components/ui/BackgroundGrid';
import ErrorBoundary from './components/ErrorBoundary';

// Public & Enterprise View Components
import LandingView from './components/views/LandingView';
import LegalComplianceView from './components/views/LegalComplianceView';
import ArchitectureDocsView from './components/views/ArchitectureDocsView';
import PricingTiersView from './components/views/PricingTiersView';

const API_BASE = import.meta.env.VITE_API_BASE ?? (typeof window !== 'undefined' && window.location.port === '5180' ? 'http://127.0.0.1:8000' : '');

export default function App() {
  const [provider, setProvider] = useState('deterministic');
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('race_condition');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('healed');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isPocModalOpen, setIsPocModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('studio'); // 'studio', 'overview', 'architecture', 'compliance', 'pricing'

  // Custom Evaluator Sandbox code & test assertion state
  const [customCode, setCustomCode] = useState(`class DataBuffer:
    def __init__(self, capacity: int = 4):
        self.capacity = capacity
        self.items = []

    def push(self, val: int) -> bool:
        # BUG: Off-by-one boundary check allows overflow when full
        if len(self.items) <= self.capacity:
            self.items.append(val)
            return True
        return False
`);
  const [customTest, setCustomTest] = useState(`import pytest
from target import DataBuffer

def test_data_buffer_boundary():
    buf = DataBuffer(capacity=4)
    for i in range(4):
        assert buf.push(i) is True
    # 5th item must be rejected
    assert buf.push(99) is False, "Buffer overflow: item accepted beyond capacity!"
    assert len(buf.items) == 4
`);

  // GS-UI-01: Decouple custom code & test via refs to prevent infinite re-fetch & reset loops on typing
  const customCodeRef = useRef(customCode);
  const customTestRef = useRef(customTest);
  useEffect(() => { customCodeRef.current = customCode; }, [customCode]);
  useEffect(() => { customTestRef.current = customTest; }, [customTest]);

  // GS-UI-07: Track and clear pending timeouts during rapid scenario switches
  const timersRef = useRef([]);
  const clearAllTimers = () => {
    timersRef.current.forEach(id => clearTimeout(id));
    timersRef.current = [];
  };

  const triggerHeal = useCallback(async (scenarioId, overrideCode, overrideTest) => {
    clearAllTimers();
    setSelectedScenarioId(scenarioId);
    setLoading(true);
    setStage('recording_trace');

    try {
      // Step transitions for smooth micro-animations
      const t1 = setTimeout(() => setStage('ast_isolation'), 500);
      const t2 = setTimeout(() => setStage('agent_debate'), 1000);
      const t3 = setTimeout(() => setStage('sandbox_verifying'), 1600);
      timersRef.current.push(t1, t2, t3);

      const payload = { scenario_id: scenarioId };
      if (scenarioId === 'custom') {
        payload.custom_code = overrideCode !== undefined ? overrideCode : customCodeRef.current;
        payload.custom_test = overrideTest !== undefined ? overrideTest : customTestRef.current;
      }

      const res = await fetch(`${API_BASE}/api/heal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      // GS-UI-03: Strict error verification - never claim healed on HTTP errors
      if (!res.ok) {
        throw new Error(data.detail || `Server returned status ${res.status}`);
      }

      const t4 = setTimeout(() => {
        setSession(data);
        setStage(data.stage || 'healed');
        setLoading(false);
      }, 2100);
      timersRef.current.push(t4);
    } catch (err) {
      console.error('Heal request failed:', err);
      clearAllTimers();
      setLoading(false);
      setStage('failed');
    }
  }, []);

  // Fetch scenarios on mount and run initial session once
  useEffect(() => {
    fetch(`${API_BASE}/api/scenarios`)
      .then(res => res.json())
      .then(data => {
        setScenarios(data);
        if (data.length > 0) {
          triggerHeal(data[0].id);
        }
      })
      .catch(err => {
        console.error('Failed to load scenarios:', err);
      });
  }, [triggerHeal]);

  // GS-UI-02: Robust keyboard shortcuts without editor, textarea, contenteditable, or modal collisions
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Guard against focused inputs, textareas, contenteditable, or Monaco Editor
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT' ||
        e.target.isContentEditable ||
        e.target.closest?.('.monaco-editor') ||
        e.target.closest?.('[contenteditable="true"]') ||
        isExportModalOpen ||
        isShortcutsModalOpen
      ) {
        if (e.key === 'Escape') {
          setIsExportModalOpen(false);
          setIsShortcutsModalOpen(false);
        }
        return;
      }

      // Guard against browser / system modifier keys (Ctrl+1, Cmd+1, Alt+1)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key >= '1' && e.key <= '6') {
        const idx = parseInt(e.key, 10) - 1;
        if (scenarios[idx]) {
          if (activeView !== 'studio') setActiveView('studio');
          triggerHeal(scenarios[idx].id);
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (activeView !== 'studio') setActiveView('studio');
        triggerHeal(selectedScenarioId);
      } else if (e.key === 'e' || e.key === 'E') {
        setIsExportModalOpen(true);
      } else if (e.key === '?' || e.key === '/') {
        setIsShortcutsModalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsExportModalOpen(false);
        setIsShortcutsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scenarios, selectedScenarioId, triggerHeal, activeView, isExportModalOpen, isShortcutsModalOpen]);

  const [showQuickstart, setShowQuickstart] = useState(true);

  const handleLaunchStudio = (scenarioId) => {
    setActiveView('studio');
    if (scenarioId) {
      triggerHeal(scenarioId);
    }
  };

  return (
    <BackgroundGrid>
      <a href="#main-content" className="skip-to-content" aria-label="Skip to main content">
        Skip to main content
      </a>

      <div className="responsive-app-container">
        {/* Top Header with Tab Switcher */}
        <Header
          provider={provider}
          setProvider={setProvider}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
          onOpenPocModal={() => setIsPocModalOpen(true)}
          session={session}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <main id="main-content" className="responsive-main">
          {/* View Router */}
          {activeView === 'overview' && (
            <ErrorBoundary onReset={() => setActiveView('studio')}>
              <div className="responsive-page-container">
                <LandingView onLaunchStudio={handleLaunchStudio} />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'architecture' && (
            <ErrorBoundary onReset={() => setActiveView('studio')}>
              <div className="responsive-page-container">
                <ArchitectureDocsView apiBase={API_BASE} />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'compliance' && (
            <ErrorBoundary onReset={() => setActiveView('studio')}>
              <div className="responsive-page-container">
                <LegalComplianceView />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'pricing' && (
            <ErrorBoundary onReset={() => setActiveView('studio')}>
              <div className="responsive-page-container">
                <PricingTiersView onLaunchStudio={handleLaunchStudio} />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'studio' && (
            <ErrorBoundary onReset={() => triggerHeal('race_condition')}>
              {/* 3-Step Interactive Guided Tour Banner */}
              {showQuickstart && (
                <div className="responsive-quickstart-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#38bdf8' }}>
                      <span>✦ 3-Step Studio Quickstart:</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#a1a1a1', flexWrap: 'wrap' }}>
                      <span><strong style={{ color: '#ffffff' }}>1.</strong> Select or Inject Chaos Scenario</span>
                      <span style={{ color: '#444444' }}>→</span>
                      <span><strong style={{ color: '#ffffff' }}>2.</strong> Scrub Time-Travel Slider to Isolate Invariant Breach</span>
                      <span style={{ color: '#444444' }}>→</span>
                      <span><strong style={{ color: '#ffffff' }}>3.</strong> Inspect Verified AST Diff & Export PR</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowQuickstart(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#666666',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: '2px 8px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#666666'; }}
                  >
                    ✕ Dismiss Tour
                  </button>
                </div>
              )}

              {/* Chaos Injection Simulator & 5-Stage Stepper */}
              <ChaosSimulator
                scenarios={scenarios}
                selectedScenarioId={selectedScenarioId}
                onSelectScenario={(id) => triggerHeal(id)}
                onTriggerHeal={(id) => triggerHeal(id)}
                loading={loading}
                stage={stage}
                customCode={customCode}
                setCustomCode={setCustomCode}
                customTest={customTest}
                setCustomTest={setCustomTest}
              />

              {/* Two-Column Bento Grid: State Invariant Inspection & Multi-Agent Verification */}
              <div className="responsive-bento-grid">
                {/* Column 1: Time-Travel Runtime Scrubber & AST Scoping Inspector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
                  <StateTimeTravelScrubber
                    snapshots={session?.snapshots}
                    violation={session?.invariant_violation}
                    streamSync={session?.stream_sync}
                  />

                  <ASTVisualizer
                    astNodes={session?.ast_nodes}
                    isolatedNode={session?.isolated_node}
                  />
                </div>

                {/* Column 2: Dual-Agent Debate Stream & Subprocess Sandbox Terminal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
                  <AgentDebateStream
                    debateTurns={session?.debate_turns}
                  />

                  <SandboxTerminal
                    verification={session?.verification}
                  />
                </div>
              </div>

              {/* Full-Width Monaco Diff Studio */}
              <div className="responsive-diff-wrapper">
                <MonacoDiffStudio
                  patch={session?.patch}
                  originalCode={session?.original_code}
                  language={session?.language || 'python'}
                />
              </div>
            </ErrorBoundary>
          )}
        </main>

        {/* Footer */}
        <footer className="responsive-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <strong style={{ color: '#ffffff' }}>GhostSlate</strong>
            <span style={{ color: '#666666' }}>✦</span>
            <span>
              Created by{' '}
              <a
                href="https://github.com/saad2134"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 500 }}
              >
                Saaduddin Mohammed (github.com/saad2134)
              </a>
            </span>
          </div>
          <div className="footer-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span>Architecture: <strong style={{ color: '#ffffff' }}>Hexagonal Ports & Adapters</strong></span>
            <span style={{ color: '#444444' }}>✦</span>
            <span>AST Engines: <strong style={{ color: '#ffffff' }}>Tree-Sitter C + Python AST</strong></span>
            <span style={{ color: '#444444' }}>✦</span>
            <span>Sandbox: <strong style={{ color: '#ffffff' }}>Isolated Subprocess</strong></span>
          </div>
        </footer>

        {/* 1-Click PR & SARIF Export Modal with dynamic apiBase */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          session={session}
          apiBase={API_BASE}
        />

        {/* Rapid Keyboard Navigation Overlay */}
        <KeyboardShortcutsModal
          isOpen={isShortcutsModalOpen}
          onClose={() => setIsShortcutsModalOpen(false)}
        />

        {/* Enterprise 14-Day POC Evaluation Checklist Modal */}
        <EnterprisePocModal
          isOpen={isPocModalOpen}
          onClose={() => setIsPocModalOpen(false)}
          onLaunchScenario={(id) => handleLaunchStudio(id)}
        />
      </div>
    </BackgroundGrid>
  );
}
