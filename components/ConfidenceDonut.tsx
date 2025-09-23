import React from 'react';

interface ConfidenceDonutProps {
  confidence: number;
  isSuspicious: boolean;
}

export const ConfidenceDonut: React.FC<ConfidenceDonutProps> = ({ confidence, isSuspicious }) => {
  const percentage = Math.round(confidence * 100);
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const color = isSuspicious ? 'text-amber-400' : 'text-green-400';
  const progressColor = isSuspicious ? 'stroke-amber-500' : 'stroke-green-500';

  return (
    <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
      >
        <circle
          className="stroke-slate-700"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`${progressColor} transition-all duration-1000 ease-out`}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${color}`}>
        <span className="text-2xl sm:text-3xl font-bold leading-none">{percentage}%</span>
        <span className="text-xs font-medium tracking-wider uppercase text-slate-400 mt-1">Confidence</span>
      </div>
    </div>
  );
};
