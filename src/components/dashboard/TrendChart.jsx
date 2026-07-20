import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { generateTrendData } from '../../data/mockData';

const RANGE_OPTIONS = [
  { label: '7 Hari', value: 7 },
  { label: '30 Hari', value: 30 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-slate-500 capitalize">{p.name}:</span>
            <span className="font-semibold text-slate-700">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrendChart() {
  const [range, setRange] = useState(7);
  const allData = useMemo(() => generateTrendData(), []);
  const data = allData.slice(-range);

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-800">Tren Pergerakan Barang</h3>
          <p className="text-xs text-slate-400 mt-0.5">Masuk vs Keluar</p>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              id={`trend-range-${opt.value}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                range === opt.value
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
            interval={range === 30 ? 4 : 0}
          />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{value === 'masuk' ? 'Masuk' : 'Keluar'}</span>}
          />
          <Area type="monotone" dataKey="masuk" name="masuk" stroke="#4F46E5" strokeWidth={2.5} fill="url(#colorMasuk)" dot={false} activeDot={{ r: 5, fill: '#4F46E5' }} />
          <Area type="monotone" dataKey="keluar" name="keluar" stroke="#F59E0B" strokeWidth={2.5} fill="url(#colorKeluar)" dot={false} activeDot={{ r: 5, fill: '#F59E0B' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
