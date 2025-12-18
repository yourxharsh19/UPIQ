import { useState, useEffect, useMemo } from "react";
import TransactionService from "../services/transaction.service";
import { useDateFilter } from "../context/DateFilterContext";
import { filterByDateRange } from "../utils/transactionUtils";
import TransactionTable from "../components/transactions/TransactionTable";
import EditTransactionModal from "../components/transactions/EditTransactionModal";
import DateRangeFilter from "../components/dashboard/DateRangeFilter";
import { Search } from "lucide-react";

const Transactions = () => {
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { startDate, endDate } = useDateFilter();
    const [filters, setFilters] = useState({
        search: "",
        type: "ALL",
        category: ""
    });

    // Filter transactions by date range
    const dateFilteredTransactions = useMemo(() => {
        return filterByDateRange(allTransactions, startDate, endDate);
    }, [allTransactions, startDate, endDate]);

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await TransactionService.getAll();
            if (response.success) {
                setAllTransactions(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleEdit = (transaction) => {
        setCurrentTransaction(transaction);
        setIsEditModalOpen(true);
    };

    const handleSave = async (id, updatedData) => {
        try {
            await TransactionService.update(id, updatedData);
            // Refresh list
            fetchTransactions();
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update transaction");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await TransactionService.delete(id);
                // Optimistic update
                setAllTransactions(allTransactions.filter(t => t.id !== id));
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete transaction");
            }
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm("⚠️ Are you sure you want to delete ALL transactions? This cannot be undone!")) {
            if (window.confirm("🔴 FINAL WARNING: This will permanently delete ALL your transaction data. Confirm?")) {
                try {
                    await TransactionService.deleteAll();
                    setAllTransactions([]);
                    alert("✅ All transactions deleted successfully.");
                } catch (error) {
                    console.error("Delete All failed", error);
                    alert("❌ Failed to delete all transactions: " + (error.response?.data?.message || error.message));
                }
            }
        }
    };

    // Filter Logic (applied to date-filtered transactions)
    const filteredTransactions = useMemo(() => {
        return dateFilteredTransactions.filter(t => {
            const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                (t.category && t.category.toLowerCase().includes(filters.search.toLowerCase()));

            const matchesType = filters.type === "ALL" || t.type?.toUpperCase() === filters.type;

            return matchesSearch && matchesType;
        });
    }, [dateFilteredTransactions, filters.search, filters.type]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-500">Manage and categorize your expenses.</p>
                </div>
                <div className="flex items-center gap-3">
                    <DateRangeFilter />
                    <button
                        onClick={handleDeleteAll}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-md hover:shadow-lg"
                    >
                        🗑️ Delete All Transactions
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search description or category..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="ALL">All Types</option>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <TransactionTable
                    transactions={filteredTransactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <EditTransactionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                transaction={currentTransaction}
                onSave={handleSave}
            />
        </div>
    );
};

export default Transactions;
