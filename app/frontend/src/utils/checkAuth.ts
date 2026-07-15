import { authApi } from '@/api/auth/auth.api';
import { useAuthStore } from '@/store/authStore';

export const checkAuth = async () => {
    const storeUser = useAuthStore.getState().user;

    if (storeUser) {
        return storeUser;
    }

    try {
        const user = await authApi.me();
        useAuthStore.getState().setUser(user);
        return user;
    } catch {
        return null;
    }
};
