import { create } from 'zustand';

export type Tag = {
    id: string;
    label: string;
    color: string;
};

type TagStore = {
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
};

export const useTagStore = create<TagStore>()((set) => ({
    tags: [],
    setTags: (tags) => set({ tags }),
}));
