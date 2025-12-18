import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { calculateTotalIncome, calculateTotalExpenses } from '../../utils/transactionUtils';

const IncomeExpenseComparison = ({ transactions }) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);

  const data = [
    {
      name: 'Income',
      amount: income,
      type: 'income'
    },
    {
      name: 'Expenses',
      amount: expenses,
      type: 'expense'
    }
  ];

  if (income === 0 && expenses === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm h-80 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No financial data available</p>
          <p className="text-sm text-gray-400 mt-1">Start tracking your income and expenses</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.payload.name}</p>
          <p className="text-sm text-gray-600">
            ₹{data.value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Income vs Expenses</h3>
        <p className="text-sm text-gray-500">Compare your total income and expenses</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.type === 'income' ? '#10b981' : '#ef4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 font-medium mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-900">₹{income.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-700 font-medium mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-900">₹{expenses.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseComparison;

