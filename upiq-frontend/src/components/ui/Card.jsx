import clsx from "clsx";

const Card = ({ children, className }) => {
    return (
        <div className={clsx(
            "bg-[var(--bg-card)] border border-[var(--border-base)] rounded-2xl shadow-premium overflow-hidden",
            className
        )}>
            {children}
        </div>
    );
};

export default Card;
