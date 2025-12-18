import { Wallet, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { calculateBalance, calculateTotalIncome, calculateTotalExpenses, calculateSavingsRate, compareMonthOverMonth } from "../../utils/transactionUtils";

const KPIStrip = ({ transactions }) => {
  const balance = calculateBalance(transactions);
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  const savingsRate = calculateSavingsRate(transactions);
  const momComparison = compareMonthOverMonth(transactions);

  const kpis = [
    {
      label: "Balance",
      value: `₹${balance.toLocaleString('en-IN')}`,
      icon: Wallet,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      trend: null
    },
    {
      label: "Income",
      value: `₹${income.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      trend: null
    },
    {
      label: "Expenses",
      value: `₹${expenses.toLocaleString('en-IN')}`,
      icon: TrendingDown,
      bgColor: "bg-gradient-to-br from-red-500 to-red-600",
      trend: momComparison
    },
    {
      label: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      icon: Percent,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      trend: savingsRate >= 20 ? { direction: 'up', change: savingsRate } : savingsRate >= 10 ? { direction: 'neutral', change: savingsRate } : { direction: 'down', change: savingsRate }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const trend = kpi.trend;
        
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className={`${kpi.bgColor} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white/90 text-xs font-medium uppercase tracking-wide">
                      {kpi.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {trend && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {trend.direction === 'up' && (
                    <>
                      <TrendingUp size={16} className="text-red-500" />
                      <span className="text-sm font-medium text-red-600">
                        ↑ {trend.change.toFixed(1)}% vs last month
                      </span>
                    </>
                  )}
                  {trend.direction === 'down' && (
                    <>
                      <TrendingDown size={16} className="text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        ↓ {trend.change.toFixed(1)}% vs last month
                      </span>
                    </>
                  )}
                  {trend.direction === 'neutral' && (
                    <span className="text-sm font-medium text-gray-600">
                      No change vs last month
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KPIStrip;

