import api from "./api";

export const getStorageRecords = async () => {
    return await api.get("/storage");
};

export const getStorageRecord = async (id) => {
    return await api.get(`/storage/${id}`);
};

export const createStorageRecord = async (data) => {
    return await api.post("/storage", data);
};

export const updateStorageRecord = async (id, data) => {
    return await api.put(`/storage/${id}`, data);
};

export const deleteStorageRecord = async (id) => {
    return await api.delete(`/storage/${id}`);
};
