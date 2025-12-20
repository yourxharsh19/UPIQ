import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { getCategoryDisplayProps } from "../../utils/categoryUtils";
import clsx from "clsx";

const RecentActivity = ({ transactions }) => {
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-base)] shadow-premium hover:shadow-premium-hover transition-all duration-300">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-1 tracking-tight">Recent Activity</h3>
        <p className="text-sm text-[var(--text-muted)]">Your latest transactions</p>
      </div>

      <div className="space-y-4">
        {recentTransactions.map((transaction) => {
          const isIncome = transaction.type?.toLowerCase() === 'income';
          const category = transaction.category || 'Uncategorized';

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-base)] hover:bg-[var(--bg-surface)] transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={clsx(
                  "p-2 rounded-xl border",
                  isIncome ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                )}>
                  {isIncome ? (
                    <ArrowUpCircle size={20} />
                  ) : (
                    <ArrowDownCircle size={20} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--text-main)] truncate tracking-tight">
                    {transaction.description || 'Transaction'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const categoryDisplay = getCategoryDisplayProps({ name: category });
                      return (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-base)]">
                          <span>{categoryDisplay.icon}</span>
                          {category}
                        </span>
                      );
                    })()}
                    <span className="text-[10px] font-medium text-[var(--text-muted)] opacity-60">
                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right ml-4">
                <p className={clsx(
                  "text-lg font-bold tracking-tight",
                  isIncome ? 'text-emerald-500' : 'text-rose-500'
                )}>
                  {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;

