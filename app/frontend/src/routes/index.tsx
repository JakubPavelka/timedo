import { createFileRoute, redirect } from '@tanstack/react-router';
import { checkAuth } from '@/utils/checkAuth';

export const Route = createFileRoute('/')({
    beforeLoad: async () => {
        const user = await checkAuth();
        throw redirect({ to: user ? '/dashboard/focus' : '/login' });
    },
});
