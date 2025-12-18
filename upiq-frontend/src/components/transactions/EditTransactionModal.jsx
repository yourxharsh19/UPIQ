import { useState, useEffect } from "react";
import Button from "../ui/Button";
import CategoryService from "../../services/category.service";
import { Plus } from "lucide-react";

const EditTransactionModal = ({ isOpen, onClose, transaction, onSave }) => {
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        category: "",
        type: "EXPENSE",
        date: "",
        paymentMethod: "UPI"
    });
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [creatingCategory, setCreatingCategory] = useState(false);

    // Fetch categories when modal opens or type changes
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, formData.type]);

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description || "",
                amount: transaction.amount || "",
                category: transaction.category || "Uncategorized",
                type: transaction.type || "EXPENSE",
                date: transaction.date || new Date().toISOString(),
                paymentMethod: transaction.paymentMethod || "UPI"
            });
        }
    }, [transaction]);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await CategoryService.getAll();
            if (response.data && response.data.data) {
                // Filter categories by transaction type
                const transactionType = formData.type.toLowerCase();
                const filtered = response.data.data.filter(cat =>
                    cat.type.toLowerCase() === transactionType
                );
                setCategories(filtered);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleQuickAddCategory = async () => {
        const categoryName = formData.category.trim();

        if (!categoryName) {
            alert("Please enter a category name");
            return;
        }

        // Check if category already exists
        if (categories.some(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
            alert("This category already exists!");
            return;
        }

        setCreatingCategory(true);
        try {
            await CategoryService.create({
                name: categoryName,
                type: formData.type.toLowerCase(),
                description: `Created from transaction`
            });

            // Refresh categories list
            await fetchCategories();
            alert(`✅ Category "${categoryName}" created successfully!`);
        } catch (error) {
            console.error("Failed to create category", error);
            alert("❌ Failed to create category: " + (error.response?.data?.message || error.message));
        } finally {
            setCreatingCategory(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(transaction.id, {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            onClose();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save transaction: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    // Default fallback categories
    const defaultCategories = [
        "Food", "Groceries", "Shopping", "Transport", "Bills & Utilities",
        "Entertainment", "Health", "Salary", "Investment", "Other"
    ];

    // Combine user categories with defaults
    const allCategories = [
        ...categories.map(c => c.name),
        ...defaultCategories.filter(dc => !categories.some(c => c.name === dc))
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Transaction</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category {loadingCategories && <span className="text-xs text-gray-500">(loading...)</span>}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                list="category-suggestions"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Select or type a category"
                                required
                            />
                            <button
                                type="button"
                                onClick={handleQuickAddCategory}
                                disabled={creatingCategory || !formData.category.trim()}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-1"
                                title="Create this category"
                            >
                                <Plus size={16} />
                                {creatingCategory ? "..." : "Add"}
                            </button>
                        </div>
                        <datalist id="category-suggestions">
                            {allCategories.map((cat) => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                        <p className="mt-1 text-xs text-gray-500">
                            💡 Type a new category name and click "+ Add" to create it
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            isLoading={saving}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionModal;
