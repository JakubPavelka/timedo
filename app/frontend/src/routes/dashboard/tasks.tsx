import { createFileRoute } from '@tanstack/react-router';
import { DashboardView } from '@/views/Dashboard/DashboardView';

export const Route = createFileRoute('/dashboard/tasks')({
    component: DashboardView,
});
