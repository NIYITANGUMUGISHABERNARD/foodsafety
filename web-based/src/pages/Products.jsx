import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import Table from "../components/Table";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../services/productServices";
import { getCategories } from "../services/categoryServices";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ product_name: "", category_id: "" });

    const userRole = localStorage.getItem("role");
    const canEdit = userRole === "Admin";

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            toast.error("Failed to fetch products");
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ product_name: product.product_name, category_id: product.category_id });
        } else {
            setEditingProduct(null);
            setFormData({ product_name: "", category_id: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ product_name: "", category_id: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.product_id, formData);
                toast.success("Product updated successfully");
            } else {
                await createProduct(formData);
                toast.success("Product created successfully");
            }
            handleCloseModal();
            fetchProducts();
        } catch (error) {
            toast.error("Failed to save product");
        }
    };

    const handleDelete = async (product) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(product.product_id);
                toast.success("Product deleted successfully");
                fetchProducts();
            } catch (error) {
                toast.error("Failed to delete product");
            }
        }
    };

    const columns = [
        { header: "ID", accessor: "product_id" },
        { header: "Product Name", accessor: "product_name" },
        { 
            header: "Category", 
            accessor: "category_name",
            render: (row) => row.category_name || "N/A"
        },
    ];

    return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                    {canEdit && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Product</span>
                        </button>
                    )}
                </div>

                <Table
                    columns={columns}
                    data={products}
                    onEdit={canEdit ? handleOpenModal : null}
                    onDelete={canEdit ? handleDelete : null}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingProduct ? "Edit Product" : "Add Product"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={formData.product_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, product_name: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.category_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, category_id: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </select>
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
                                {editingProduct ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
    );
}

export default Products;
