import React from 'react';

interface RadialGaugeProps {
  value: number; // 0-100
  color: string;
  trackColor?: string;
  size?: number;
  label?: string;
  sublabel?: string;
}

const RadialGauge: React.FC<RadialGaugeProps> = ({ value, color, trackColor = '#e8e8ed', size = 240, label, sublabel }) => {
  const r = 90;
  const circumference = Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * circumference;

  return (
    <div className="relative mx-auto" style={{ width: size, maxWidth: '100%' }}>
      <svg viewBox="0 0 200 110" className="w-full">
        <path d="M10,100 A90,90 0 0 1 190,100" fill="none" stroke={trackColor} strokeWidth="16" strokeLinecap="round" />
        <path
          d="M10,100 A90,90 0 0 1 190,100"
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.32,0.72,0,1)' }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-1">
        {label && <span className="text-4xl font-black text-ink leading-none tracking-tight">{label}</span>}
        {sublabel && <span className="text-[11px] text-ink-tertiary font-semibold uppercase tracking-wide mt-1.5">{sublabel}</span>}
      </div>
    </div>
  );
};

export default RadialGauge;
