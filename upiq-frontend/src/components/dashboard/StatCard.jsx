const StatCard = ({ title, amount, trend, icon: Icon, color }) => {
    return (
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-base)] shadow-premium hover:shadow-premium-hover transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">{title}</h3>
                    <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">{amount}</h2>
                </div>
                <div className={`p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)]`}>
                    <Icon size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-xs font-medium">
                    <span className={trend > 0 ? "text-emerald-500" : "text-rose-500"}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </span>
                    <span className="text-[var(--text-muted)] ml-2 font-normal text-xs opacity-70">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
