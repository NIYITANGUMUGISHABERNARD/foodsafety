import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import Table from "../components/Table";
import {
    getBatches,
    createBatch,
    updateBatch,
    deleteBatch
} from "../services/batchServices";
import { getProducts } from "../services/productServices";

function Batches() {
    const [batches, setBatches] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [formData, setFormData] = useState({
        product_id: "",
        batch_number: "",
        production_date: "",
        expiry_date: "",
        quantity: ""
    });

    const userRole = localStorage.getItem("role");
    const canEdit = userRole === "Admin" || userRole === "Production Staff";

    useEffect(() => {
        fetchBatches();
        fetchProducts();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await getBatches();
            setBatches(response.data);
        } catch (error) {
            toast.error("Failed to fetch batches");
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            toast.error("Failed to fetch products");
        }
    };

    const handleOpenModal = (batch = null) => {
        if (batch) {
            setEditingBatch(batch);
            setFormData({
                product_id: batch.product_id,
                batch_number: batch.batch_number,
                production_date: batch.production_date,
                expiry_date: batch.expiry_date,
                quantity: batch.quantity
            });
        } else {
            setEditingBatch(null);
            setFormData({
                product_id: "",
                batch_number: "",
                production_date: "",
                expiry_date: "",
                quantity: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBatch(null);
        setFormData({
            product_id: "",
            batch_number: "",
            production_date: "",
            expiry_date: "",
            quantity: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBatch) {
                await updateBatch(editingBatch.batch_id, formData);
                toast.success("Batch updated successfully");
            } else {
                await createBatch(formData);
                toast.success("Batch created successfully");
            }
            handleCloseModal();
            fetchBatches();
        } catch (error) {
            toast.error("Failed to save batch");
        }
    };

    const handleDelete = async (batch) => {
        if (window.confirm("Are you sure you want to delete this batch?")) {
            try {
                await deleteBatch(batch.batch_id);
                toast.success("Batch deleted successfully");
                fetchBatches();
            } catch (error) {
                toast.error("Failed to delete batch");
            }
        }
    };

    const columns = [
        { header: "ID", accessor: "batch_id" },
        { header: "Batch Number", accessor: "batch_number" },
        { header: "Product ID", accessor: "product_id" },
        { header: "Production Date", accessor: "production_date" },
        { header: "Expiry Date", accessor: "expiry_date" },
        { header: "Quantity", accessor: "quantity" },
    ];

    return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Batches</h1>
                    {canEdit && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Batch</span>
                        </button>
                    )}
                </div>

                <Table
                    columns={columns}
                    data={batches}
                    onEdit={canEdit ? handleOpenModal : null}
                    onDelete={canEdit ? handleDelete : null}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingBatch ? "Edit Batch" : "Add Batch"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product
                            </label>
                            <select
                                value={formData.product_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, product_id: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Product</option>
                                {products.map((product) => (
                                    <option key={product.product_id} value={product.product_id}>
                                        {product.product_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Batch Number
                            </label>
                            <input
                                type="text"
                                value={formData.batch_number}
                                onChange={(e) =>
                                    setFormData({ ...formData, batch_number: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Production Date
                            </label>
                            <input
                                type="date"
                                value={formData.production_date}
                                onChange={(e) =>
                                    setFormData({ ...formData, production_date: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                            </label>
                            <input
                                type="date"
                                value={formData.expiry_date}
                                onChange={(e) =>
                                    setFormData({ ...formData, expiry_date: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData({ ...formData, quantity: e.target.value })
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
                                {editingBatch ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
    );
}

export default Batches;
