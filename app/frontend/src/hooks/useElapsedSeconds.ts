import { useEffect, useState } from 'react';

export const useElapsedSeconds = (
    startedAt: string | Date | undefined,
    isRunning: boolean
) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (!isRunning || !startedAt) {
            return;
        }

        const startTime = new Date(startedAt).getTime();
        const tick = () => setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [startedAt, isRunning]);

    return elapsedSeconds;
};
