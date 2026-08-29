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
    deleteTag: (id: string) => void;
};

export const useTagStore = create<TagStore>()((set) => ({
    tags: [],
    setTags: (tags) => set({ tags }),
    updateTag: (tag) =>
        set((state) => ({
            tags: state.tags.map((t) => (t.id === tag.id ? { ...t, ...tag } : t)),
        })),
    deleteTag: (id) =>
        set((state) => ({
            tags: state.tags.filter((t) => t.id !== id),
        })),
}));
