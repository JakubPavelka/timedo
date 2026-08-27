import { create } from 'zustand';

export type Tag = {
    id: string;
    label: string;
    color: string;
    _count: {
        tasks: number;
    };
};

type TagStore = {
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
    updateTag: (tag: Pick<Tag, 'id' | 'label' | 'color'>) => void;
};

export const useTagStore = create<TagStore>()((set) => ({
    tags: [],
    setTags: (tags) => set({ tags }),
    updateTag: (tag) =>
        set((state) => ({
            tags: state.tags.map((t) => (t.id === tag.id ? { ...t, ...tag } : t)),
        })),
}));
