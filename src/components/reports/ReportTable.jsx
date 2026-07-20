import { useState, useMemo } from 'react';
import Pagination from '../common/Pagination';
import { formatDate } from '../../utils/formatDate';
import { PackagePlus, PackageMinus } from 'lucide-react';

export default function ReportTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useMemo(() => { setCurrentPage(1); }, [data.length]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
        <p className="text-slate-500 font-medium">Tidak ada data laporan ditemukan untuk filter ini.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="table-header">Tanggal</th>
              <th className="table-header">Jenis</th>
              <th className="table-header">Part & Kode</th>
              <th className="table-header text-right">Jumlah</th>
              <th className="table-header">Referensi / Tujuan</th>
              <th className="table-header max-w-[200px]">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((tx) => {
              const isMasuk = tx.jenis === 'Masuk';
              return (
                <tr key={`${tx.jenis}-${tx.id}`} className="table-row">
                  <td className="table-cell font-medium text-slate-700">{formatDate(tx.tanggal)}</td>
                  <td className="table-cell">
                    {isMasuk ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                        <PackagePlus size={12} /> Masuk
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-bold">
                        <PackageMinus size={12} /> Keluar
                      </span>
                    )}
                  </td>
                  <td className="table-cell">
                    <p className="font-semibold text-slate-800">{tx.nama_part}</p>
                    <p className="text-xs text-slate-500">{tx.kode_part}</p>
                  </td>
                  <td className={`table-cell text-right font-bold text-base ${isMasuk ? 'text-emerald-600' : 'text-orange-500'}`}>
                    {isMasuk ? '+' : '-'}{tx.jumlah}
                  </td>
                  <td className="table-cell">
                    <p className="font-medium text-slate-700">{isMasuk ? tx.supplier : tx.tujuan_departemen}</p>
                    <p className="text-xs text-slate-500">{isMasuk ? tx.no_po_invoice : tx.no_permintaan}</p>
                  </td>
                  <td className="table-cell text-slate-500 truncate max-w-[200px]" title={tx.keterangan}>
                    {tx.keterangan || '-'}
                  </td>
                </tr>
              );
            })}
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
