import { useState, useMemo } from 'react';
import useTransactionStore from '../store/useTransactionStore';
import useSparePartStore from '../store/useSparePartStore';
import ReportFilterBar from '../components/reports/ReportFilterBar';
import ReportTable from '../components/reports/ReportTable';
import { exportToCSV } from '../utils/exportToCSV';

export default function ReportsPage() {
  const { transaksiMasuk, transaksiKeluar } = useTransactionStore();
  const { spareParts } = useSparePartStore();
  
  const [filters, setFilters] = useState({
    dateStart: '',
    dateEnd: '',
    kategori: '',
    jenis: '', // 'Masuk' | 'Keluar' | ''
  });

  // Combine and format data for reports
  const combinedData = useMemo(() => {
    let data = [];

    if (filters.jenis === '' || filters.jenis === 'Masuk') {
      const masukMapped = transaksiMasuk.map(tx => {
        const part = spareParts.find(p => p.kode_part === tx.kode_part);
        return {
          id: tx.id,
          jenis: 'Masuk',
          tanggal: tx.tanggal_masuk,
          kode_part: tx.kode_part,
          nama_part: tx.nama_part,
          kategori: part?.kategori || '-',
          jumlah: tx.jumlah,
          supplier: tx.supplier,
          no_po_invoice: tx.no_po_invoice,
          keterangan: tx.keterangan,
        };
      });
      data = [...data, ...masukMapped];
    }

    if (filters.jenis === '' || filters.jenis === 'Keluar') {
      const keluarMapped = transaksiKeluar.map(tx => {
        const part = spareParts.find(p => p.kode_part === tx.kode_part);
        return {
          id: tx.id,
          jenis: 'Keluar',
          tanggal: tx.tanggal_keluar,
          kode_part: tx.kode_part,
          nama_part: tx.nama_part,
          kategori: part?.kategori || '-',
          jumlah: tx.jumlah,
          tujuan_departemen: tx.tujuan_departemen,
          no_permintaan: tx.no_permintaan,
          keterangan: tx.keterangan,
        };
      });
      data = [...data, ...keluarMapped];
    }

    // Sort descending by date
    data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // Apply other filters
    if (filters.dateStart) {
      data = data.filter(d => d.tanggal >= filters.dateStart);
    }
    if (filters.dateEnd) {
      data = data.filter(d => d.tanggal <= filters.dateEnd);
    }
    if (filters.kategori) {
      data = data.filter(d => d.kategori === filters.kategori);
    }

    return data;
  }, [transaksiMasuk, transaksiKeluar, spareParts, filters]);

  // Summary Totals
  const totalMasuk = combinedData.filter(d => d.jenis === 'Masuk').reduce((sum, d) => sum + d.jumlah, 0);
  const totalKeluar = combinedData.filter(d => d.jenis === 'Keluar').reduce((sum, d) => sum + d.jumlah, 0);
  const netMovement = totalMasuk - totalKeluar;

  const handleExport = () => {
    // Format data specifically for CSV export
    const exportData = combinedData.map(d => ({
      'Tanggal': d.tanggal,
      'Jenis': d.jenis,
      'Kode Part': d.kode_part,
      'Nama Part': d.nama_part,
      'Kategori': d.kategori,
      'Jumlah': d.jenis === 'Masuk' ? d.jumlah : -d.jumlah,
      'Referensi/Tujuan': d.jenis === 'Masuk' ? d.supplier : d.tujuan_departemen,
      'No Dokumen': d.jenis === 'Masuk' ? d.no_po_invoice : d.no_permintaan,
      'Keterangan': d.keterangan,
    }));
    exportToCSV(exportData, 'Laporan_SPWMS');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-emerald-50 border-emerald-100">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Total Barang Masuk</p>
          <p className="text-3xl font-bold text-emerald-700">+{totalMasuk}</p>
        </div>
        <div className="card bg-orange-50 border-orange-100">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Total Barang Keluar</p>
          <p className="text-3xl font-bold text-orange-700">-{totalKeluar}</p>
        </div>
        <div className="card bg-blue-50 border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Net Movement (Selisih)</p>
          <p className="text-3xl font-bold text-blue-700">{netMovement > 0 ? '+' : ''}{netMovement}</p>
        </div>
      </div>

      <ReportFilterBar 
        filters={filters} 
        setFilters={setFilters} 
        onExport={handleExport} 
      />
      
      <ReportTable data={combinedData} />
    </div>
  );
}
