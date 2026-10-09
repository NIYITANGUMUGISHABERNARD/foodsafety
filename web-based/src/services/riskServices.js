import api from "./api";

export const getRiskAnalyses = async () => {
    return await api.get("/risk");
};

export const getRiskAnalysis = async (id) => {
    return await api.get(`/risk/${id}`);
};

export const createRiskAnalysis = async (data) => {
    return await api.post("/risk", data);
};

export const updateRiskAnalysis = async (id, data) => {
    return await api.put(`/risk/${id}`, data);
};

export const deleteRiskAnalysis = async (id) => {
    return await api.delete(`/risk/${id}`);
};

export const evaluateRisk = async (batchId) => {
    return await api.post(`/risk/evaluate/${batchId}`);
};
