import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getCategoryExpenseBreakdown } from '../../utils/transactionUtils';
import { getCategoryColor } from '../../utils/categoryUtils';

const CategoryBreakdown = ({ transactions }) => {
  const breakdown = getCategoryExpenseBreakdown(transactions);

  if (breakdown.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm h-96 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No expense data available</p>
          <p className="text-sm text-gray-400 mt-1">Upload a PDF to see category breakdown</p>
        </div>
      </div>
    );
  }

  const data = breakdown.map((item) => {
    const colorInfo = getCategoryColor(item.name);
    return {
      name: item.name,
      value: item.amount,
      color: colorInfo.value
    };
  });

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-base)] shadow-premium-hover backdrop-blur-md bg-opacity-90">
          <p className="font-bold text-[var(--text-main)] text-sm">{data.name}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            ₹{data.value.toLocaleString('en-IN')} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-base)] shadow-premium hover:shadow-premium-hover transition-all duration-300">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-1 tracking-tight">Category Breakdown</h3>
        <p className="text-sm text-[var(--text-muted)]">Expense distribution by category</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-5">
          {breakdown.slice(0, 5).map((item, index) => {
            const percentage = ((item.amount / total) * 100).toFixed(1);
            const colorInfo = getCategoryColor(item.name);
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: colorInfo.value }}
                    />
                    <span className="text-sm font-medium text-[var(--text-main)]">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[var(--text-main)]">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] ml-2 uppercase tracking-wider">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-[var(--bg-surface)] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: colorInfo.value
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;

