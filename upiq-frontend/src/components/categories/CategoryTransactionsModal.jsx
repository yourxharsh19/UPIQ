import { X } from "lucide-react";

const CategoryTransactionsModal = ({ isOpen, onClose, category, transactions }) => {
    if (!isOpen || !category) return null;

    // Case-insensitive filtering with trimming
    const categoryTransactions = transactions.filter(t => {
        const transactionCategory = (t.category || "").trim().toLowerCase();
        const targetCategory = (category.name || "").trim().toLowerCase();
        return transactionCategory === targetCategory;
    });

    console.log("Category:", category.name);
    console.log("Total transactions:", transactions.length);
    console.log("Filtered transactions:", categoryTransactions.length);
    console.log("Sample transaction categories:", transactions.slice(0, 5).map(t => t.category));

    const totalAmount = categoryTransactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {category.name} Transactions
                        </h2>
                        <p className="text-sm text-gray-500">
                            {categoryTransactions.length} transaction{categoryTransactions.length !== 1 ? 's' : ''} •
                            Total: ₹{totalAmount.toFixed(2)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                    {categoryTransactions.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p className="mb-2">No transactions found for this category</p>
                            <p className="text-xs">Looking for category: "{category.name}"</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {categoryTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {transaction.description}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(transaction.date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-semibold ${transaction.type?.toLowerCase() === 'income'
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                }`}>
                                                {transaction.type?.toLowerCase() === 'income' ? '+' : '-'}
                                                ₹{transaction.amount?.toFixed(2)}
                                            </p>
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${transaction.type?.toLowerCase() === 'income'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {transaction.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryTransactionsModal;
