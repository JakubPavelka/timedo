import { apiClient } from '../client';

export const profileApi = {
    logout: async () => {
        return await apiClient.post('/api/auth/logout');
    },
};
