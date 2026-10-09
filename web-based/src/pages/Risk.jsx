import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Brain } from "lucide-react";
import Table from "../components/Table";
import { getRiskAnalyses } from "../services/riskServices";

function Risk() {
    const [riskAnalyses, setRiskAnalyses] = useState([]);

    useEffect(() => {
        fetchRiskAnalyses();
    }, []);

    const fetchRiskAnalyses = async () => {
        try {
            const response = await getRiskAnalyses();
            setRiskAnalyses(response.data);
        } catch (error) {
            toast.error("Failed to fetch risk analyses");
        }
    };


    const columns = [
        { header: "ID", accessor: "risk_id" },
        { header: "Batch ID", accessor: "batch_id" },
        { 
            header: "Risk Level", 
            accessor: "risk_level",
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.risk_level === "Safe" 
                        ? "bg-green-100 text-green-800" 
                        : row.risk_level === "Warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                }`}>
                    {row.risk_level}
                </span>
            )
        },
        { header: "AI Score", accessor: "ai_score" },
    ];

    return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Brain size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">AI Risk Analysis</h1>
                            <p className="text-gray-600 text-sm">Automatically evaluated based on storage conditions</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                        <strong>Automatic:</strong> Risk analysis is automatically generated when storage conditions are recorded or updated. No manual intervention required.
                    </p>
                </div>

                <Table
                    columns={columns}
                    data={riskAnalyses}
                />
            </div>
    );
}

export default Risk;
