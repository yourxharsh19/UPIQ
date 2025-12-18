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
        primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm ring-1 ring-primary-600",
        secondary: "bg-white hover:bg-gray-50 text-gray-700 shadow-sm ring-1 ring-gray-300",
        danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
        ghost: "hover:bg-gray-100 text-gray-600"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={clsx(
                "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",
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
