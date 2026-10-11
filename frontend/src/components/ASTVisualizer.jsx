import React, { useState } from 'react';
import { GitFork, Crosshair } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';
import DecryptedText from './ui/DecryptedText';
import CountUp from './ui/CountUp';

export default function ASTVisualizer({ astNodes, isolatedNode }) {
  const [filterType, setFilterType] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = astNodes || [];

  if (nodes.length === 0) {
    return (
      <SpotlightCard style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <GitFork size={26} style={{ opacity: 0.5, marginBottom: '8px' }} />
        <p style={{ fontSize: '0.8rem', margin: 0 }}>Parsing AST syntax tree and extracting scope hierarchy...</p>
      </SpotlightCard>
    );
  }

  const activeNode = selectedNode || isolatedNode || nodes[0];
  const nodeTypes = ['all', ...new Set(nodes.map(n => n.node_type))].slice(0, 8);

  const filteredNodes = nodes.filter(n => {
    if (filterType === 'all') return true;
    return n.node_type === filterType;
  });

  return (
    <SpotlightCard style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#0a0a0a' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            <ShinyText text="Tree-Sitter AST Scoping ✦ Node Isolation" speed={4} />
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Surgical syntax node targeting ✦ Eliminates destructive whole-file rewrites
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="vercel-pill" style={{ padding: '4px 10px' }}>
            Tree-Sitter C Grammar
          </span>
          <span className="vercel-pill" style={{ padding: '4px 10px' }}>
            <CountUp to={nodes.length} duration={0.8} /> Nodes
          </span>
        </div>
      </div>

      {/* Isolated Target Node Banner */}
      {isolatedNode && (
        <div style={{
          backgroundColor: '#111111',
          border: '1px solid #ffffff',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Crosshair size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fbbf24' }}>
              <DecryptedText
                text={`Target Node: ${isolatedNode.node_type} (L${isolatedNode.start_point[0]}:${isolatedNode.start_point[1]} ✦ L${isolatedNode.end_point[0]}:${isolatedNode.end_point[1]})`}
                speed={25}
                maxIterations={10}
              />
            </span>
          </div>
          <span className="vercel-pill" style={{ color: '#ffffff', borderColor: '#444444', fontSize: '0.7rem', padding: '3px 10px' }}>
            Scope: {isolatedNode.enclosing_scope || 'Enclosing Block'}
          </span>
        </div>
      )}

      {/* Filter Tabs (Properly Padded) */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '2px 0 4px 0' }}>
        {nodeTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              backgroundColor: filterType === type ? '#ffffff' : '#111111',
              border: filterType === type ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
              color: filterType === type ? '#000000' : 'var(--text-secondary)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Node Pills Box with Generous Padding */}
      <div style={{
        maxHeight: '140px',
        overflowY: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        backgroundColor: '#050505',
        padding: '12px 14px',
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
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                padding: '4px 8px',
                borderRadius: '5px',
                backgroundColor: isTarget
                  ? '#ffffff'
                  : (isCurrent ? '#222222' : '#0a0a0a'),
                border: isTarget
                  ? '1px solid #ffffff'
                  : (isCurrent ? '1px solid #666666' : '1px solid #1a1a1a'),
                color: isTarget ? '#000000' : (isCurrent ? '#ffffff' : '#888888'),
                cursor: 'pointer',
                fontWeight: isTarget ? 700 : 500,
                transition: 'all 0.15s ease'
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
          borderRadius: '8px',
          padding: '12px 16px',
          border: '1px solid var(--border-subtle)',
          marginTop: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 500 }}>AST Node Snippet ✦ {activeNode.node_type}</span>
            <span>Lines {activeNode.start_point[0]} ✦ {activeNode.end_point[0]}</span>
          </div>
          <pre style={{
            fontSize: '0.76rem',
            color: '#ededed',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-wrap',
            margin: 0,
            lineHeight: 1.5
          }}>
            {activeNode.source_snippet || '<Node snippet>'}
          </pre>
        </div>
      )}
    </SpotlightCard>
  );
}
