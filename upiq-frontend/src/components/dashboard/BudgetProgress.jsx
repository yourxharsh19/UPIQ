import { Target, AlertCircle, CheckCircle2 } from "lucide-react";
import { useBudget } from "../../context/BudgetContext";
import { getCategoryExpenseBreakdown } from "../../utils/transactionUtils";
import { getCategoryDisplayProps } from "../../utils/categoryUtils";

const BudgetProgress = ({ transactions }) => {
  const { getAllBudgets } = useBudget();
  const budgets = getAllBudgets();
  const categoryExpenses = getCategoryExpenseBreakdown(transactions);

  // Create a map of category expenses (case-insensitive)
  const expenseMap = categoryExpenses.reduce((acc, item) => {
    const normalizedName = item.name.toLowerCase();
    acc[normalizedName] = item.amount;
    return acc;
  }, {});

  // Get categories with budgets
  const budgetedCategories = Object.keys(budgets).filter(cat => budgets[cat] > 0);

  if (budgetedCategories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Budget Tracking</h3>
          <p className="text-sm text-gray-500">Set budgets for categories to track your spending</p>
        </div>
        <div className="text-center py-8">
          <Target size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No budgets set yet</p>
          <p className="text-sm text-gray-400">Go to Categories to set monthly budgets</p>
        </div>
      </div>
    );
  }

  const getBudgetStatus = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage < 80) {
      return { color: 'green', icon: CheckCircle2, label: 'On Track' };
    } else if (percentage < 100) {
      return { color: 'yellow', icon: AlertCircle, label: 'Warning' };
    } else {
      return { color: 'red', icon: AlertCircle, label: 'Over Budget' };
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Budget Tracking</h3>
        <p className="text-sm text-gray-500">Monitor your spending against monthly budgets</p>
      </div>

      <div className="space-y-4">
        {budgetedCategories.map((categoryName) => {
          const budget = budgets[categoryName];
          // Use case-insensitive lookup for spent amount
          const spent = expenseMap[categoryName.toLowerCase()] || 0;
          const percentage = Math.min((spent / budget) * 100, 100);
          const status = getBudgetStatus(spent, budget);
          const displayProps = getCategoryDisplayProps({ name: categoryName });
          const StatusIcon = status.icon;

          return (
            <div key={categoryName} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{displayProps.icon}</span>
                  <span className="font-medium text-gray-900">{categoryName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${status.color === 'green' ? 'text-green-600' :
                      status.color === 'yellow' ? 'text-yellow-600' :
                        'text-red-600'
                    }`}>
                    ₹{spent.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color === 'green' ? 'bg-green-100 text-green-700' :
                      status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    <StatusIcon size={12} />
                    {status.label}
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${status.color === 'green' ? 'bg-green-500' :
                      status.color === 'yellow' ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{percentage.toFixed(1)}% used</span>
                {spent > budget && (
                  <span className="text-red-600 font-medium">
                    Over by ₹{(spent - budget).toLocaleString('en-IN')}
                  </span>
                )}
                {spent <= budget && (
                  <span className="text-green-600 font-medium">
                    ₹{(budget - spent).toLocaleString('en-IN')} remaining
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;

