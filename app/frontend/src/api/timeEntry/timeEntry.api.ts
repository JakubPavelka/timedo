import axios from 'axios';
import { apiClient } from '../client';
import { ApiError } from '../ApiError';
import type { TimeEntryData } from '@timedo/shared/src/schemas/timeEntrySchema';

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
    getTimeEntries: async (): Promise<TimeEntryWithTask[]> => {
        try {
            const response = await apiClient.get('/api/time-entry/entries');
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
};
