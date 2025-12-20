import { createContext, useContext, useState, useMemo } from 'react';

const DateFilterContext = createContext(null);

export const DateFilterProvider = ({ children }) => {
  // Default to current month
  const getDefaultStartDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const getDefaultEndDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  const setDateRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const resetToCurrentMonth = () => {
    setStartDate(getDefaultStartDate());
    setEndDate(getDefaultEndDate());
  };

  const resetToLastMonth = () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    setStartDate(lastMonth);
    setEndDate(lastMonthEnd);
  };

  const resetToLast30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setStartDate(start);
    setEndDate(end);
  };

  const resetToLast90Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);
    setStartDate(start);
    setEndDate(end);
  };

  const resetToThisYear = () => {
    const now = new Date();
    setStartDate(new Date(now.getFullYear(), 0, 1));
    setEndDate(new Date(now.getFullYear(), 11, 31, 23, 59, 59));
  };

  const resetToAllTime = () => {
    setStartDate(new Date(2000, 0, 1));
    setEndDate(new Date(2100, 11, 31, 23, 59, 59));
  };

  const value = useMemo(() => ({
    startDate,
    endDate,
    setDateRange,
    resetToCurrentMonth,
    resetToLastMonth,
    resetToLast30Days,
    resetToLast90Days,
    resetToThisYear,
    resetToAllTime
  }), [startDate, endDate]);

  return (
    <DateFilterContext.Provider value={value}>
      {children}
    </DateFilterContext.Provider>
  );
};

export const useDateFilter = () => {
  const context = useContext(DateFilterContext);
  if (!context) {
    throw new Error('useDateFilter must be used within DateFilterProvider');
  }
  return context;
};

