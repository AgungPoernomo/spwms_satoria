import { useState, useMemo } from 'react';
import Pagination from '../common/Pagination';
import { formatDate } from '../../utils/formatDate';
import { PackagePlus, Building2, FileText, Calendar } from 'lucide-react';

export default function IncomingTransactionTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useMemo(() => { setCurrentPage(1); }, [data.length]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <PackagePlus size={28} className="text-slate-400" />
        </div>
        <div className="text-center">
          <p className="text-slate-700 font-semibold text-base">Tidak ada data ditemukan</p>
          <p className="text-slate-400 text-sm mt-1">Coba ubah filter atau tambah penerimaan baru</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Table Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
            <PackagePlus size={13} className="text-emerald-600" />
          </div>
          <span className="text-sm font-bold text-slate-700">Daftar Penerimaan</span>
          <span className="ml-1 text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {data.length} record
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-white">
              <th className="table-header px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-emerald-600" />
                  Tanggal Masuk
                </div>
              </th>
              <th className="table-header px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <PackagePlus size={12} className="text-emerald-600" />
                  Part &amp; Kode
                </div>
              </th>
              <th className="table-header text-right px-5 py-3.5">Jumlah</th>
              <th className="table-header px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <Building2 size={12} className="text-emerald-600" />
                  Supplier
                </div>
              </th>
              <th className="table-header px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <FileText size={12} className="text-emerald-600" />
                  No. PO / Invoice
                </div>
              </th>
              <th className="table-header px-5 py-3.5 max-w-[200px]">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((tx, idx) => (
              <tr
                key={tx.id}
                className="border-b border-slate-50 hover:bg-gradient-to-r hover:from-emerald-50/40 hover:to-transparent transition-colors duration-150 group"
              >
                {/* Date */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                      <Calendar size={14} className="text-primary-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{formatDate(tx.tanggal_masuk)}</span>
                  </div>
                </td>

                {/* Part & Code */}
                <td className="px-5 py-3.5">
                  <p className="font-bold text-slate-800 text-sm">{tx.nama_part}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded inline-block">
                    {tx.kode_part}
                  </p>
                </td>

                {/* Quantity */}
                <td className="px-5 py-3.5 text-right">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-sm px-3 py-1 rounded-lg">
                    <PackagePlus size={13} className="text-emerald-500" />
                    +{tx.jumlah}
                  </span>
                </td>

                {/* Supplier */}
                <td className="px-5 py-3.5">
                  {tx.supplier ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Building2 size={11} className="text-blue-600" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{tx.supplier}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">—</span>
                  )}
                </td>

                {/* PO / Invoice */}
                <td className="px-5 py-3.5">
                  {tx.no_po_invoice ? (
                    <span className="text-xs font-mono font-semibold bg-violet-50 text-violet-700 border border-violet-100 px-2 py-1 rounded-lg">
                      {tx.no_po_invoice}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">—</span>
                  )}
                </td>

                {/* Notes */}
                <td className="px-5 py-3.5 max-w-[200px]">
                  <span className="text-xs text-slate-500 truncate block" title={tx.keterangan}>
                    {tx.keterangan || <span className="italic text-slate-300">—</span>}
                  </span>
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
