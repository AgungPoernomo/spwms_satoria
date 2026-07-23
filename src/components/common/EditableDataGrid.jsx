import { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X, AlertCircle } from 'lucide-react';

export default function EditableDataGrid({
  columns,
  data,
  onUpdateRow,
  onDeleteRow,
  primaryKey = 'id'
}) {
  const [editingCell, setEditingCell] = useState(null); // { rowId, accessor }
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const handleEditClick = (rowId, accessor, currentValue) => {
    setEditingCell({ rowId, accessor });
    setEditValue(currentValue);
    setError('');
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
    setError('');
  };

  const handleSave = (row, col) => {
    // Validation
    if (col.type === 'number') {
      const numValue = Number(editValue);
      if (isNaN(numValue)) {
        setError('Hanya angka yang diperbolehkan');
        return;
      }
    } else if (col.required && !editValue.toString().trim()) {
      setError('Kolom ini wajib diisi');
      return;
    }

    if (onUpdateRow) {
      const updatedRow = {
        ...row,
        [col.accessor]: col.type === 'number' ? Number(editValue) : editValue
      };
      onUpdateRow(updatedRow);
    }
    handleCancel();
  };

  const handleKeyDown = (e, row, col) => {
    if (e.key === 'Enter') {
      handleSave(row, col);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="px-6 py-4">
                {col.header}
              </th>
            ))}
            {(onUpdateRow || onDeleteRow) && (
              <th className="px-6 py-4 text-center">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-500">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[primaryKey]} className="hover:bg-slate-50/50 transition-colors group">
                {columns.map((col) => {
                  const isEditing = editingCell?.rowId === row[primaryKey] && editingCell?.accessor === col.accessor;
                  
                  return (
                    <td key={col.accessor} className="px-6 py-3 relative">
                      {isEditing ? (
                        <div className="flex items-center gap-2 relative">
                          <input
                            ref={inputRef}
                            type={col.type === 'number' ? 'text' : 'text'}
                            value={editValue}
                            onChange={(e) => {
                              setEditValue(e.target.value);
                              setError('');
                            }}
                            onKeyDown={(e) => handleKeyDown(e, row, col)}
                            className={`w-full px-2 py-1.5 text-sm border rounded outline-none focus:ring-2 focus:ring-primary-500/30 ${
                              error ? 'border-danger-500 focus:border-danger-500 bg-danger-50' : 'border-primary-500'
                            }`}
                          />
                          <button onClick={() => handleSave(row, col)} className="text-success-600 hover:text-success-700 p-1">
                            <Check size={16} />
                          </button>
                          <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 p-1">
                            <X size={16} />
                          </button>
                          {error && (
                            <div className="absolute -bottom-5 left-0 text-[10px] text-danger-600 flex items-center gap-1 font-medium whitespace-nowrap">
                              <AlertCircle size={10} /> {error}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={col.className || ''}>
                            {col.format ? col.format(row[col.accessor]) : row[col.accessor]}
                          </span>
                          {col.editable !== false && onUpdateRow && (
                            <button
                              onClick={() => handleEditClick(row[primaryKey], col.accessor, row[col.accessor])}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary-600 transition-all p-1"
                              title="Edit sel"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
                {(onUpdateRow || onDeleteRow) && (
                  <td className="px-6 py-3 text-center">
                    {onDeleteRow && (
                      <button 
                        onClick={() => onDeleteRow(row)}
                        className="text-danger-500 hover:text-danger-700 font-semibold text-xs px-2 py-1 rounded hover:bg-danger-50 transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
