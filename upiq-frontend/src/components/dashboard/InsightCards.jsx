import { AlertCircle, TrendingUp, Target, PieChart } from "lucide-react";
import {
  getTopSpendingCategory,
  calculateSpendingConcentration,
  getCategoryMonthOverMonth,
  getOverspendingCategories,
  getIncomeExpenseRatio
} from "../../utils/transactionUtils";

const InsightCards = ({ transactions }) => {
  const topCategory = getTopSpendingCategory(transactions);
  const concentration = calculateSpendingConcentration(transactions);
  const overspendingCategories = getOverspendingCategories(transactions);
  const incomeExpenseRatio = getIncomeExpenseRatio(transactions);

  const insights = [];

  // Top spending category insight
  if (topCategory) {
    const categoryMom = getCategoryMonthOverMonth(transactions, topCategory.name);
    insights.push({
      type: "spending",
      icon: PieChart,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      title: `${topCategory.name} is your highest expense`,
      description: categoryMom.direction === 'up'
        ? `Spending ↑ ${categoryMom.change.toFixed(1)}% vs last month`
        : categoryMom.direction === 'down'
        ? `Spending ↓ ${categoryMom.change.toFixed(1)}% vs last month`
        : "Spending unchanged vs last month",
      value: `₹${topCategory.amount.toLocaleString('en-IN')}`,
      severity: "info"
    });
  }

  // Spending concentration insight
  if (concentration > 40) {
    insights.push({
      type: "concentration",
      icon: Target,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      title: "High spending concentration",
      description: `${concentration.toFixed(1)}% of expenses in one category`,
      value: topCategory?.name || "N/A",
      severity: "warning"
    });
  }

  // Overspending insight
  if (overspendingCategories.length > 0) {
    insights.push({
      type: "overspending",
      icon: AlertCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      title: `Overspending in ${overspendingCategories.length} categor${overspendingCategories.length > 1 ? 'ies' : 'y'}`,
      description: overspendingCategories.map(c => c.name).join(", "),
      value: `${overspendingCategories.length}`,
      severity: "error"
    });
  }

  // Income/Expense ratio insight
  if (incomeExpenseRatio > 0 && incomeExpenseRatio < 1.2) {
    insights.push({
      type: "ratio",
      icon: TrendingUp,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      title: "Expenses are high relative to income",
      description: `Income/Expense ratio: ${incomeExpenseRatio.toFixed(2)}`,
      value: `${(incomeExpenseRatio * 100).toFixed(0)}%`,
      severity: "warning"
    });
  }

  // If no insights, show a positive one
  if (insights.length === 0 && transactions.length > 0) {
    insights.push({
      type: "positive",
      icon: TrendingUp,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      title: "Your finances look balanced",
      description: "Keep tracking your expenses to maintain good financial health",
      value: "✓",
      severity: "success"
    });
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Target size={20} className="text-primary-600" />
        Financial Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`${insight.bgColor} rounded-xl p-5 border-2 ${
                insight.severity === 'error' ? 'border-red-200' :
                insight.severity === 'warning' ? 'border-orange-200' :
                insight.severity === 'success' ? 'border-green-200' :
                'border-purple-200'
              } hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-white ${insight.iconColor}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  {insight.value && (
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-900">
                        {insight.value}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightCards;

