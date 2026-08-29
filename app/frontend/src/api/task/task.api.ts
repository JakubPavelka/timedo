import axios from 'axios';
import { apiClient } from '../client';
import { ApiError } from '../ApiError';
import type {
    TaskData,
    UpdateTaskData,
    UpdateTasksData,
} from '@timedo/shared/src/schemas/taskSchema';

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
        limit: number,
        offset: number,
        priority: string[] | undefined,
        status: string | undefined,
        project: string[] | undefined,
        search: string | undefined,
        tag: string[] | undefined
    ) => {
        try {
            const response = await apiClient.get('/api/task', {
                params: { limit, offset, priority, status, project, search, tag },
            });
            return { tasks: response.data.data, total: response.data.total as number };
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
    updateTask: async (taskId: string, data: UpdateTaskData) => {
        try {
            const response = await apiClient.patch(`/api/task/${taskId}`, data);
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    deleteTask: async (taskId: string) => {
        try {
            await apiClient.delete(`/api/task/${taskId}`);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    deleteTasks: async (taskIds: string[]) => {
        try {
            await apiClient.delete('/api/task', { data: { taskIds } });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    updateTasks: async (taskIds: string[], data: Omit<UpdateTasksData, 'taskIds'>) => {
        try {
            await apiClient.patch('/api/task', { taskIds, ...data });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
};
