import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Bell } from "lucide-react";
import Table from "../components/Table";
import { getAlerts } from "../services/alertServices";

function Alerts() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const response = await getAlerts();
            setAlerts(response.data);
        } catch (error) {
            toast.error("Failed to fetch alerts");
        }
    };


    const columns = [
        { header: "ID", accessor: "alert_id" },
        { header: "Batch ID", accessor: "batch_id" },
        { header: "Risk ID", accessor: "risk_id" },
        { header: "Message", accessor: "alert_message" },
        { header: "Type", accessor: "alert_type" },
        { 
            header: "Status", 
            accessor: "status",
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.status === "Unread" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-gray-100 text-gray-800"
                }`}>
                    {row.status}
                </span>
            )
        },
    ];

    return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                            <Bell size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">System Alerts</h1>
                            <p className="text-gray-600 text-sm">Automatically generated for critical safety issues</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                        <strong>Automatic:</strong> Alerts are automatically generated when AI risk analysis identifies Warning or Unsafe conditions. No manual intervention required.
                    </p>
                </div>

                <Table
                    columns={columns}
                    data={alerts}
                />
            </div>
    );
}

export default Alerts;
