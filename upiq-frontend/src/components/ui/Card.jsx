import clsx from "clsx";

const Card = ({ children, className }) => {
    return (
        <div className={clsx("bg-white p-6 rounded-xl shadow-sm border border-gray-100", className)}>
            {children}
        </div>
    );
};

export default Card;
