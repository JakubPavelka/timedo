import { useEffect, useState } from 'react';

export const useDelayedPending = (isPending: boolean, delay = 150): boolean => {
    const [delayElapsed, setDelayElapsed] = useState(false);

    useEffect(() => {
        if (!isPending) {
            return;
        }

        const timeout = setTimeout(() => setDelayElapsed(true), delay);
        return () => {
            clearTimeout(timeout);
            setDelayElapsed(false);
        };
    }, [isPending, delay]);

    return isPending && delayElapsed;
};
