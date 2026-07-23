import React from 'react';

export default function CapacityProgressBar({ terpakai, kapasitas, className = '' }) {
  const safeKapasitas = kapasitas > 0 ? kapasitas : 1; // Prevent division by zero
  const percentage = Math.min(100, Math.max(0, (terpakai / safeKapasitas) * 100));
  
  let colorClass = 'bg-success-500';
  if (percentage >= 90) {
    colorClass = 'bg-danger-500';
  } else if (percentage >= 50) {
    colorClass = 'bg-warning-500';
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
        <span className="text-slate-500">Kapasitas</span>
        <span className="text-slate-700">{terpakai} / {kapasitas} ({Math.round(percentage)}%)</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
