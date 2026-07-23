import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import useSparePartStore from '../store/useSparePartStore';
import SparePartFilter from '../components/spareparts/SparePartFilter';
import SparePartTable from '../components/spareparts/SparePartTable';
import SparePartFormModal from '../components/spareparts/SparePartFormModal';
import SearchInput from '../components/common/SearchInput';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function SparePartsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { filters, setFilter, deletePart } = useSparePartStore();
  const filteredParts = useSparePartStore(s => s.getFilteredParts());


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (part) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  const handleDelete = (part) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${part.nama_part} (${part.kode_part})?`)) {
      deletePart(part.id);
    }
  };

  const openNewModal = () => {
    setEditingPart(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <SparePartFilter />
        <div className="flex items-center gap-3">
          <SearchInput
            value={filters.search}
            onChange={(val) => setFilter('search', val)}
            placeholder="Cari kode, nama..."
          />
          <button onClick={openNewModal} className="btn-primary whitespace-nowrap">
            <Plus size={18} />
            Tambah Part
          </button>
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <SkeletonLoader type="table" lines={10} />
        </div>
      ) : (
        <SparePartTable
          data={filteredParts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <SparePartFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          partToEdit={editingPart}
        />
      )}
    </div>
  );
}
