import { apiClient } from '../client';
import type {
    ProjectData,
    UpdateProjectData,
} from '@timedo/shared/src/schemas/projectSchema';
import type { Project } from '@/store/projectStore';
import axios from 'axios';
import { ApiError } from '../ApiError';

export type ProjectWithTasks = Omit<Project, '_count'> & {
    tasksDone: number;
    totalTasks: number;
    duration: number;
};

export const projectApi = {
    createProject: async (data: ProjectData) => {
        try {
            const response = await apiClient.post('/api/project', data);
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
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
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    getProjectsWithTasks: async () => {
        try {
            const response = await apiClient.get<{ data: ProjectWithTasks[] }>(
                '/api/project/with-tasks'
            );
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    updateProject: async (data: UpdateProjectData) => {
        try {
            const response = await apiClient.patch<{
                data: Pick<Project, 'id' | 'label' | 'color'>;
            }>('/api/project', data);
            return response.data.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new ApiError(err.response?.data?.code ?? 'UNKNOWN_ERROR');
            }
            throw err;
        }
    },
    deleteProject: async (tagId: string) => {
        try {
            await apiClient.delete('/api/project', {
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
