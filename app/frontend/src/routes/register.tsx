import { createFileRoute, redirect } from '@tanstack/react-router';
import { RegisterView } from '@/views/auth/RegisterView';
import { checkAuth } from '@/utils/checkAuth';

export const Route = createFileRoute('/register')({
    beforeLoad: async () => {
        const user = await checkAuth();
        if (user) {
            throw redirect({ to: '/dashboard/focus' });
        }
    },
    component: RegisterView,
});
