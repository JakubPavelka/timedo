import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { NotFoundView } from './views/NotFound/NotFoundView';

export const router = createRouter({
    routeTree,
    defaultNotFoundComponent: NotFoundView,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
