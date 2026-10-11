import React, { useState, useEffect, useRef } from 'react';

/**
 * ReactBits style DecryptedText component
 * Produces a high-tech hacker / cyberpunk matrix character decryption effect.
 */
export default function DecryptedText({
  text = '',
  speed = 40,
  maxIterations = 12,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?/~',
  className = '',
  encryptedClassName = '',
  style = {}
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let iteration = 0;
    const targetText = String(text);
    const textLength = targetText.length;
    setIsDecrypted(false);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        const result = targetText.split('').map((char, index) => {
          if (char === ' ' || char === '\n' || char === '\t') return char;

          let isResolved = false;
          if (sequential) {
            const threshold = (iteration / maxIterations) * textLength;
            isResolved = revealDirection === 'start' ? index <= threshold : index >= textLength - threshold;
          } else {
            isResolved = iteration >= maxIterations;
          }

          if (isResolved) return char;

          if (useOriginalCharsOnly) {
            return targetText[Math.floor(Math.random() * targetText.length)];
          }
          return characters[Math.floor(Math.random() * characters.length)];
        }).join('');

        return result;
      });

      iteration += 1;

      if (iteration >= maxIterations + (sequential ? textLength : 0)) {
        clearInterval(intervalRef.current);
        setDisplayText(targetText);
        setIsDecrypted(true);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

  return (
    <span
      className={`decrypted-text ${className} ${!isDecrypted ? encryptedClassName : ''}`}
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.02em',
        ...style
      }}
    >
      {displayText}
    </span>
  );
}
