import { createFileRoute, redirect } from '@tanstack/react-router';
import { checkAuth } from '@/utils/checkAuth';
import { ProfileView } from '@/views/Profile/ProfileView';

export const Route = createFileRoute('/profile')({
    beforeLoad: async () => {
        const user = await checkAuth();
        if (!user) {
            throw redirect({ to: '/login' });
        }
    },
    component: ProfileView,
});
