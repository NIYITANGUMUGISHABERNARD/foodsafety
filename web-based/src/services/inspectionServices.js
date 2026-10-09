import api from "./api";

export const getInspections = async () => {
    return await api.get("/inspections");
};

export const getInspection = async (id) => {
    return await api.get(`/inspections/${id}`);
};

export const createInspection = async (data) => {
    return await api.post("/inspections", data);
};

export const updateInspection = async (id, data) => {
    return await api.put(`/inspections/${id}`, data);
};

export const deleteInspection = async (id) => {
    return await api.delete(`/inspections/${id}`);
};
