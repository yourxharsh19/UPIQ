import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { getCategoryDisplayProps } from "../../utils/categoryUtils";

const RecentActivity = ({ transactions }) => {
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Recent Activity</h3>
        <p className="text-sm text-gray-500">Your latest transactions</p>
      </div>
      
      <div className="space-y-3">
        {recentTransactions.map((transaction) => {
          const isIncome = transaction.type?.toLowerCase() === 'income';
          const category = transaction.category || 'Uncategorized';
          
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-2 rounded-lg ${
                  isIncome ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isIncome ? (
                    <ArrowUpCircle size={20} className="text-green-600" />
                  ) : (
                    <ArrowDownCircle size={20} className="text-red-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {transaction.description || 'Transaction'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const categoryDisplay = getCategoryDisplayProps({ name: category });
                      return (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryDisplay.colorClasses.bg} ${categoryDisplay.colorClasses.text} flex items-center gap-1`}>
                          <span>{categoryDisplay.icon}</span>
                          {category}
                        </span>
                      );
                    })()}
                    <span className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <p className={`text-lg font-bold ${
                  isIncome ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;

