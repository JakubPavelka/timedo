import { create } from 'zustand';
import type { Project } from '@/store/projectStore';

type Status = 'TODO' | 'DONE' | 'ACTIVE' | undefined;
type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

type TaskFilterType = {
    status: Status | undefined;
    priority: Priority[] | undefined;
    project: Project | undefined;
    fullTextSearch: string | undefined;
    setStatus: (status: Status) => void;
    setFullTextSearch: (fullTextSearch: string) => void;
    setPriority: (priority: Priority[]) => void;
    setProject: (project: Project) => void;
};

export const useTaskFilter = create<TaskFilterType>()((set) => ({
    status: undefined,
    fullTextSearch: undefined,
    priority: [],
    project: undefined,
    setStatus: (status: Status) => set({ status }),
    setFullTextSearch: (fullTextSearch: string) => set({ fullTextSearch }),
    setPriority: (priority: Priority[]) => set({ priority }),
    setProject: (project: Project) => set({ project }),
}));
