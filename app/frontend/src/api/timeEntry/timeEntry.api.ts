import axios from 'axios';
import { apiClient } from '../client';
import { ApiError } from '../ApiError';
import type { TimeEntryData } from '@timedo/shared/src/schemas/timeEntrySchema';

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
};
