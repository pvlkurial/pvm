interface StatsProgressBarProps {
  label: string;
  current: number;
  total: number;
  color: 'green' | 'yellow';
}

export function StatsProgressBar({ label, current, total, color }: StatsProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  
  const bgColor = color === 'green' 
    ? 'bg-green-500/20' 
    : 'bg-yellow-500/20';
  
  const fillColor = color === 'green'
    ? 'bg-green-500'
    : 'bg-yellow-500';
  
  const textColor = color === 'green'
    ? 'text-green-400'
    : 'text-yellow-400';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className={`font-semibold ${textColor}`}>
          {current}/{total}
        </span>
      </div>
      <div className={`w-full h-2 rounded-full ${bgColor} overflow-hidden`}>
        <div
          className={`h-full ${fillColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right">
        <span className="text-xs text-white/50">
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}