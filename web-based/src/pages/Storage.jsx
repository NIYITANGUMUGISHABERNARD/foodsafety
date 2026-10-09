import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import Table from "../components/Table";
import {
    getStorageRecords,
    createStorageRecord,
    updateStorageRecord,
    deleteStorageRecord
} from "../services/storageServices";
import { getBatches } from "../services/batchServices";

function Storage() {
    const [storageRecords, setStorageRecords] = useState([]);
    const [batches, setBatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({
        batch_id: "",
        temperature: "",
        humidity: "",
        storage_type: ""
    });

    const userRole = localStorage.getItem("role");
    const canEdit = userRole === "Admin" || userRole === "Production Staff";

    useEffect(() => {
        fetchStorageRecords();
        fetchBatches();
    }, []);

    const fetchStorageRecords = async () => {
        try {
            const response = await getStorageRecords();
            setStorageRecords(response.data);
        } catch (error) {
            toast.error("Failed to fetch storage records");
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

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                batch_id: record.batch_id,
                temperature: record.temperature,
                humidity: record.humidity,
                storage_type: record.storage_type
            });
        } else {
            setEditingRecord(null);
            setFormData({
                batch_id: "",
                temperature: "",
                humidity: "",
                storage_type: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
        setFormData({
            batch_id: "",
            temperature: "",
            humidity: "",
            storage_type: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await updateStorageRecord(editingRecord.storage_id, formData);
                toast.success("Storage record updated successfully");
            } else {
                await createStorageRecord(formData);
                toast.success("Storage record created successfully");
            }
            handleCloseModal();
            fetchStorageRecords();
        } catch (error) {
            toast.error("Failed to save storage record");
        }
    };

    const handleDelete = async (record) => {
        if (window.confirm("Are you sure you want to delete this storage record?")) {
            try {
                await deleteStorageRecord(record.storage_id);
                toast.success("Storage record deleted successfully");
                fetchStorageRecords();
            } catch (error) {
                toast.error("Failed to delete storage record");
            }
        }
    };

    const columns = [
        { header: "ID", accessor: "storage_id" },
        { header: "Batch ID", accessor: "batch_id" },
        { header: "Temperature (°C)", accessor: "temperature" },
        { header: "Humidity (%)", accessor: "humidity" },
        { header: "Storage Type", accessor: "storage_type" },
    ];

    return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Storage Conditions</h1>
                    {canEdit && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Record</span>
                        </button>
                    )}
                </div>

                <Table
                    columns={columns}
                    data={storageRecords}
                    onEdit={canEdit ? handleOpenModal : null}
                    onDelete={canEdit ? handleDelete : null}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingRecord ? "Edit Storage Record" : "Add Storage Record"}
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
                                Temperature (°C)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.temperature}
                                onChange={(e) =>
                                    setFormData({ ...formData, temperature: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Humidity (%)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.humidity}
                                onChange={(e) =>
                                    setFormData({ ...formData, humidity: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Storage Type
                            </label>
                            <input
                                type="text"
                                value={formData.storage_type}
                                onChange={(e) =>
                                    setFormData({ ...formData, storage_type: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
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
                                {editingRecord ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
    );
}

export default Storage;
