import { useState, useEffect } from "react";
import Button from "../ui/Button";
import { useBudget } from "../../context/BudgetContext";
import { CATEGORY_COLORS, CATEGORY_ICONS, getCategoryColor, getCategoryIcon } from "../../utils/categoryUtils";

const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
    const { getBudget, setBudget, deleteBudget } = useBudget();
    const [formData, setFormData] = useState({
        name: "",
        type: "expense",
        description: "",
        color: "",
        icon: ""
    });
    const [budgetAmount, setBudgetAmount] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                type: category.type || "expense",
                description: category.description || "",
                color: category.color || getCategoryColor(category.name).value,
                icon: category.icon || getCategoryIcon(category.name)
            });
            const existingBudget = getBudget(category.name);
            setBudgetAmount(existingBudget ? existingBudget.toString() : "");
        } else {
            const defaultColor = CATEGORY_COLORS[0].value;
            const defaultIcon = CATEGORY_ICONS[0];
            setFormData({
                name: "",
                type: "expense",
                description: "",
                color: defaultColor,
                icon: defaultIcon
            });
            setBudgetAmount("");
        }
    }, [category, isOpen, getBudget]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(category?.id, formData);
            // Save budget if provided
            if (formData.name && budgetAmount && parseFloat(budgetAmount) > 0) {
                setBudget(formData.name, parseFloat(budgetAmount));
            } else if (formData.name && (!budgetAmount || parseFloat(budgetAmount) === 0)) {
                // Remove budget if cleared
                const existingBudget = getBudget(formData.name);
                if (existingBudget) {
                    deleteBudget(formData.name);
                }
            }
            onClose();
        } catch (error) {
            console.error("Failed to save category", error);
            alert("❌ Failed to save category: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {category ? "Edit Category" : "Add New Category"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="e.g., Food, Rent, Salary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    value="expense"
                                    checked={formData.type === "expense"}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="mr-2"
                                />
                                <span className="text-sm">💸 Expense</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    value="income"
                                    checked={formData.type === "income"}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="mr-2"
                                />
                                <span className="text-sm">💰 Income</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Add a description..."
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Color
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {CATEGORY_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    className={`w-full h-10 rounded-lg border-2 transition-all ${formData.color === color.value
                                        ? 'border-gray-900 ring-2 ring-offset-2 ring-primary-500 z-10'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Icon
                        </label>
                        <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                            {CATEGORY_ICONS.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon })}
                                    className={`w-10 h-10 rounded-lg border-2 text-xl flex items-center justify-center transition-all ${formData.icon === icon
                                        ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-500'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-2xl">{formData.icon}</span>
                            <span className="text-sm text-gray-600">Selected icon preview</span>
                        </div>
                    </div>

                    {formData.type === "expense" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monthly Budget (Optional)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    value={budgetAmount}
                                    onChange={(e) => setBudgetAmount(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Set a monthly budget to track spending for this category</p>
                        </div>
                    )}

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
                            {category ? "Update" : "Create"} Category
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
