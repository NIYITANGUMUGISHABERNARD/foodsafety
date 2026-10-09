import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getDashboardData } from "../services/dashboardServices";

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await getDashboardData();
            setDashboardData(response.data);
        } catch (error) {
            toast.error("Failed to fetch dashboard data");
        }
    };

    return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

                {dashboardData ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                            <h2 className="text-lg font-semibold text-gray-600">Total Products</h2>
                            <p className="text-4xl font-bold text-green-500 mt-2">{dashboardData.totalProducts}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                            <h2 className="text-lg font-semibold text-gray-600">Total Batches</h2>
                            <p className="text-4xl font-bold text-yellow-500 mt-2">{dashboardData.totalBatches}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                            <h2 className="text-lg font-semibold text-gray-600">Unsafe Batches</h2>
                            <p className="text-4xl font-bold text-red-500 mt-2">{dashboardData.unsafeBatches}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading dashboard data...</p>
                    </div>
                )}
            </div>
    );
}

export default Dashboard;