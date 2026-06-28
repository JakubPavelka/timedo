import axios from 'axios';
import { authApi } from './auth/auth.api';

const baseURL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthError =
            error.response?.status === 401 ||
            error.response?.data?.code === 'TOKEN_EXPIRED';
        const isRefreshRequest = originalRequest?.url?.includes(
            '/api/auth/refresh'
        );

        if (isAuthError && !isRefreshRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await authApi.refresh();
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
