import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChaosSimulator from './components/ChaosSimulator';
import StateTimeTravelScrubber from './components/StateTimeTravelScrubber';
import ASTVisualizer from './components/ASTVisualizer';
import AgentDebateStream from './components/AgentDebateStream';
import MonacoDiffStudio from './components/MonacoDiffStudio';
import SandboxTerminal from './components/SandboxTerminal';
import ExportModal from './components/ExportModal';
import BackgroundGrid from './components/ui/BackgroundGrid';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  const [provider, setProvider] = useState('deterministic');
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('race_condition');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('healed');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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
  }, []);

  const triggerHeal = async (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    setLoading(true);
    setStage('recording_trace');

    try {
      // Step transitions for smooth micro-animations
      setTimeout(() => setStage('ast_isolation'), 500);
      setTimeout(() => setStage('agent_debate'), 1000);
      setTimeout(() => setStage('sandbox_verifying'), 1600);

      const res = await fetch(`${API_BASE}/api/heal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId })
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
  };

  return (
    <BackgroundGrid>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <Header
          provider={provider}
          setProvider={setProvider}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          session={session}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Chaos Injection Simulator & 5-Stage Stepper */}
          <ChaosSimulator
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={(id) => triggerHeal(id)}
            onTriggerHeal={(id) => triggerHeal(id)}
            loading={loading}
            stage={stage}
          />

          {/* Two-Column Bento Grid: State Invariant Inspection & Multi-Agent Verification */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '20px',
            margin: '0 20px'
          }}>
            {/* Column 1: Time-Travel Runtime Scrubber & AST Scoping Inspector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <AgentDebateStream
                debateTurns={session?.debate_turns}
              />

              <SandboxTerminal
                verification={session?.verification}
              />
            </div>
          </div>

          {/* Full-Width Monaco Diff Studio */}
          <div style={{ margin: '0 20px 24px 20px' }}>
            <MonacoDiffStudio
              patch={session?.patch}
              originalCode={session?.original_code}
              language={session?.language || 'python'}
            />
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          margin: '0 20px 20px 20px',
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-muted)' }}>
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
      </div>
    </BackgroundGrid>
  );
}
