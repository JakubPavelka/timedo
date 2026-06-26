import { createFileRoute, redirect } from '@tanstack/react-router';
import { checkAuth } from '@/utils/checkAuth';
import { DashboardLayout } from '@/components/features/DashboardLayout/DashboardLayout';

export const Route = createFileRoute('/dashboard')({
    beforeLoad: async () => {
        const user = await checkAuth();
        if (!user) {
            throw redirect({ to: '/login' });
        }
    },
    component: DashboardLayout,
});
