import { create } from 'zustand';

export type Project = {
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
    updateProject: (project: Pick<Project, 'id' | 'label' | 'color'>) => void;
    deleteProject: (id: string) => void;
};

export const useProjectStore = create<ProjectStore>()((set) => ({
    projects: [],
    setProjects: (projects) => set({ projects }),
    updateProject: (project) =>
        set((state) => ({
            projects: state.projects.map((t) =>
                t.id === project.id ? { ...t, ...project } : t
            ),
        })),
    deleteProject: (id) =>
        set((state) => ({
            projects: state.projects.filter((t) => t.id !== id),
        })),
}));
