import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useSparePartStore from '../../store/useSparePartStore';

const COLORS = {
  Kritis: '#EF4444',
  Normal: '#10B981',
  Berlebih: '#F59E0B',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 text-sm flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[data.name] }} />
        <span className="font-semibold text-slate-700">{data.name}:</span>
        <span className="font-bold text-slate-800">{data.value} item</span>
      </div>
    );
  }
  return null;
};

export default function StatusDistributionChart() {
  const parts = useSparePartStore(s => s.spareParts);

  const data = [
    { name: 'Kritis', value: parts.filter(p => p.status === 'Kritis').length },
    { name: 'Normal', value: parts.filter(p => p.status === 'Normal').length },
    { name: 'Berlebih', value: parts.filter(p => p.status === 'Berlebih').length },
  ].filter(d => d.value > 0);

  const total = parts.length;

  return (
    <div className="card animate-slide-up">
      <h3 className="font-bold text-slate-800 mb-1">Distribusi Status Stok</h3>
      <p className="text-xs text-slate-400 mb-6">Persentase kesehatan inventaris</p>
      
      <div className="flex items-center">
        <div className="w-1/2 h-[160px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-800 leading-none">{total}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Total SKU</span>
          </div>
        </div>
        
        <div className="w-1/2 pl-4 flex flex-col gap-3">
          {data.map(item => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[item.name] }} />
                <span className="text-sm font-medium text-slate-600">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-800">{item.value}</span>
                <span className="text-xs text-slate-400 ml-1">({Math.round((item.value / total) * 100)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
