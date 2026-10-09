import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import Table from "../components/Table";
import {
    getInspections,
    createInspection,
    updateInspection,
    deleteInspection
} from "../services/inspectionServices";
import { getBatches } from "../services/batchServices";

function Inspections() {
    const [inspections, setInspections] = useState([]);
    const [batches, setBatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInspection, setEditingInspection] = useState(null);
    const [formData, setFormData] = useState({
        batch_id: "",
        inspected_by: "",
        inspection_status: "",
        remarks: ""
    });

    const userRole = localStorage.getItem("role");
    const canEdit = userRole === "Admin" || userRole === "Quality Control Officer";

    useEffect(() => {
        fetchInspections();
        fetchBatches();
    }, []);

    const fetchInspections = async () => {
        try {
            const response = await getInspections();
            setInspections(response.data);
        } catch (error) {
            toast.error("Failed to fetch inspections");
        }
    };

    const fetchBatches = async () => {
        try {
            const response = await getBatches();
            setBatches(response.data);
        } catch (error) {
            toast.error("Failed to fetch batches");
        }
    };

    const handleOpenModal = (inspection = null) => {
        if (inspection) {
            setEditingInspection(inspection);
            setFormData({
                batch_id: inspection.batch_id,
                inspected_by: inspection.inspected_by,
                inspection_status: inspection.inspection_status,
                remarks: inspection.remarks
            });
        } else {
            setEditingInspection(null);
            setFormData({
                batch_id: "",
                inspected_by: "",
                inspection_status: "",
                remarks: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingInspection(null);
        setFormData({
            batch_id: "",
            inspected_by: "",
            inspection_status: "",
            remarks: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingInspection) {
                await updateInspection(editingInspection.inspection_id, formData);
                toast.success("Inspection updated successfully");
            } else {
                await createInspection(formData);
                toast.success("Inspection created successfully");
            }
            handleCloseModal();
            fetchInspections();
        } catch (error) {
            toast.error("Failed to save inspection");
        }
    };

    const handleDelete = async (inspection) => {
        if (window.confirm("Are you sure you want to delete this inspection?")) {
            try {
                await deleteInspection(inspection.inspection_id);
                toast.success("Inspection deleted successfully");
                fetchInspections();
            } catch (error) {
                toast.error("Failed to delete inspection");
            }
        }
    };

    const columns = [
        { header: "ID", accessor: "inspection_id" },
        { header: "Batch ID", accessor: "batch_id" },
        { header: "Inspected By", accessor: "inspected_by" },
        { 
            header: "Status", 
            accessor: "inspection_status",
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.inspection_status === "Passed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                }`}>
                    {row.inspection_status}
                </span>
            )
        },
        { header: "Remarks", accessor: "remarks" },
    ];

    return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Inspections</h1>
                    {canEdit && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Inspection</span>
                        </button>
                    )}
                </div>

                <Table
                    columns={columns}
                    data={inspections}
                    onEdit={canEdit ? handleOpenModal : null}
                    onDelete={canEdit ? handleDelete : null}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingInspection ? "Edit Inspection" : "Add Inspection"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Batch
                            </label>
                            <select
                                value={formData.batch_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, batch_id: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Batch</option>
                                {batches.map((batch) => (
                                    <option key={batch.batch_id} value={batch.batch_id}>
                                        {batch.batch_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Inspected By (User ID)
                            </label>
                            <input
                                type="number"
                                value={formData.inspected_by}
                                onChange={(e) =>
                                    setFormData({ ...formData, inspected_by: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.inspection_status}
                                onChange={(e) =>
                                    setFormData({ ...formData, inspection_status: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks
                            </label>
                            <textarea
                                value={formData.remarks}
                                onChange={(e) =>
                                    setFormData({ ...formData, remarks: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                rows="3"
                            />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                {editingInspection ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
    );
}

export default Inspections;
