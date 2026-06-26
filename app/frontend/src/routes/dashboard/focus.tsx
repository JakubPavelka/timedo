import { createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardView } from '@/views/Dashboard/DashboardView';
import { checkAuth } from '@/utils/checkAuth';

export const Route = createFileRoute('/dashboard/focus')({
    beforeLoad: async () => {
        const user = await checkAuth();
        if (!user) {
            throw redirect({ to: '/login' });
        }
    },
    component: DashboardView,
});
