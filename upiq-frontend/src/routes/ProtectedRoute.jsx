import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    console.log("ProtectedRoute: State check", { user: !!user, loading });

    if (loading) {
        console.log("ProtectedRoute: Loading state detected, showing spinner");
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        console.log("ProtectedRoute: NO USER found, redirecting to /login");
        return <Navigate to="/login" replace />;
    }

    console.log("ProtectedRoute: USER ACTIVE, rendering Outlet");
    return <Outlet />;
};

export default ProtectedRoute;
