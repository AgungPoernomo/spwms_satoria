import { useState, useMemo } from 'react';
import Pagination from '../common/Pagination';
import { formatDate } from '../../utils/formatDate';

export default function IncomingTransactionTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useMemo(() => { setCurrentPage(1); }, [data.length]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
        <p className="text-slate-500 font-medium">Tidak ada data transaksi masuk ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-emerald-50/50 border-b border-emerald-100">
            <tr>
              <th className="table-header">Tanggal Masuk</th>
              <th className="table-header">Part & Kode</th>
              <th className="table-header text-right">Jumlah</th>
              <th className="table-header">Supplier</th>
              <th className="table-header">No. PO / Invoice</th>
              <th className="table-header max-w-[200px]">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((tx) => (
              <tr key={tx.id} className="table-row">
                <td className="table-cell font-medium text-slate-700">{formatDate(tx.tanggal_masuk)}</td>
                <td className="table-cell">
                  <p className="font-semibold text-slate-800">{tx.nama_part}</p>
                  <p className="text-xs text-slate-500">{tx.kode_part}</p>
                </td>
                <td className="table-cell text-right font-bold text-emerald-600 text-base">+{tx.jumlah}</td>
                <td className="table-cell text-slate-600">{tx.supplier || '-'}</td>
                <td className="table-cell text-slate-600">{tx.no_po_invoice || '-'}</td>
                <td className="table-cell text-slate-500 truncate max-w-[200px]" title={tx.keterangan}>
                  {tx.keterangan || '-'}
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
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
