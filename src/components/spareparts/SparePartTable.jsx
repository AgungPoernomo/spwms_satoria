import { useState, useMemo } from 'react';
import { ArrowUpDown, Edit2, Trash2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import Pagination from '../common/Pagination';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency as formatRupiah } from '../../utils/formatCurrency';

export default function SparePartTable({ data, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState({ key: 'kode_part', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Reset pagination when data length changes significantly (e.g. filter applied)
  useMemo(() => { setCurrentPage(1); }, [data.length]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = () => <ArrowUpDown size={12} className="inline ml-1 text-slate-300" />;

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
        <p className="text-slate-500 font-medium">Tidak ada data spare part ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="table-header w-20" onClick={() => handleSort('kode_part')}>Kode <SortIcon/></th>
              <th className="table-header min-w-[200px]" onClick={() => handleSort('nama_part')}>Nama Part / Merk <SortIcon/></th>
              <th className="table-header" onClick={() => handleSort('kategori')}>Kategori <SortIcon/></th>
              <th className="table-header" onClick={() => handleSort('lokasi_rak')}>Lokasi <SortIcon/></th>
              <th className="table-header text-right" onClick={() => handleSort('stok_saat_ini')}>Stok Aktual <SortIcon/></th>
              <th className="table-header text-center" onClick={() => handleSort('status')}>Status <SortIcon/></th>
              <th className="table-header text-right" onClick={() => handleSort('harga_satuan')}>Harga Satuan <SortIcon/></th>
              <th className="table-header text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((part) => (
              <tr key={part.id} className="table-row">
                <td className="table-cell font-semibold text-slate-800">{part.kode_part}</td>
                <td className="table-cell">
                  <p className="font-semibold text-slate-800">{part.nama_part}</p>
                  <p className="text-xs text-slate-500">{part.merk_type}</p>
                </td>
                <td className="table-cell">{part.kategori}</td>
                <td className="table-cell text-slate-600">{part.lokasi_rak}</td>
                <td className="table-cell text-right">
                  <span className="font-bold text-slate-800 text-base">{part.stok_saat_ini}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ({part.stok_minimum} - {part.stok_maksimum})
                  </span>
                </td>
                <td className="table-cell text-center">
                  <StatusBadge status={part.status} />
                </td>
                <td className="table-cell text-right font-medium">
                  {formatRupiah(part.harga_satuan)}
                </td>
                <td className="table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(part)}
                      className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit Part"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(part)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Part"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={sortedData.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
