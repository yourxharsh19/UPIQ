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
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            ₹{data.value.toLocaleString('en-IN')} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Category Breakdown</h3>
        <p className="text-sm text-gray-500">Expense distribution by category</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 mb-4">Top Categories</h4>
          {breakdown.slice(0, 5).map((item, index) => {
            const percentage = ((item.amount / total) * 100).toFixed(1);
            const colorInfo = getCategoryColor(item.name);
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colorInfo.value }}
                    />
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
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

