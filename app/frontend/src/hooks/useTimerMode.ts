import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TimerMode = 'STOPWATCH' | 'POMODORO';

type TimerModeStore = {
    timerMode: TimerMode;
    setTimerMode: (mode: TimerMode) => void;
};

export const useTimerMode = create<TimerModeStore>()(
    persist(
        (set) => ({
            timerMode: 'STOPWATCH',
            setTimerMode: (mode) => set({ timerMode: mode }),
        }),
        { name: 'timerMode' }
    )
);
