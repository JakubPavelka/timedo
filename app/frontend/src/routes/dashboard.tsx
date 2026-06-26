import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { checkAuth } from '@/utils/checkAuth';
import { Sidebar } from '@/components/features/Sidebar/Sidebar';
import sidebarButtonsData from '@/data/sidebarButtonsData';

export const Route = createFileRoute('/dashboard')({
    beforeLoad: async () => {
        const user = await checkAuth();
        if (!user) {
            throw redirect({ to: '/login' });
        }
    },
    component: () => {
        return (
            <div>
                <Sidebar buttons={sidebarButtonsData} projects={[]} />
                <Outlet />
            </div>
        );
    },
});
