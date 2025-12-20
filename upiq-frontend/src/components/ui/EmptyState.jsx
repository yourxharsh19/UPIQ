import { Link } from "react-router-dom";
import { Upload, FileText, TrendingUp, ArrowRight } from "lucide-react";
import Button from "./Button";

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
      description: "Upload your first statement PDF to start tracking your expenses automatically.",
      actionLabel: "Upload Statement",
      actionPath: "/upload"
    },
    categories: {
      icon: TrendingUp,
      title: "No categories yet",
      description: "Create your first category to organize your income and expenses.",
      actionLabel: "Create Category",
      actionPath: "/categories"
    },
    dashboard: {
      icon: Upload,
      title: "Welcome to UPIQ!",
      description: "Get started by uploading your first statement statement. We'll automatically extract and categorize your transactions.",
      actionLabel: "Upload Statement",
      actionPath: "/upload"
    }
  };

  const config = configs[type] || {
    icon: CustomIcon || FileText,
    title: title || "No data available",
    description: description || "Get started by adding some data.",
    actionLabel: actionLabel || "Get Started",
    actionPath: actionPath || "/dashboard"
  };

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full"></div>
        <div className="relative bg-[var(--bg-surface)] border border-[var(--border-base)] p-8 rounded-3xl shadow-premium group-hover:scale-105 transition-transform duration-500">
          <Icon size={48} className="text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3 text-center tracking-tight">
        {config.title}
      </h3>
      <p className="text-[var(--text-muted)] text-center max-w-sm mb-10 leading-relaxed">
        {config.description}
      </p>

      {config.actionPath ? (
        <Link to={config.actionPath}>
          <Button size="lg" className="group">
            {config.actionLabel}
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      ) : onAction ? (
        <Button size="lg" onClick={onAction} className="group">
          {config.actionLabel}
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;

