import { tagApi } from '@/api/tag/tag.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTagStore } from '@/store/tagStore';

export const useCreateTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tagApi.createTag,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
    });
};

export const useGetTags = () => {
    const setTags = useTagStore((s) => s.setTags);

    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const tags = await tagApi.getTags();
            setTags(tags);
            return tags;
        },
        retry: false,
    });
};

export const useGetTagsWithTasks = () => {
    return useQuery({
        queryKey: ['tags', 'with-tasks'],
        queryFn: tagApi.getTagsWithTasks,
        retry: false,
    });
};
