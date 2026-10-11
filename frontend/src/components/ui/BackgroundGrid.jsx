import React from 'react';

/**
 * Aceternity UI style Background Grid & Ambient Spotlight
 * High-contrast developer grid with radial vignette and top ambient glow.
 */
export default function BackgroundGrid({ children }) {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff' }}>
      {/* Ambient Top Glow (Aceternity Lamp/Spotlight flavor) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '400px',
          background: 'radial-gradient(50% 50% at 50% 0%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Grid Lines Pattern */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 15%, #000 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 15%, #000 50%, transparent 100%)',
          zIndex: 0
        }}
      />

      {/* Foreground Content */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
