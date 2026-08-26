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

        let interval: ReturnType<typeof setInterval> | undefined;
        const msUntilNextSecond = 1000 - ((Date.now() - startTime) % 1000);
        const alignTimeout = setTimeout(() => {
            tick();
            interval = setInterval(tick, 1000);
        }, msUntilNextSecond);

        return () => {
            clearTimeout(alignTimeout);
            clearInterval(interval);
        };
    }, [startedAt, isRunning]);

    return isRunning ? elapsedSeconds : 0;
};
