import { apiClient } from '../client';

export const userApi = {
    delete: async () => {
        return await apiClient.delete('/api/user/me');
    },
};
