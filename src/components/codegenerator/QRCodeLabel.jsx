import { QRCodeSVG } from 'qrcode.react';

/**
 * QRCodeLabel — single printable QR code label
 * Encodes full spare part data + a URL reference
 */
export default function QRCodeLabel({ item, size = 'md', showBorder = true }) {
  const sizes = {
    sm: { qr: 72,  width: 150, titleSize: 10, subSize: 8,  metaSize: 7  },
    md: { qr: 96,  width: 190, titleSize: 11, subSize: 9,  metaSize: 8  },
    lg: { qr: 120, width: 240, titleSize: 13, subSize: 10, metaSize: 9  },
  };
  const s = sizes[size] || sizes.md;

  let qrValue;
  if (item.type === 'custom') {
    qrValue = item.customText || 'CUSTOM';
  } else if (item.type === 'location') {
    qrValue = JSON.stringify({
      lokasi: item.lokasi_rak,
      kode: item.kode_part || '',
      url: `spwms://location/${encodeURIComponent(item.lokasi_rak)}`,
    });
  } else {
    qrValue = JSON.stringify({
      kode_part: item.kode_part,
      nama_part: item.nama_part,
      kategori: item.kategori,
      lokasi_rak: item.lokasi_rak,
      stok_minimum: item.stok_minimum,
      merk_type: item.merk_type,
      url: `spwms://spare-parts/${item.kode_part}`,
    });
  }

  const labelTitle = item.type === 'custom'
    ? (item.customText || 'Custom Label')
    : item.type === 'location'
    ? item.lokasi_rak
    : item.kode_part;

  const labelSubtitle = item.type === 'part' ? item.nama_part : '';
  const labelMeta    = item.type === 'part' ? item.lokasi_rak  : '';

  return (
    <div
      className={`flex flex-col items-center bg-white ${showBorder ? 'border-2 border-dashed border-slate-300' : 'border border-slate-200'} rounded-lg p-2 gap-1 print-label`}
      style={{ width: s.width, minHeight: Math.round(s.width * 1.4) }}
    >
      <QRCodeSVG
        value={qrValue}
        size={s.qr}
        bgColor="#ffffff"
        fgColor="#1e293b"
        level="M"
        includeMargin={false}
      />

      <div className="font-black text-slate-800 tracking-widest text-center leading-tight mt-1"
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
