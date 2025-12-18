import { useState, useEffect } from "react";
import Button from "../ui/Button";

const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "expense",
        description: ""
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                type: category.type || "expense",
                description: category.description || ""
            });
        } else {
            setFormData({
                name: "",
                type: "expense",
                description: ""
            });
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(category?.id, formData);
            onClose();
        } catch (error) {
            console.error("Failed to save category", error);
            alert("❌ Failed to save category: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {category ? "Edit Category" : "Add New Category"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
