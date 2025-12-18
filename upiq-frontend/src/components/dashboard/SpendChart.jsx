import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const SpendChart = ({ transactions }) => {
    // Group transactions by month (simplified for now) or category
    // For this example, let's show Category-wise spend
    const categoryData = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, t) => {
            const category = t.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + t.amount;
            return acc;
        }, {});

    const data = Object.keys(categoryData).map(key => ({
        name: key,
        amount: categoryData[key]
    }));

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl border border-gray-100 h-80 flex items-center justify-center text-gray-400">
                No expense data to display
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 h-80">
            <h3 className="text-gray-500 text-sm font-medium mb-4">Category Spend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendChart;
