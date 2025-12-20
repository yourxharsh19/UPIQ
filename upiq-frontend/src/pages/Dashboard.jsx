import { useEffect, useState, useMemo } from "react";
import TransactionService from "../services/transaction.service";
import { useDateFilter } from "../context/DateFilterContext";
import { filterByDateRange } from "../utils/transactionUtils";
import KPIStrip from "../components/dashboard/KPIStrip";
import InsightCards from "../components/dashboard/InsightCards";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import IncomeExpenseComparison from "../components/dashboard/IncomeExpenseComparison";
import RecentActivity from "../components/dashboard/RecentActivity";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import DateRangeFilter from "../components/dashboard/DateRangeFilter";
import EmptyState from "../components/ui/EmptyState";
import Card from "../components/ui/Card";
import SkeletonLoader from "../components/ui/SkeletonLoader";

const Dashboard = () => {
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { startDate, endDate } = useDateFilter();

    // Filter transactions by date range
    const transactions = useMemo(() => {
        return filterByDateRange(allTransactions, startDate, endDate);
    }, [allTransactions, startDate, endDate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await TransactionService.getAll();
                if (response.success) {
                    setAllTransactions(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch transactions", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="mb-8">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                </div>
                <SkeletonLoader type="kpi" count={4} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SkeletonLoader type="card" count={2} />
                </div>
                <SkeletonLoader type="card" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center min-h-[600px]">
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Show empty state if no transactions
    if (allTransactions.length === 0 && !loading) {
        return (
            <div className="space-y-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">Financial Dashboard</h1>
                    <p className="text-[var(--text-muted)]">Comprehensive overview of your income, expenses, and financial insights</p>
                </div>
                <Card>
                    <EmptyState type="dashboard" />
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">Financial Dashboard</h1>
                    <p className="text-[var(--text-muted)]">Comprehensive overview of your income, expenses, and financial insights</p>
                </div>
                <DateRangeFilter />
            </div>

            {/* KPI Strip */}
            <KPIStrip transactions={transactions} />

            {/* Insight Cards */}
            <InsightCards transactions={transactions} />

            {/* Primary Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryBreakdown transactions={transactions} />
                <IncomeExpenseComparison transactions={transactions} />
            </div>

            {/* Budget Tracking */}
            <BudgetProgress transactions={transactions} />

            {/* Recent Activity - Show latest 5 transactions from ALL time */}
            <RecentActivity transactions={allTransactions} />
        </div>
    );
};

export default Dashboard;
