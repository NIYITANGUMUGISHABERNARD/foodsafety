import api from "./api";

export const getAlerts = async () => {
    return await api.get("/alerts");
};

export const getAlert = async (id) => {
    return await api.get(`/alerts/${id}`);
};

export const createAlert = async (data) => {
    return await api.post("/alerts", data);
};

export const updateAlert = async (id, data) => {
    return await api.put(`/alerts/${id}`, data);
};

export const deleteAlert = async (id) => {
    return await api.delete(`/alerts/${id}`);
};
