import { apiClient } from '../client';
import { ApiError } from '../ApiError';
import type {
    TaskChecklistData,
    UpdateTaskChecklistData,
    DeleteTaskChecklistData,
} from '@timedo/shared/src/schemas/taskChecklistSchema';
import axios from 'axios';

export const taskChecklistApi = {
    createChecklist: async (data: TaskChecklistData) => {
        try {
            const response = await apiClient.post('/api/task-checklist', data);
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    deleteChecklist: async (id: DeleteTaskChecklistData['id']) => {
        try {
            await apiClient.delete('/api/task-checklist', {
                data: { id },
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    updateChecklist: async (data: UpdateTaskChecklistData) => {
        try {
            const response = await apiClient.patch('/api/task-checklist', data);
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    readChecklist: async (taskId: string) => {
        try {
            const response = await apiClient.get('/api/task-checklist', {
                params: { taskId },
            });
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
};
