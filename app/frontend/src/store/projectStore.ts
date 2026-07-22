import { create } from 'zustand';

type Project = {
    id: string;
    label: string;
    color: string;
    _count: {
        tasks: number;
    };
};

type ProjectStore = {
    projects: Project[];
    setProjects: (projects: Project[]) => void;
};

export const useProjectStore = create<ProjectStore>()((set) => ({
    projects: [],
    setProjects: (projects) => set({ projects }),
}));
