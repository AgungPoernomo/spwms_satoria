import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import useToastStore from '../../store/useToastStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="text-success-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-warning-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-danger-500" size={20} />;
      case 'info':
      default:
        return <Info className="text-primary-500" size={20} />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-success-200';
      case 'warning':
        return 'border-warning-200';
      case 'error':
        return 'border-danger-200';
      case 'info':
      default:
        return 'border-primary-200';
    }
  };

  return (
    <div 
      className={`bg-white shadow-lg rounded-xl border ${getBorderColor()} p-4 flex items-start gap-3 min-w-[300px] animate-slide-up`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{toast.message}</p>
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
