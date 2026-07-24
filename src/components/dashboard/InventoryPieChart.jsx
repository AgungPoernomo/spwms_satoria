import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useSparePartStore from '../../store/useSparePartStore';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#64748b'];

export default function InventoryPieChart() {
  const spareParts = useSparePartStore(s => s.spareParts);

  // Hitung jumlah part berdasarkan kategori
  const dataMap = spareParts.reduce((acc, part) => {
    acc[part.kategori] = (acc[part.kategori] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(dataMap).map(kategori => ({
    name: kategori,
    value: dataMap[kategori]
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 w-full h-full flex flex-col">
      <h3 className="font-bold text-slate-800 text-sm mb-4">Komposisi Inventori (Kategori)</h3>
      <div className="w-full flex-1 min-h-[350px] relative">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
