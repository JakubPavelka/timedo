import axios from "axios";
import { authApi } from "./auth/auth.api";

const baseURL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await authApi.refresh();
        return apiClient(originalRequest);
      } catch {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
