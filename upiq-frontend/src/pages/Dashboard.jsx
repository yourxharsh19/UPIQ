import { useEffect, useState } from "react";
import OverviewCards from "../components/dashboard/OverviewCards";
import SpendChart from "../components/dashboard/SpendChart";
import TransactionService from "../services/transaction.service";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await TransactionService.getAll();
                if (response.success) {
                    setTransactions(response.data);
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
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back, here's your financial overview.</p>
            </div>

            <OverviewCards transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 h-80">
                    <h3 className="text-gray-500 text-sm font-medium mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        {transactions.slice(0, 5).map((t) => (
                            <div key={t.id} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900">{t.description || "Transaction"}</p>
                                    <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                                <span className={`font-semibold ${t.type?.toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type?.toLowerCase() === 'income' ? '+' : '-'}₹{t.amount}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <p className="text-center text-gray-400 mt-10">No recent transactions</p>
                        )}
                    </div>
                </div>
                <SpendChart transactions={transactions} />
            </div>
        </div>
    );
};

export default Dashboard;
