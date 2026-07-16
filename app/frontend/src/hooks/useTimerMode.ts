import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TimerMode = 'stopwatch' | 'pomodoro';

type TimerModeStore = {
    timerMode: TimerMode;
    setTimerMode: (mode: TimerMode) => void;
};

export const useTimerMode = create<TimerModeStore>()(
    persist(
        (set) => ({
            timerMode: 'stopwatch',
            setTimerMode: (mode) => set({ timerMode: mode }),
        }),
        { name: 'timerMode' }
    )
);
