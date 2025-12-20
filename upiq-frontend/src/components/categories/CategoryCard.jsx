import { Edit2, Trash2 } from "lucide-react";
import { getCategoryDisplayProps } from "../../utils/categoryUtils";
import clsx from "clsx";

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
            className={clsx(
                "relative bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-base)] shadow-premium hover:shadow-premium-hover transition-all duration-300 group overflow-hidden",
                transactionCount > 0 ? 'cursor-pointer' : ''
            )}
        >
            {/* Dynamic Accent Bar */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                style={{ backgroundColor: displayProps.colorValue }}
            />

            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="p-2.5 rounded-xl border border-[var(--border-base)] text-2xl group-hover:scale-110 transition-transform"
                            style={{
                                backgroundColor: `${displayProps.colorValue}15`,
                                borderColor: `${displayProps.colorValue}30`
                            }}
                        >
                            {displayProps.icon}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight leading-tight">{category.name}</h3>
                            <span
                                className="text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: displayProps.colorValue }}
                            >
                                {category.type?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        {transactionCount > 0 ? (
                            <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                                style={{
                                    backgroundColor: `${displayProps.colorValue}10`,
                                    color: displayProps.colorValue,
                                    borderColor: `${displayProps.colorValue}20`
                                }}
                            >
                                {transactionCount} Transactions
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-base)]">
                                No activity
                            </span>
                        )}
                    </div>

                    {category.description && (
                        <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">{category.description}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleEdit}
                        className="p-2 text-[var(--text-muted)] hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-all"
                        title="Edit category"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Delete category"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
