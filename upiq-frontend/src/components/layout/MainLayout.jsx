import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] transition-colors duration-300 font-sans flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen transition-all duration-300 flex flex-col overflow-y-auto">
                <div className="flex-1 max-w-7xl w-full mx-auto px-8 py-10">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default MainLayout;
