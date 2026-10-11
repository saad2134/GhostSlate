import React, { useState } from 'react';
import { GitFork, Code2, Search, CheckCircle, Crosshair } from 'lucide-react';

export default function ASTVisualizer({ astNodes, isolatedNode }) {
  const [filterType, setFilterType] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = astNodes || [];

  if (nodes.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <GitFork size={28} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.8rem' }}>Parsing AST syntax tree and extracting scope hierarchy...</p>
      </div>
    );
  }

  const activeNode = selectedNode || isolatedNode || nodes[0];
  const nodeTypes = ['all', ...new Set(nodes.map(n => n.node_type))].slice(0, 8);

  const filteredNodes = nodes.filter(n => {
    if (filterType === 'all') return true;
    return n.node_type === filterType;
  });

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GitFork size={18} color="#f59e0b" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
              Tree-Sitter AST Scoping & Node Isolation
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
              Isolating surgical syntax nodes to eliminate whole-file LLM hallucination
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="glass-pill" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
            Tree-Sitter C Grammar
          </span>
          <span className="glass-pill" style={{ color: '#a855f7', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            {astNodes?.length || 0} Nodes
          </span>
        </div>
      </div>

      {/* Isolated Target Node Banner */}
      {isolatedNode && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crosshair size={18} color="#f59e0b" />
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24' }}>
                Isolated Target Syntax Node: <code>{isolatedNode.node_type}</code>
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                Span: L{isolatedNode.start_point[0]}:{isolatedNode.start_point[1]} → L{isolatedNode.end_point[0]}:{isolatedNode.end_point[1]}
              </span>
            </div>
          </div>
          <span className="glass-pill" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', fontSize: '0.7rem' }}>
            Scope: {isolatedNode.enclosing_scope || 'Enclosing Function'}
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        {nodeTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              background: filterType === type ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              border: filterType === type ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
              color: filterType === type ? '#ffffff' : '#94a3b8',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Node Cloud / Hierarchy */}
      <div style={{
        maxHeight: '140px',
        overflowY: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)'
      }}>
        {filteredNodes.slice(0, 45).map(node => {
          const isTarget = node.is_faulty_target || (isolatedNode && node.node_id === isolatedNode.node_id);
          const isCurrent = activeNode && node.node_id === activeNode.node_id;

          return (
            <span
              key={node.node_id}
              onClick={() => setSelectedNode(node)}
              className="interactive-card"
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                padding: '3px 8px',
                borderRadius: '5px',
                background: isTarget
                  ? 'rgba(245, 158, 11, 0.25)'
                  : (isCurrent ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)'),
                border: isTarget
                  ? '1px solid #f59e0b'
                  : (isCurrent ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.06)'),
                color: isTarget ? '#fbbf24' : (isCurrent ? '#ffffff' : '#94a3b8'),
                cursor: 'pointer',
                fontWeight: isTarget ? 700 : 500
              }}
            >
              {isTarget ? '🎯 ' : ''}{node.node_type} (L{node.start_point[0]})
            </span>
          );
        })}
      </div>

      {/* Node Detail Snippet */}
      {activeNode && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '8px',
          padding: '10px 14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <span>Selected AST Node Snippet ({activeNode.node_type})</span>
            <span>Lines {activeNode.start_point[0]}–{activeNode.end_point[0]}</span>
          </div>
          <pre style={{
            fontSize: '0.76rem',
            color: '#e2e8f0',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-wrap',
            margin: 0
          }}>
            {activeNode.source_snippet || '<Node snippet>'}
          </pre>
        </div>
      )}
    </div>
  );
}
