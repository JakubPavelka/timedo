import axios from 'axios';
import { apiClient } from '../client';
import { ApiError } from '../ApiError';
import type {
    TimeEntryData,
    UpdateTimeEntryData,
} from '@timedo/shared/src/schemas/timeEntrySchema';

export type TimeEntryWithTask = {
    id: string;
    taskId: string | null;
    description: string | null;
    startedAt: string;
    endedAt: string | null;
    duration: number | null;
    task: {
        title: string;
        project: { label: string; color: string } | null;
    } | null;
};

export const timeEntryApi = {
    createTimeEntry: async (data: TimeEntryData) => {
        try {
            const response = await apiClient.post('/api/time-entry/start', data);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    stopTimeEntry: async () => {
        try {
            const response = await apiClient.post('/api/time-entry/stop');
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    updateTimeEntry: async (data: UpdateTimeEntryData) => {
        try {
            const response = await apiClient.patch('/api/time-entry', data);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    getActiveTimeEntry: async () => {
        try {
            const response = await apiClient.get('/api/time-entry/active');
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    getTimeEntries: async (
        limit: number,
        search?: string
    ): Promise<{ entries: TimeEntryWithTask[]; total: number }> => {
        try {
            const response = await apiClient.get('/api/time-entry/entries', {
                params: { limit, search },
            });
            return { entries: response.data.data, total: response.data.total as number };
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    deleteTimeEntry: async (id: string) => {
        try {
            const response = await apiClient.delete('/api/time-entry', { data: { id } });
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
};
