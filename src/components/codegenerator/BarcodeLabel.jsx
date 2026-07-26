import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

/**
 * BarcodeLabel — single printable Barcode label (Code128)
 */
export default function BarcodeLabel({ item, size = 'md', showBorder = true }) {
  const svgRef = useRef(null);

  const sizes = {
    sm: { width: 150, height: 48, titleSize: 10, subSize: 8,  metaSize: 7  },
    md: { width: 190, height: 60, titleSize: 11, subSize: 9,  metaSize: 8  },
    lg: { width: 240, height: 72, titleSize: 13, subSize: 10, metaSize: 9  },
  };
  const s = sizes[size] || sizes.md;

  const barcodeValue = item.type === 'custom'
    ? (item.customText || 'CUSTOM')
    : item.type === 'location'
    ? (item.lokasi_rak || 'LOC-000')
    : (item.kode_part || 'SP-000');

  // jsbarcode needs a value that's valid for Code128 — ASCII only
  const safeValue = barcodeValue.replace(/[^\x20-\x7E]/g, '');

  useEffect(() => {
    if (svgRef.current && safeValue) {
      try {
        JsBarcode(svgRef.current, safeValue, {
          format: 'CODE128',
          width: 1.8,
          height: s.height,
          displayValue: false,
          margin: 0,
          background: '#ffffff',
          lineColor: '#1e293b',
        });
      } catch (e) {
        console.warn('Barcode generation error:', e);
      }
    }
  }, [safeValue, s.height]);

  const labelTitle    = item.type === 'custom' ? (item.customText || 'Custom') : item.type === 'location' ? item.lokasi_rak : item.kode_part;
  const labelSubtitle = item.type === 'part' ? item.nama_part   : '';
  const labelMeta     = item.type === 'part' ? item.lokasi_rak  : '';

  return (
    <div
      className={`flex flex-col items-center bg-white ${showBorder ? 'border-2 border-dashed border-slate-300' : 'border border-slate-200'} rounded-lg p-2 gap-1 print-label`}
      style={{ width: s.width, minHeight: Math.round(s.width * 1.4) }}
    >
      {/* Barcode SVG */}
      <svg ref={svgRef} className="w-full" />

      {/* Code display */}
      <div className="font-black text-slate-800 tracking-widest text-center leading-tight"
           style={{ fontSize: s.titleSize }}>
        {labelTitle}
      </div>

      {labelSubtitle && (
        <div className="font-semibold text-slate-600 text-center leading-tight px-1 line-clamp-2"
             style={{ fontSize: s.subSize }}>
          {labelSubtitle}
        </div>
      )}

      {labelMeta && (
        <div className="font-medium text-slate-400 text-center"
             style={{ fontSize: s.metaSize }}>
          {labelMeta}
        </div>
      )}

      {item.type === 'part' && item.kategori && (
        <div className="bg-blue-50 text-blue-700 font-bold rounded-full px-2 mt-0.5"
             style={{ fontSize: s.metaSize - 1 }}>
          {item.kategori}
        </div>
      )}
    </div>
  );
}
