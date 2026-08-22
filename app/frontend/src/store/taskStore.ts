import { create } from 'zustand';
import type { Status, Priority } from '@timedo/shared/src/schemas/taskSchema';

export type Task = {
    id: string;
    title: string;
    description: string | null;
    status: Status;
    priority: Priority;
    isTracked: boolean;
    project: {
        id: string;
        label: string;
        color: string;
    } | null;
    tags: {
        id: string;
        label: string;
        color: string;
    }[];
    links: {
        id: string;
        label: string;
        url: string;
    }[];
    workedTime: number;
};

type TaskStore = {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<TaskStore>()((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
}));
