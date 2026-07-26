import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, Search, X, QrCode } from 'lucide-react';

export default function ScanInput({ onScan, onSearch }) {
  const [isScanning, setIsScanning] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isScanning) {
      scannerRef.current = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Attempt to parse JSON if it's our rich QR code
          try {
            const data = JSON.parse(decodedText);
            if (data.kode_part || data.serial_number) {
              const code = data.serial_number || data.kode_part;
              setInputValue(code);
              onScan(code);
            }
          } catch (e) {
            // Not JSON, assume it's just a string code (like barcode)
            setInputValue(decodedText);
            onScan(decodedText);
          }
          stopScanner();
        },
        (error) => {
          // ignore scan errors
        }
      );
    } else if (scannerRef.current) {
      stopScanner();
    }

    return () => stopScanner();
  }, [isScanning]);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative flex items-center shadow-sm">
        <Search className="absolute left-4 text-slate-400" size={18} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Cari Kode Part (SP-001) atau Serial Number (AK-2026-001)..."
          className="w-full pl-11 pr-32 py-4 rounded-2xl border-2 border-slate-200 bg-white text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
        />
        <div className="absolute right-2 flex items-center gap-2">
          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(''); onSearch(''); }}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsScanning(!isScanning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isScanning 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isScanning ? <X size={14} /> : <Camera size={14} />}
            {isScanning ? 'Tutup Scanner' : 'Scan'}
          </button>
        </div>
      </form>

      {/* Scanner Container */}
      <div className={`mt-4 overflow-hidden transition-all duration-300 rounded-2xl border-2 ${isScanning ? 'h-[400px] border-blue-500 opacity-100' : 'h-0 border-transparent opacity-0'}`}>
        <div id="reader" className="w-full h-full bg-slate-900 rounded-xl overflow-hidden [&_video]:object-cover" />
      </div>
    </div>
  );
}
