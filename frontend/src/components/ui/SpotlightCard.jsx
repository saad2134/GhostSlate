import React, { useRef, useState } from 'react';

/**
 * Aceternity UI / ReactBits style Spotlight Card
 * Renders a subtle radial highlight that follows the user's cursor across surface and border.
 */
export default function SpotlightCard({
  children,
  className = '',
  style = {},
  spotlightColor = 'rgba(255, 255, 255, 0.08)',
  borderColor = '#222222',
  activeBorderColor = '#555555',
  isActive = false,
  ...props
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`vercel-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0a0a0a',
        border: isActive ? `1px solid ${activeBorderColor}` : `1px solid ${borderColor}`,
        borderRadius: '8px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: isActive ? '0 0 25px rgba(255, 255, 255, 0.05)' : 'none',
        ...style
      }}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity: opacity,
          transition: 'opacity 0.25s ease',
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 75%)`,
          zIndex: 1
        }}
      />
      {/* Content Layer */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
