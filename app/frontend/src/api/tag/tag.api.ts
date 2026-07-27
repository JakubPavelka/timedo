import { apiClient } from '../client';
import type { TagData } from '@timedo/shared/src/schemas/tagsSchema';
import axios from 'axios';
import { ApiError } from '../ApiError';

export const tagApi = {
    createTag: async (data: TagData) => {
        try {
            const response = await apiClient.post('/api/tag', data);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    getTags: async () => {
        try {
            const response = await apiClient.get('/api/tag');
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
};
