import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an unhandled render error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: 'var(--card-bg, #0a0a0a)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            padding: '24px',
            color: '#ffffff',
            margin: '16px 0',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#ef4444' }}>
                Component Render Anomaly Intercepted
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#a1a1a1' }}>
                GhostSlate isolated the fault to protect application state.
              </p>
            </div>
          </div>

          <div
            style={{
              background: '#000000',
              border: '1px solid #222222',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#f87171',
              maxHeight: '120px',
              overflowY: 'auto',
              marginBottom: '16px',
            }}
          >
            {this.state.error?.toString() || 'Unknown UI exception'}
          </div>

          <button
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#171717',
              border: '1px solid #333333',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <RefreshCw size={14} />
            Recover Component State
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
