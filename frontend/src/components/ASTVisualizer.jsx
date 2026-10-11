import React, { useState } from 'react';
import { GitFork, Crosshair } from 'lucide-react';

export default function ASTVisualizer({ astNodes, isolatedNode }) {
  const [filterType, setFilterType] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = astNodes || [];

  if (nodes.length === 0) {
    return (
      <div className="vercel-card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <GitFork size={26} style={{ opacity: 0.5, marginBottom: '6px' }} />
        <p style={{ fontSize: '0.78rem' }}>Parsing AST syntax tree and extracting scope hierarchy...</p>
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
    <div className="vercel-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#0a0a0a' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Tree-Sitter AST Scoping ✦ Node Isolation
          </h3>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: 0 }}>
            Surgical syntax node targeting ✦ Eliminates destructive whole-file rewrites
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="vercel-pill">
            Tree-Sitter C Grammar
          </span>
          <span className="vercel-pill">
            {nodes.length} Nodes
          </span>
        </div>
      </div>

      {/* Isolated Target Node Banner */}
      {isolatedNode && (
        <div style={{
          backgroundColor: '#111111',
          border: '1px solid #ffffff',
          borderRadius: '6px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crosshair size={15} color="#f59e0b" />
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#fbbf24' }}>
              Target Node: <code>{isolatedNode.node_type}</code> (L{isolatedNode.start_point[0]}:{isolatedNode.start_point[1]} ✦ L{isolatedNode.end_point[0]}:{isolatedNode.end_point[1]})
            </span>
          </div>
          <span className="vercel-pill" style={{ color: '#ffffff', borderColor: '#444444', fontSize: '0.68rem' }}>
            Scope: {isolatedNode.enclosing_scope || 'Enclosing Block'}
          </span>
        </div>
      )}

      {/* Filter Tabs (Vercel Style) */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        {nodeTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              backgroundColor: filterType === type ? '#ffffff' : '#111111',
              border: filterType === type ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
              color: filterType === type ? '#000000' : 'var(--text-secondary)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Node Pills */}
      <div style={{
        maxHeight: '130px',
        overflowY: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px',
        backgroundColor: '#050505',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid var(--border-subtle)'
      }}>
        {filteredNodes.slice(0, 45).map(node => {
          const isTarget = node.is_faulty_target || (isolatedNode && node.node_id === isolatedNode.node_id);
          const isCurrent = activeNode && node.node_id === activeNode.node_id;

          return (
            <span
              key={node.node_id}
              onClick={() => setSelectedNode(node)}
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: isTarget
                  ? '#ffffff'
                  : (isCurrent ? '#222222' : '#0a0a0a'),
                border: isTarget
                  ? '1px solid #ffffff'
                  : (isCurrent ? '1px solid #666666' : '1px solid #1a1a1a'),
                color: isTarget ? '#000000' : (isCurrent ? '#ffffff' : '#888888'),
                cursor: 'pointer',
                fontWeight: isTarget ? 700 : 400
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
          backgroundColor: '#050505',
          borderRadius: '6px',
          padding: '8px 12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>AST Node Snippet ✦ {activeNode.node_type}</span>
            <span>Lines {activeNode.start_point[0]} ✦ {activeNode.end_point[0]}</span>
          </div>
          <pre style={{
            fontSize: '0.74rem',
            color: '#ededed',
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
