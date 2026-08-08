import axios from 'axios';
import { apiClient } from '../client';
import { ApiError } from '../ApiError';
import type { TaskData } from '@timedo/shared/src/schemas/taskSchema';

export const taskApi = {
    createTask: async (data: TaskData) => {
        try {
            const response = await apiClient.post('/api/task', data);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    getTasks: async (
        limit: string,
        offset: string,
        priority: string[] | undefined,
        status: string | undefined,
        project: string[] | undefined,
        search: string | undefined
    ) => {
        try {
            const response = await apiClient.get('/api/task', {
                params: { limit, offset, priority, status, project, search },
            });
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
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
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
};
