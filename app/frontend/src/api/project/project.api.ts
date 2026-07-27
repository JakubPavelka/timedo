import { apiClient } from '../client';
import type { ProjectData } from '@timedo/shared/src/schemas/projectSchema';
import axios from 'axios';
import { ApiError } from '../ApiError';

export const projectApi = {
    createProject: async (data: ProjectData) => {
        try {
            const response = await apiClient.post('/api/project', data);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(
                    err.response?.data?.code ?? 'UNKNOWN_ERROR'
                );
            }
            throw err;
        }
    },
    getProjects: async () => {
        try {
            const response = await apiClient.get('/api/project');
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(
                    err.response?.data?.code ?? 'UNKNOWN_ERROR'
                );
            }
            throw err;
        }
    },
};
