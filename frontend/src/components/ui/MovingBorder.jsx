import React from 'react';

/**
 * Aceternity UI style MovingBorder
 * An animated glowing gradient beam that moves continuously along the perimeter border.
 */
export default function MovingBorder({
  children,
  duration = 3000,
  rx = '8px',
  glowColor = '#ffffff',
  className = '',
  containerClassName = '',
  style = {},
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`moving-border-container ${containerClassName}`}
      style={{
        position: 'relative',
        padding: '1px',
        overflow: 'hidden',
        borderRadius: rx,
        backgroundColor: 'transparent',
        display: 'inline-block',
        ...style
      }}
      {...props}
    >
      {/* Rotating conic gradient border layer */}
      <div
        style={{
          position: 'absolute',
          inset: '-200%',
          margin: 'auto',
          aspectRatio: '1',
          background: `conic-gradient(from 0deg, transparent 0 340deg, ${glowColor} 360deg)`,
          animation: `moving-border-spin ${duration}ms linear infinite`
        }}
      />
      {/* Card Content container */}
      <div
        className={className}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          borderRadius: `calc(${rx} - 1px)`,
          backgroundColor: '#0a0a0a'
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes moving-border-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Component>
  );
}
