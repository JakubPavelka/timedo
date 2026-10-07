import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SidebarSectionsStore = {
    areProjectsOpen: boolean;
    areTagsOpen: boolean;
    toggleProjects: () => void;
    toggleTags: () => void;
};

export const useSidebarSections = create<SidebarSectionsStore>()(
    persist(
        (set, get) => ({
            areProjectsOpen: true,
            areTagsOpen: true,
            toggleProjects: () => set({ areProjectsOpen: !get().areProjectsOpen }),
            toggleTags: () => set({ areTagsOpen: !get().areTagsOpen }),
        }),
        { name: 'sidebarSections' }
    )
);
