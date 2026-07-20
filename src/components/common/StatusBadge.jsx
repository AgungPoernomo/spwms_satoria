import { AlertTriangle, CheckCircle, TrendingUp, InboxIcon } from 'lucide-react';

/**
 * Color-coded status badge for spare part stock status
 */
export default function StatusBadge({ status }) {
  const config = {
    Kritis: {
      className: 'badge-kritis',
      icon: <AlertTriangle size={11} />,
    },
    Normal: {
      className: 'badge-normal',
      icon: <CheckCircle size={11} />,
    },
    Berlebih: {
      className: 'badge-berlebih',
      icon: <TrendingUp size={11} />,
    },
  };

  const { className, icon } = config[status] || {
    className: 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600',
    icon: <InboxIcon size={11} />,
  };

  return (
    <span className={className}>
      {icon}
      {status}
    </span>
  );
}
