
import api from "./api";

export const Login = async (data) => {
    return await api.post("/auth/login", data);
}

export const createUser = async (data) => {
  return await api.post("/auth/create-user", data);
};