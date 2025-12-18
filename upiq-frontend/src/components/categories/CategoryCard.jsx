import { Edit2, Trash2 } from "lucide-react";
import { getCategoryDisplayProps } from "../../utils/categoryUtils";

const CategoryCard = ({ category, transactionCount = 0, onClick, onEdit, onDelete }) => {
    const isIncome = category.type?.toLowerCase() === 'income';
    const displayProps = getCategoryDisplayProps(category);

    const handleCardClick = () => {
        if (transactionCount > 0) {
            onClick(category);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(category);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(category.id);
    };

    return (
        <div
            onClick={handleCardClick}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${displayProps.colorClasses.border} ${displayProps.colorClasses.bg} hover:border-opacity-80 ${transactionCount > 0 ? 'cursor-pointer' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{displayProps.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${displayProps.colorClasses.bg} ${displayProps.colorClasses.text}`}>
                            {category.type?.toUpperCase()}
                        </span>

                        {transactionCount > 0 ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                📊 {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                                No transactions
                            </span>
                        )}
                    </div>

                    {category.description && (
                        <p className="mt-2 text-sm text-gray-600">{category.description}</p>
                    )}
                </div>

                <div className="flex gap-1 ml-2">
                    <button onClick={handleEdit} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit category">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition" title="Delete category">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
