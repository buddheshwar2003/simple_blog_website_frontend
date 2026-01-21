import api from "./api";

export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res;
};

export const logoutApi = async () => {
  await api.post("/auth/logout");
};
