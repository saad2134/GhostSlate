import React from 'react';

/**
 * Aceternity UI style Border Beam
 * An animated light beam that travels around the perimeter of a card.
 */
export default function BorderBeam({
  size = 200,
  duration = 8,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#ffffff',
  colorTo = 'rgba(255, 255, 255, 0)',
  delay = 0
}) {
  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        border: `${borderWidth}px solid transparent`,
        maskImage: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        maskClip: 'padding-box, border-box',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'xor',
        zIndex: 1
      }}
    >
      <div
        style={{
          position: 'absolute',
          aspectRatio: '1',
          width: `${size}px`,
          animation: `border-beam ${duration}s infinite linear`,
          animationDelay: `${delay}s`,
          background: `conic-gradient(from ${anchor}deg at 50% 50%, ${colorFrom} 0%, ${colorTo} 25%, transparent 50%)`,
          offsetPath: 'rect(0 auto auto 0 round inherit)',
          offsetRotate: 'auto'
        }}
      />
      <style>{`
        @keyframes border-beam {
          0% {
            offset-distance: 0%;
          }
          100% {
            offset-distance: 100%;
          }
        }
      `}</style>
    </div>
  );
}
