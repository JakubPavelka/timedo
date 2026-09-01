import { useSyncExternalStore } from 'react';

const subscribe = (query: string) => (callback: () => void) => {
    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener('change', callback);

    return () => mediaQueryList.removeEventListener('change', callback);
};

export const useMediaQuery = (query: string) => {
    return useSyncExternalStore(
        subscribe(query),
        () => window.matchMedia(query).matches,
        () => false
    );
};
