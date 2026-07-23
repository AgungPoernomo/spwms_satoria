import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melakukan tindakan ini?',
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  isDestructive = true
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 animate-scale-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? 'bg-danger-50 text-danger-600' : 'bg-primary-50 text-primary-600'}`}>
              <AlertTriangle size={24} />
            </div>
            
            <div className="flex-1 mt-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {message}
              </p>
            </div>
            
            <button 
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-colors ${
              isDestructive 
                ? 'bg-danger-500 hover:bg-danger-600' 
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
