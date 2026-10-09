import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import Table from "../components/Table";
import {
    getUsers,
    updateUser,
    deleteUser
} from "../services/userServices";
import { createUser } from "../services/authServices";

function Users() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        role: ""
    });

    const userRole = localStorage.getItem("role");
    const canEdit = userRole === "Admin";

    useEffect(() => {
        if (canEdit) {
            fetchUsers();
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to fetch users");
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                full_name: user.full_name,
                email: user.email,
                password: "",
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({ full_name: "", email: "", password: "", role: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ full_name: "", email: "", password: "", role: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await updateUser(editingUser.user_id, {
                    full_name: formData.full_name,
                    role: formData.role
                });
                toast.success("User updated successfully");
            } else {
                await createUser(formData);
                toast.success("User created successfully");
            }
            handleCloseModal();
            fetchUsers();
        } catch (error) {
            toast.error("Failed to save user");
        }
    };

    const handleDelete = async (user) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(user.user_id);
                toast.success("User deleted successfully");
                fetchUsers();
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const columns = [
        { header: "ID", accessor: "user_id" },
        { header: "Name", accessor: "full_name" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
    ];

    if (!canEdit) {
        return (
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                    <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
                </div>
        );
    }

    return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Users</h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Add User</span>
                    </button>
                </div>

                <Table
                    columns={columns}
                    data={users}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                />

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editingUser ? "Edit User" : "Add User"}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, full_name: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                disabled={!!editingUser}
                            />
                        </div>
                        {!editingUser && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({ ...formData, role: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Quality Control Officer">Quality Control Officer</option>
                                <option value="Production Staff">Production Staff</option>
                                <option value="Manager">Manager</option>
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
                                {editingUser ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
    );
}

export default Users;
