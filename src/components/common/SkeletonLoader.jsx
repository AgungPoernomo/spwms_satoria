export default function SkeletonLoader({ type = 'card', lines = 3, className = '' }) {
  if (type === 'table') {
    return (
      <div className={`w-full overflow-x-auto ${className}`}>
        <table className="w-full text-left">
          <thead>
            <tr>
              {[...Array(4)].map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-slate-200 rounded animate-shimmer w-24"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(lines)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(4)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded animate-shimmer w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(lines)].map((_, i) => (
          <div 
            key={i} 
            className="h-4 bg-slate-200 rounded animate-shimmer"
            style={{ width: `${Math.max(60, Math.random() * 100)}%` }}
          ></div>
        ))}
      </div>
    );
  }

  // Default: Card
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl animate-shimmer"></div>
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-200 rounded animate-shimmer w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded animate-shimmer w-1/4"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(lines)].map((_, i) => (
          <div key={i} className="h-4 bg-slate-100 rounded animate-shimmer w-full"></div>
        ))}
      </div>
    </div>
  );
}
