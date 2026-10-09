import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import Table from "../components/Table";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../services/categoryServices";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ category_name: "" });

    const userRole = localStorage.getItem("role");
    const canEdit = userRole === "Admin";

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ category_name: category.category_name });
        } else {
            setEditingCategory(null);
            setFormData({ category_name: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ category_name: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.category_id, formData);
                toast.success("Category updated successfully");
            } else {
                await createCategory(formData);
                toast.success("Category created successfully");
            }
            handleCloseModal();
            fetchCategories();
        } catch (error) {
            toast.error("Failed to save category");
        }
    };

    const handleDelete = async (category) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(category.category_id);
                toast.success("Category deleted successfully");
                fetchCategories();
            } catch (error) {
                toast.error("Failed to delete category");
            }
        }
    };

    const columns = [
        { header: "ID", accessor: "category_id" },
        { header: "Category Name", accessor: "category_name" },
    ];

    return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                    {canEdit && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add Category</span>
                        </button>
                    )}
                </div>

                <Table
                    columns={columns}
                    data={categories}
                    onEdit={canEdit ? handleOpenModal : null}
                    onDelete={canEdit ? handleDelete : null}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingCategory ? "Edit Category" : "Add Category"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={formData.category_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, category_name: e.target.value })
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
                                {editingCategory ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
    );
}

export default Categories;
