import axios from "axios";
import { store } from "../store/store";
import { setCredentials, clearAuth } from "../store/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8080", // Spring Boot
  withCredentials: true, // 🔴 REQUIRED
});

// REQUEST MIDDLEWARE
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE MIDDLEWARE
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");

        store.dispatch(
          setCredentials({
            accessToken: res.data.access_token,
            user: res.data.access_token,
          })
        );

        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;

        return api(originalRequest);
      } catch (err) {
        store.dispatch(clearAuth());
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
  }
);

export default api;
