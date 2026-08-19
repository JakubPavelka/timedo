import { create } from 'zustand';
import type { Project } from '@/store/projectStore';

type TaskFilterType = {
    project: Project | undefined;
    fullTextSearch: string | undefined;
    setFullTextSearch: (fullTextSearch: string) => void;
    setProject: (project: Project) => void;
};

export const useTaskFilter = create<TaskFilterType>()((set) => ({
    fullTextSearch: undefined,
    project: undefined,
    setFullTextSearch: (fullTextSearch: string) => set({ fullTextSearch }),
    setProject: (project: Project) => set({ project }),
}));
