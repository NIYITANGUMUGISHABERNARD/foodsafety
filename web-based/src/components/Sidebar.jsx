import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Tag,
    Users,
    Box,
    Thermometer,
    ClipboardCheck,
    AlertTriangle,
    Bell,
    LogOut
} from "lucide-react";

function Sidebar() {
    const location = useLocation();
    const userRole = localStorage.getItem("role");

    const menuItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["Manager", "Admin"] },
        { path: "/products", icon: Package, label: "Products", roles: ["Admin", "Quality Control Officer", "Production Staff", "Manager"] },
        { path: "/categories", icon: Tag, label: "Categories", roles: ["Admin", "Quality Control Officer", "Production Staff", "Manager"] },
        { path: "/users", icon: Users, label: "Users", roles: ["Admin"] },
        { path: "/batches", icon: Box, label: "Batches", roles: ["Admin", "Quality Control Officer", "Production Staff", "Manager"] },
        { path: "/storage", icon: Thermometer, label: "Storage", roles: ["Admin", "Quality Control Officer", "Production Staff", "Manager"] },
        { path: "/inspections", icon: ClipboardCheck, label: "Inspections", roles: ["Admin", "Quality Control Officer", "Manager"] },
        { path: "/risk", icon: AlertTriangle, label: "Risk Analysis", roles: ["Admin", "Quality Control Officer", "Manager"] },
        { path: "/alerts", icon: Bell, label: "Alerts", roles: ["Admin", "Quality Control Officer", "Manager"] },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const filteredMenuItems = menuItems.filter(item =>
        item.roles.includes(userRole)
    );

    return (
        <div className="w-64 bg-green-500 min-h-screen p-4 text-white">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Food Safety</h1>
                <p className="text-green-100 text-sm">Management System</p>
            </div>

            <nav className="space-y-2">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-green-600 text-white"
                                    : "text-green-100 hover:bg-green-600 hover:text-white"
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-green-100 hover:bg-green-600 hover:text-white transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;