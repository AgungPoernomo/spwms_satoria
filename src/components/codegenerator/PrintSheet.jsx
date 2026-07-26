import QRCodeLabel from './QRCodeLabel';
import BarcodeLabel from './BarcodeLabel';

/**
 * PrintSheet — A4-optimized grid of labels for printing
 * Medium size: 2 columns × 3 rows = 6 labels per page
 */
export default function PrintSheet({ items, codeType, labelSize }) {
  const LabelComponent = codeType === 'qr' ? QRCodeLabel : BarcodeLabel;

  return (
    <div id="print-sheet" className="print-sheet bg-white">
      {/* Print header — hidden on screen, visible on print */}
      <div className="hidden print:block print-header mb-4">
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <div>
            <p className="text-xs font-bold text-slate-800">SISTEM MANAGEMENT WAREHOUSE SPARE PARTS</p>
            <p className="text-[9px] text-slate-500">Label dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
          </div>
          <p className="text-[9px] text-slate-400">Total: {items.length} label</p>
        </div>
      </div>

      {/* Label grid */}
      <div className="print-grid grid grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={`${item.id || item.kode_part || 'custom'}-${idx}`} className="print-cell">
            <LabelComponent item={item} size={labelSize} showBorder={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
