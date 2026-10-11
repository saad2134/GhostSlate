import React from 'react';

/**
 * Aceternity UI style Shimmer Button
 * Features an animated glowing shimmer border around a clean high-contrast core.
 */
export default function ShimmerButton({
  children,
  onClick,
  disabled = false,
  borderRadius = '6px',
  background = '#ffffff',
  textColor = '#000000',
  className = '',
  style = {},
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`shimmer-button ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius,
        padding: '8px 18px',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: textColor,
        backgroundColor: background,
        border: '1px solid #ffffff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.15)',
        ...style
      }}
      {...props}
    >
      {/* Moving Shimmer Highlight */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(110deg, transparent 25%, rgba(0, 0, 0, 0.15) 50%, transparent 75%)',
          backgroundSize: '200% 100%',
          animation: 'button-shimmer 2.5s infinite linear',
          pointerEvents: 'none'
        }}
      />
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {children}
      </span>
      <style>{`
        @keyframes button-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .shimmer-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.35);
        }
        .shimmer-button:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </button>
  );
}
