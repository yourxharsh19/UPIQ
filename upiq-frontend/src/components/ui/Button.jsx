import clsx from "clsx";
import { Loader2 } from "lucide-react";

const Button = ({
    children,
    onClick,
    variant = "primary",
    size = "md",
    className,
    disabled = false,
    loading = false,
    type = "button"
}) => {
    const variants = {
        primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-premium hover:shadow-premium-hover",
        secondary: "bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] shadow-premium hover:shadow-premium-hover border border-[var(--border-base)]",
        danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-premium",
        ghost: "hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]",
        outline: "bg-transparent border border-[var(--border-base)] text-[var(--text-main)] hover:bg-[var(--bg-surface)]"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs font-bold uppercase tracking-wider",
        md: "px-5 py-2.5 text-sm font-bold tracking-tight",
        lg: "px-8 py-3.5 text-base font-bold tracking-tight"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={clsx(
                "inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
