import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { NotFoundView } from './views/NotFound/NotFoundView';
import { hideSplash } from './utils/hideSplash';

export const router = createRouter({
    routeTree,
    defaultNotFoundComponent: NotFoundView,
});

const unsubscribeSplash = router.subscribe('onResolved', () => {
    const isDashboard = router.state.matches.some((m) => m.routeId === '/dashboard');
    if (!isDashboard) {
        hideSplash();
    }
    unsubscribeSplash();
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
