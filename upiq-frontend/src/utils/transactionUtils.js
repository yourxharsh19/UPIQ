/**
 * Utility functions for transaction calculations and insights
 * All calculations are done on the frontend using existing transaction data
 */

/**
 * Filter transactions by date range
 */
export const filterByDateRange = (transactions, startDate, endDate) => {
  if (!startDate || !endDate) return transactions;
  
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

/**
 * Get transactions for a specific month
 */
export const getTransactionsForMonth = (transactions, year, month) => {
  return transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};

/**
 * Calculate total income
 */
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type && t.type.toLowerCase() === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
};

/**
 * Calculate total expenses
 */
export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter(t => t.type && t.type.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
};

/**
 * Calculate balance
 */
export const calculateBalance = (transactions) => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

/**
 * Calculate savings rate percentage
 */
export const calculateSavingsRate = (transactions) => {
  const income = calculateTotalIncome(transactions);
  if (income === 0) return 0;
  const expenses = calculateTotalExpenses(transactions);
  return ((income - expenses) / income) * 100;
};

/**
 * Get category-wise expense breakdown
 */
export const getCategoryExpenseBreakdown = (transactions) => {
  const expenses = transactions.filter(t => t.type && t.type.toLowerCase() === 'expense');
  
  const breakdown = expenses.reduce((acc, t) => {
    const category = t.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + (t.amount || 0);
    return acc;
  }, {});

  return Object.entries(breakdown)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
};

/**
 * Get top spending category
 */
export const getTopSpendingCategory = (transactions) => {
  const breakdown = getCategoryExpenseBreakdown(transactions);
  return breakdown.length > 0 ? breakdown[0] : null;
};

/**
 * Calculate spending concentration (percentage in top category)
 */
export const calculateSpendingConcentration = (transactions) => {
  const totalExpenses = calculateTotalExpenses(transactions);
  if (totalExpenses === 0) return 0;
  
  const topCategory = getTopSpendingCategory(transactions);
  if (!topCategory) return 0;
  
  return (topCategory.amount / totalExpenses) * 100;
};

/**
 * Compare current month vs previous month
 */
export const compareMonthOverMonth = (transactions) => {
  const now = new Date();
  const currentMonth = getTransactionsForMonth(transactions, now.getFullYear(), now.getMonth());
  const previousMonth = getTransactionsForMonth(
    transactions,
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
    now.getMonth() === 0 ? 11 : now.getMonth() - 1
  );

  const currentExpenses = calculateTotalExpenses(currentMonth);
  const previousExpenses = calculateTotalExpenses(previousMonth);

  if (previousExpenses === 0) {
    return currentExpenses > 0 ? { change: 100, direction: 'up' } : { change: 0, direction: 'neutral' };
  }

  const change = ((currentExpenses - previousExpenses) / previousExpenses) * 100;
  return {
    change: Math.abs(change),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  };
};

/**
 * Get category-wise month-over-month comparison
 */
export const getCategoryMonthOverMonth = (transactions, categoryName) => {
  const now = new Date();
  const currentMonth = getTransactionsForMonth(transactions, now.getFullYear(), now.getMonth());
  const previousMonth = getTransactionsForMonth(
    transactions,
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
    now.getMonth() === 0 ? 11 : now.getMonth() - 1
  );

  const currentAmount = currentMonth
    .filter(t => (t.category || 'Uncategorized') === categoryName && t.type?.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const previousAmount = previousMonth
    .filter(t => (t.category || 'Uncategorized') === categoryName && t.type?.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  if (previousAmount === 0) {
    return currentAmount > 0 ? { change: 100, direction: 'up' } : { change: 0, direction: 'neutral' };
  }

  const change = ((currentAmount - previousAmount) / previousAmount) * 100;
  return {
    change: Math.abs(change),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    currentAmount,
    previousAmount
  };
};

/**
 * Get income vs expense ratio
 */
export const getIncomeExpenseRatio = (transactions) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  
  if (expenses === 0) return income > 0 ? Infinity : 0;
  return income / expenses;
};

/**
 * Get overspending categories (categories exceeding 80% of total expenses)
 */
export const getOverspendingCategories = (transactions) => {
  const totalExpenses = calculateTotalExpenses(transactions);
  if (totalExpenses === 0) return [];
  
  const breakdown = getCategoryExpenseBreakdown(transactions);
  const threshold = totalExpenses * 0.3; // More than 30% of total expenses
  
  return breakdown.filter(cat => cat.amount > threshold);
};

