import React, { useEffect, useState } from 'react';

/**
 * ReactBits style CountUp component
 * Smoothly animates numbers from a start value to target value.
 */
export default function CountUp({
  to = 100,
  from = 0,
  duration = 1.2,
  separator = '',
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  style = {}
}) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;
    const endValue = Number(to);
    const startValue = Number(from);
    const durationMs = duration * 1000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      
      // Ease-out cubic formula
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easedProgress;

      setValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [to, from, duration]);

  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return (
    <span className={`count-up ${className}`} style={{ ...style }}>
      {prefix}
      {separator ? formattedValue.replace(/,/g, separator) : formattedValue}
      {suffix}
    </span>
  );
}
