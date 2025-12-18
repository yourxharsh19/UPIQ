import { Link } from "react-router-dom";
import { Upload, FileText, TrendingUp, ArrowRight } from "lucide-react";

const EmptyState = ({ 
  type = "transactions",
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
  icon: CustomIcon
}) => {
  const configs = {
    transactions: {
      icon: FileText,
      title: "No transactions yet",
      description: "Upload your first UPI PDF to start tracking your expenses automatically",
      actionLabel: "Upload PDF",
      actionPath: "/upload"
    },
    categories: {
      icon: TrendingUp,
      title: "No categories yet",
      description: "Create your first category to organize your income and expenses",
      actionLabel: "Create Category",
      actionPath: "/categories"
    },
    dashboard: {
      icon: Upload,
      title: "Welcome to UPIQ!",
      description: "Get started by uploading your first UPI PDF. We'll automatically extract and categorize your transactions.",
      actionLabel: "Upload Your First PDF",
      actionPath: "/upload"
    }
  };

  const config = configs[type] || {
    icon: CustomIcon || FileText,
    title: title || "No data available",
    description: description || "Get started by adding some data",
    actionLabel: actionLabel || "Get Started",
    actionPath: actionPath || "/dashboard"
  };

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full blur-2xl opacity-50"></div>
        <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-full">
          <Icon size={48} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        {config.title}
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-8">
        {config.description}
      </p>
      
      {(config.actionPath || onAction) && (
        config.actionPath ? (
          <Link
            to={config.actionPath}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {config.actionLabel}
            <ArrowRight size={20} />
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {config.actionLabel}
            <ArrowRight size={20} />
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;

