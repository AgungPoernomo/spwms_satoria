import { useState, useMemo, useRef } from 'react';
import {
  QrCode, Barcode, Tag, MapPin, PenLine,
  Printer, Settings2, CheckSquare, Square,
  ChevronDown, RefreshCw, LayoutGrid, Info,
} from 'lucide-react';
import { SPARE_PARTS } from '../data/mockData';
import QRCodeLabel from '../components/codegenerator/QRCodeLabel';
import BarcodeLabel from '../components/codegenerator/BarcodeLabel';
import PrintSheet from '../components/codegenerator/PrintSheet';

// ── Static location list (derived from spare parts) ──────────────────────────
const RACK_LOCATIONS = [...new Set(SPARE_PARTS.map(p => p.lokasi_rak))].sort();

const MODES = [
  { id: 'part',     label: 'Part Label',   icon: Tag,      desc: 'Label untuk setiap spare part di gudang' },
  { id: 'location', label: 'Lokasi Rak',   icon: MapPin,   desc: 'Penanda posisi fisik rak penyimpanan' },
  { id: 'custom',   label: 'Custom Code',  icon: PenLine,  desc: 'Input teks bebas untuk label khusus' },
];

const LABEL_SIZES = [
  { id: 'sm', label: 'Kecil',  desc: '3 × 5 cm' },
  { id: 'md', label: 'Sedang', desc: '5 × 7.5 cm' },
  { id: 'lg', label: 'Besar',  desc: '7 × 10 cm' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildItem(mode, part, location, customText) {
  if (mode === 'part') return { ...part, type: 'part' };
  if (mode === 'location') return { lokasi_rak: location, kode_part: location, type: 'location' };
  return { customText, type: 'custom', id: Date.now() };
}

// ── Sub-component: Mode Selector ──────────────────────────────────────────────
function ModeSelector({ mode, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {MODES.map(m => {
        const Icon = m.icon;
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150
              ${active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <div className={`p-1.5 rounded-lg ${active ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Icon size={14} />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold ${active ? 'text-blue-700' : 'text-slate-700'}`}>{m.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{m.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Sub-component: Part Checklist ─────────────────────────────────────────────
function PartChecklist({ selected, onToggle, onToggleAll }) {
  const allSelected = selected.size === SPARE_PARTS.length;
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => onToggleAll(!allSelected)}
        className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 hover:text-blue-800 mb-1 self-start"
      >
        {allSelected ? <CheckSquare size={13} /> : <Square size={13} />}
        {allSelected ? 'Batalkan Semua' : 'Pilih Semua'}
      </button>
      <div className="max-h-52 overflow-y-auto flex flex-col gap-1 pr-1">
        {SPARE_PARTS.map(part => {
          const checked = selected.has(part.id);
          return (
            <label key={part.id}
              className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all
                ${checked ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white hover:bg-slate-50'}`}
            >
              <input type="checkbox" checked={checked} onChange={() => onToggle(part.id)}
                className="accent-blue-500 w-3.5 h-3.5" />
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-bold truncate ${checked ? 'text-blue-700' : 'text-slate-700'}`}>
                  {part.kode_part}
                </p>
                <p className="text-[9px] text-slate-400 truncate">{part.nama_part}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GeneratorCodePage() {
  const [mode, setMode]           = useState('part');
  const [codeType, setCodeType]   = useState('qr');      // 'qr' | 'barcode'
  const [labelSize, setLabelSize] = useState('md');
  const [selectedParts, setSelectedParts] = useState(new Set([SPARE_PARTS[0].id]));
  const [selectedLocation, setSelectedLocation] = useState(RACK_LOCATIONS[0]);
  const [customText, setCustomText] = useState('');
  const [copies, setCopies]       = useState(1);
  const [previewGenerated, setPreviewGenerated] = useState(true);

  const LabelComp = codeType === 'qr' ? QRCodeLabel : BarcodeLabel;

  // Build the items to render/print
  const labelItems = useMemo(() => {
    let base = [];
    if (mode === 'part') {
      base = SPARE_PARTS.filter(p => selectedParts.has(p.id))
        .map(p => ({ ...p, type: 'part' }));
    } else if (mode === 'location') {
      base = [{ lokasi_rak: selectedLocation, kode_part: selectedLocation, type: 'location', id: selectedLocation }];
    } else {
      base = [{ customText, type: 'custom', id: 'custom-0' }];
    }
    // Repeat based on copies
    const repeated = [];
    base.forEach(item => {
      for (let i = 0; i < copies; i++) {
        repeated.push({ ...item, _copyIdx: i });
      }
    });
    return repeated;
  }, [mode, selectedParts, selectedLocation, customText, copies]);

  const togglePart = (id) => {
    setSelectedParts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = (val) => {
    setSelectedParts(val ? new Set(SPARE_PARTS.map(p => p.id)) : new Set());
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full pb-10">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl shadow-md">
            <QrCode size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">Generator Code</h1>
            <p className="text-xs text-slate-500">Buat dan cetak barcode & QR code untuk label spare part</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ── LEFT: Config Panel ─────────────────────────────────── */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">

          {/* Mode */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Settings2 size={13} /> Mode Generator
            </h3>
            <ModeSelector mode={mode} onChange={(m) => { setMode(m); }} />
          </div>

          {/* Code Type & Size */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <LayoutGrid size={13} /> Format & Ukuran
            </h3>

            {/* Code Type Toggle */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-4">
              {[
                { id: 'qr',      label: 'QR Code',  icon: QrCode  },
                { id: 'barcode', label: 'Barcode',   icon: Barcode },
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setCodeType(t.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold transition-all
                      ${codeType === t.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Icon size={13} /> {t.label}
                  </button>
                );
              })}
            </div>

            {/* Label Size */}
            <p className="text-[10px] font-semibold text-slate-500 mb-2">Ukuran Label</p>
            <div className="flex gap-2">
              {LABEL_SIZES.map(sz => (
                <button
                  key={sz.id}
                  onClick={() => setLabelSize(sz.id)}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl border-2 text-center transition-all
                    ${labelSize === sz.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <p className={`text-xs font-bold ${labelSize === sz.id ? 'text-blue-700' : 'text-slate-600'}`}>{sz.label}</p>
                  <p className="text-[9px] text-slate-400">{sz.desc}</p>
                </button>
              ))}
            </div>

            {/* Copies */}
            <div className="mt-4">
              <p className="text-[10px] font-semibold text-slate-500 mb-2">Jumlah Salinan per Item</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCopies(c => Math.max(1, c - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center">−</button>
                <span className="w-8 text-center font-bold text-slate-700 text-sm">{copies}</span>
                <button onClick={() => setCopies(c => Math.min(10, c + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center">+</button>
              </div>
            </div>
          </div>

          {/* Source selection (changes by mode) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Tag size={13} /> {mode === 'part' ? 'Pilih Spare Part' : mode === 'location' ? 'Pilih Lokasi Rak' : 'Input Teks'}
            </h3>

            {mode === 'part' && (
              <PartChecklist selected={selectedParts} onToggle={togglePart} onToggleAll={toggleAll} />
            )}

            {mode === 'location' && (
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {RACK_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
              </div>
            )}

            {mode === 'custom' && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="Contoh: PO-2026-001, ASSET-004..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  maxLength={60}
                />
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Info size={10} /> Teks ini akan di-encode ke dalam {codeType === 'qr' ? 'QR Code' : 'Barcode'}.
                </p>
              </div>
            )}
          </div>

          {/* Summary badge */}
          <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-blue-100 p-3 flex items-center gap-3">
            <div className="text-2xl font-black text-blue-600">{labelItems.length}</div>
            <div>
              <p className="text-xs font-bold text-slate-700">Label akan dicetak</p>
              <p className="text-[10px] text-slate-500">{Math.ceil(labelItems.length / 6)} halaman A4 (maks. 6 label/hal.)</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Preview Panel ───────────────────────────────── */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-4">
          {/* Action bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Preview Label</h3>
              <p className="text-[10px] text-slate-400">Tampilan akan sama persis saat dicetak</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                disabled={labelItems.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Printer size={14} /> Cetak Label
              </button>
            </div>
          </div>

          {/* Preview grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 min-h-[420px]">
            {labelItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <QrCode size={40} className="text-slate-200 mb-3" />
                <p className="text-sm font-semibold text-slate-400">Belum ada label yang dipilih</p>
                <p className="text-xs text-slate-300 mt-1">Pilih spare part atau masukkan teks di panel kiri</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {labelItems.slice(0, 12).map((item, idx) => (
                  <div key={idx} className="flex justify-center">
                    <LabelComp item={item} size={labelSize} showBorder={true} />
                  </div>
                ))}
              </div>
            )}
            {labelItems.length > 12 && (
              <p className="text-center text-xs text-slate-400 mt-4">
                + {labelItems.length - 12} label lagi — akan muncul semua saat dicetak
              </p>
            )}
          </div>

          {/* Info card */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-700 mb-0.5">Tips Cetak</p>
              <p className="text-[11px] text-amber-600 leading-relaxed">
                Saat dialog print terbuka, pilih <strong>Paper Size: A4</strong>, <strong>Margins: None/Minimum</strong>, dan pastikan <strong>"Background graphics"</strong> diaktifkan untuk warna label yang optimal.
                Gunakan kertas sticker ukuran A4 untuk hasil terbaik.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hidden Print Area ───────────────────────────────────────────────── */}
      <div className="hidden print:block">
        <PrintSheet items={labelItems} codeType={codeType} labelSize={labelSize} />
      </div>
    </div>
  );
}
