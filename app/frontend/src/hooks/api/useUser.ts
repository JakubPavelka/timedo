import { userApi } from '@/api/user/user.api';
import { useMutation } from '@tanstack/react-query';

export const useDeleteAccount = () => {
    return useMutation({ mutationFn: userApi.delete });
};
