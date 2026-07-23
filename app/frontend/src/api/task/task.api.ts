import axios from 'axios';
import { apiClient } from '../client';
import { ApiAuthError } from '../auth/auth.api';
import type { TaskData } from '@timedo/shared/src/schemas/taskSchema';

export const taskApi = {
    createTask: async (data: TaskData) => {
        try {
            const response = await apiClient.post('/api/task', data);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiAuthError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    getTasks: async (limit: string, offset: string) => {
        try {
            const response = await apiClient.get('/api/task', {
                params: { limit, offset },
            });
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiAuthError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    getTask: async (taskId: string) => {
        try {
            const response = await apiClient.get(`/api/task/${taskId}`);
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiAuthError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
};
