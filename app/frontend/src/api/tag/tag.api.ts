import { apiClient } from '../client';
import type { TagData } from '@timedo/shared/src/schemas/tagsSchema';
import type { Tag } from '@/store/tagStore';
import axios from 'axios';
import { ApiError } from '../ApiError';

export type TagWithTasks = Tag & {
    tasksDone: number;
    totalTasks: number;
    duration: number;
};

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
            const response = await apiClient.get<{ data: Tag[] }>('/api/tag');
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    getTagsWithTasks: async () => {
        try {
            const response = await apiClient.get<{ data: TagWithTasks[] }>(
                '/api/tag/with-tasks'
            );
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
};
