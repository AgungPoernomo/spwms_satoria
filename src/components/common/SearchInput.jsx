import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Debounced search input
 */
export default function SearchInput({ value, onChange, placeholder = 'Cari...', id }) {
  const [local, setLocal] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 300);
    return () => clearTimeout(timer);
  }, [local]);

  useEffect(() => { setLocal(value || ''); }, [value]);

  return (
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        id={id || 'search-input'}
        type="text"
        value={local}
        onChange={e => setLocal(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-9 pr-9 h-9 text-sm w-full min-w-[200px]"
      />
      {local && (
        <button
          onClick={() => { setLocal(''); onChange(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label="Hapus pencarian"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
