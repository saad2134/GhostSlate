import React from 'react';

/**
 * ReactBits style ShinyText component
 * Creates a subtle metallic light reflection across text.
 */
export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  style = {}
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${className}`}
      style={{
        display: 'inline-block',
        background: disabled
          ? '#ffffff'
          : 'linear-gradient(120deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: disabled ? '#ffffff' : 'transparent',
        animation: disabled ? 'none' : `shiny-text-shimmer ${animationDuration} infinite linear`,
        ...style
      }}
    >
      {text}
      <style>{`
        @keyframes shiny-text-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </span>
  );
}
