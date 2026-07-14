import { authApi } from '@/api/auth/auth.api';
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

export const useRegister = () => {
    return useMutation({ mutationFn: authApi.register });
};

export const useLogin = () => {
    return useMutation({ mutationFn: authApi.login });
};

export const useLogout = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => router.navigate({ to: '/login', replace: true }),
    });
};

export const useMe = () => {
    const setUser = useAuthStore((s) => s.setUser);

    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const user = await authApi.me();
            setUser(user);
            return user;
        },
        retry: false,
    });
};

export const useUpdateMe = () => {
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: authApi.updateMe,
        onSuccess: (user) => setUser(user),
    });
};
