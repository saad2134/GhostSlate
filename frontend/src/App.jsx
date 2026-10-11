import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ChaosSimulator from './components/ChaosSimulator';
import StateTimeTravelScrubber from './components/StateTimeTravelScrubber';
import ASTVisualizer from './components/ASTVisualizer';
import AgentDebateStream from './components/AgentDebateStream';
import MonacoDiffStudio from './components/MonacoDiffStudio';
import SandboxTerminal from './components/SandboxTerminal';
import ExportModal from './components/ExportModal';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import BackgroundGrid from './components/ui/BackgroundGrid';

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

  const triggerHeal = useCallback(async (scenarioId, overrideCode, overrideTest) => {
    setSelectedScenarioId(scenarioId);
    setLoading(true);
    setStage('recording_trace');

    try {
      // Step transitions for smooth micro-animations
      setTimeout(() => setStage('ast_isolation'), 500);
      setTimeout(() => setStage('agent_debate'), 1000);
      setTimeout(() => setStage('sandbox_verifying'), 1600);

      const payload = { scenario_id: scenarioId };
      if (scenarioId === 'custom') {
        payload.custom_code = overrideCode !== undefined ? overrideCode : customCode;
        payload.custom_test = overrideTest !== undefined ? overrideTest : customTest;
      }

      const res = await fetch(`${API_BASE}/api/heal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setTimeout(() => {
        setSession(data);
        setStage(data.stage || 'healed');
        setLoading(false);
      }, 2100);
    } catch (err) {
      console.error('Heal request failed:', err);
      setLoading(false);
      setStage('failed');
    }
  }, [customCode, customTest]);

  // Fetch scenarios on mount and run initial session
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

  // Hands-free keyboard shortcuts navigation (1-6 scenarios, Space heal, E export, ? shortcuts)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      if (e.key >= '1' && e.key <= '6') {
        const idx = parseInt(e.key) - 1;
        if (scenarios[idx]) triggerHeal(scenarios[idx].id);
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
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
  }, [scenarios, selectedScenarioId, triggerHeal]);

  return (
    <BackgroundGrid>
      <a href="#main-content" className="skip-to-content" aria-label="Skip to main content">
        Skip to main content
      </a>

      <div className="responsive-app-container">
        {/* Top Header */}
        <Header
          provider={provider}
          setProvider={setProvider}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
          session={session}
        />

        <main id="main-content" className="responsive-main">
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

        {/* 1-Click PR & SARIF Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          session={session}
        />

        {/* Rapid Keyboard Navigation Overlay */}
        <KeyboardShortcutsModal
          isOpen={isShortcutsModalOpen}
          onClose={() => setIsShortcutsModalOpen(false)}
        />
      </div>
    </BackgroundGrid>
  );
}
