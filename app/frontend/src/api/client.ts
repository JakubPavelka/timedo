import axios from 'axios';
import { authApi } from './auth/auth.api';
import { useAuthStore } from '@/store/authStore';
import { router } from '@/router';

const baseURL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let refreshPromise: ReturnType<typeof authApi.refresh> | null = null;

const publicRoutes = ['/login', '/register'];

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthError =
            error.response?.status === 401 ||
            error.response?.data?.code === 'TOKEN_EXPIRED';
        const authNoRetryRoutes = [
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/refresh',
            '/api/auth/logout',
        ];
        const isAuthRoute = authNoRetryRoutes.some((r) =>
            originalRequest?.url?.includes(r)
        );

        if (isAuthError && !isAuthRoute && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                refreshPromise ??= authApi.refresh().finally(() => {
                    refreshPromise = null;
                });
                await refreshPromise;
                return apiClient(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().setUser(null);
                if (!publicRoutes.includes(router.state.location.pathname)) {
                    router.navigate({ to: '/login', replace: true });
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
