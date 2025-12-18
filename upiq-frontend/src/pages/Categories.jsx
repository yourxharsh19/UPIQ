import { useState, useEffect } from "react";
import CategoryService from "../services/category.service";
import TransactionService from "../services/transaction.service";
import CategoryCard from "../components/categories/CategoryCard";
import CategoryModal from "../components/categories/CategoryModal";
import CategoryTransactionsModal from "../components/categories/CategoryTransactionsModal";
import EmptyState from "../components/ui/EmptyState";
import { Plus } from "lucide-react";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [transactionCounts, setTransactionCounts] = useState({});
    const [allTransactions, setAllTransactions] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await CategoryService.getAll();
            if (response.data && response.data.data) {
                setCategories(response.data.data);
                console.log("=== CATEGORIES FETCHED ===");
                console.log("Category names:", response.data.data.map(c => c.name));
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
            const status = error.response?.status;
            if (status && status !== 401 && status !== 403 && status !== 404) {
                alert("Failed to load categories. Please try again.");
            }
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactionCounts = async () => {
        console.log("=== FETCHING TRANSACTIONS ===");
        try {
            const response = await TransactionService.getAll();
            console.log("Transaction API response:", response);

            // The API returns { success: true, data: [...], message: "..." }
            // So transactions are in response.data, not response.data.data
            if (response.data) {
                const transactions = response.data;
                setAllTransactions(transactions);

                // Count transactions per category
                const counts = {};
                transactions.forEach(t => {
                    const category = t.category || "Uncategorized";
                    counts[category] = (counts[category] || 0) + 1;
                });

                // Debug logging
                console.log("=== CATEGORY DEBUG ===");
                console.log("Total transactions:", transactions.length);
                console.log("Unique categories in transactions:", Object.keys(counts));
                console.log("Transaction counts by category:", counts);
                console.log("Sample transactions:", transactions.slice(0, 3).map(t => ({
                    description: t.description,
                    category: t.category,
                    type: t.type
                })));

                setTransactionCounts(counts);
            } else {
                console.warn("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Failed to fetch transaction counts", error);
            console.error("Error details:", error.response);
            setTransactionCounts({});
            setAllTransactions([]);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTransactionCounts();
    }, []);

    const handleAdd = () => {
        setCurrentCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setIsTransactionModalOpen(true);
    };

    const handleSave = async (id, formData) => {
        try {
            const payload = {
                ...formData,
                type: formData.type.toLowerCase()
            };

            if (id) {
                await CategoryService.update(id, payload);
            } else {
                await CategoryService.create(payload);
            }
            fetchCategories();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Save failed", error);
            throw error;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await CategoryService.delete(id);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete category: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const filteredCategories = categories.filter(c => {
        if (filter === "ALL") return true;
        return c.type?.toLowerCase() === filter.toLowerCase();
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500">Manage your income and expense categories</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setFilter("ALL")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === "ALL" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    All ({categories.length})
                </button>
                <button
                    onClick={() => setFilter("income")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === "income" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    💰 Income ({categories.filter(c => c.type?.toLowerCase() === 'income').length})
                </button>
                <button
                    onClick={() => setFilter("expense")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${filter === "expense" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    💸 Expense ({categories.filter(c => c.type?.toLowerCase() === 'expense').length})
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading categories...</div>
            ) : filteredCategories.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200">
                    <EmptyState 
                        type="categories"
                        title={filter === "ALL" ? "No categories yet" : `No ${filter} categories found`}
                        description={filter === "ALL" ? "Create your first category to organize your income and expenses" : `Try a different filter or create a new ${filter} category`}
                        actionLabel="Create Category"
                        onAction={handleAdd}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCategories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            transactionCount={transactionCounts[category.name] || 0}
                            onClick={handleCategoryClick}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={currentCategory}
                onSave={handleSave}
            />

            <CategoryTransactionsModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                category={selectedCategory}
                transactions={allTransactions}
            />
        </div>
    );
};

export default Categories;
