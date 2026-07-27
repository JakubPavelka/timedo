import { apiClient } from '../client';
import axios from 'axios';
import type {
    LoginData,
    RegisterData,
} from '@timedo/shared/src/schemas/authSchema';
import type { ProfileData } from '@timedo/shared/src/schemas/profileSchema';
import { ApiError } from '../ApiError';

export const authApi = {
    register: async (
        data: Omit<RegisterData, 'passwordAgain'>
    ): Promise<unknown> => {
        try {
            const response = await apiClient.post('/api/auth/register', data);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(
                    err.response?.data?.code ?? 'UNKNOWN_ERROR'
                );
            }
            throw err;
        }
    },

    login: async (data: LoginData): Promise<unknown> => {
        try {
            const response = await apiClient.post('/api/auth/login', data);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(
                    err.response?.data?.code ?? 'UNKNOWN_ERROR'
                );
            }
            throw err;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/api/auth/logout');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(
                    err.response?.data?.code ?? 'UNKNOWN_ERROR'
                );
            }
            throw err;
        }
    },

    refresh: async (): Promise<void> => {
        await apiClient.post('/api/auth/refresh');
    },

    me: async (): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string | null;
    }> => {
        const response = await apiClient.get('/api/auth/me');
        return response.data.data.user;
    },

    updateMe: async (
        data: ProfileData
    ): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string | null;
    }> => {
        try {
            const response = await apiClient.put('/api/auth/me', data);
            return response.data.data.user;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(
                    err.response?.data?.code ?? 'UNKNOWN_ERROR'
                );
            }
            throw err;
        }
    },
};
