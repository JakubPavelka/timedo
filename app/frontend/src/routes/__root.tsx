import { createRootRoute, Outlet } from '@tanstack/react-router';
import { NotFoundView } from '@/views/NotFound/NotFoundView';

export const Route = createRootRoute({
    component: () => <Outlet />,
    notFoundComponent: NotFoundView,
});
