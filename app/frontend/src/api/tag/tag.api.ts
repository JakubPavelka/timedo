import { apiClient } from '../client';
import type { TagData, UpdateTagData } from '@timedo/shared/src/schemas/tagsSchema';
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
    updateTag: async (data: UpdateTagData) => {
        try {
            const response = await apiClient.patch<{
                data: Pick<Tag, 'id' | 'label' | 'color'>;
            }>('/api/tag', data);
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    deleteTag: async (tagId: string) => {
        try {
            await apiClient.delete('/api/tag', {
                data: { id: tagId },
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
};
