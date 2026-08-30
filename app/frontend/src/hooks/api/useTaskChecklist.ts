import { taskChecklistApi } from '@/api/taskChecklist/taskChecklist.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
    TaskChecklistData,
    UpdateTaskChecklistData,
    DeleteTaskChecklistData,
} from '@timedo/shared/src/schemas/taskChecklistSchema';
import { useQueryClient } from '@tanstack/react-query';

export const useCreateTaskChecklist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data }: { data: TaskChecklistData }) =>
            taskChecklistApi.createChecklist(data),
        onSuccess: (_, data) =>
            queryClient.invalidateQueries({
                queryKey: ['task-checklist', data.data.taskId],
            }),
    });
};

export const useUpdateTaskChecklist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data }: { data: UpdateTaskChecklistData }) =>
            taskChecklistApi.updateChecklist(data),
        onSuccess: (_, data) =>
            queryClient.invalidateQueries({
                queryKey: ['task-checklist', data.data.id],
            }),
    });
};

export const useDeleteTaskChecklist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: DeleteTaskChecklistData['id'] }) =>
            taskChecklistApi.deleteChecklist(id),
        onSuccess: (_, data) =>
            queryClient.invalidateQueries({
                queryKey: ['task-checklist', data],
            }),
    });
};

export const useReadTaskChecklist = (taskId: string | null | undefined) => {
    return useQuery({
        queryKey: ['task-checklist', taskId],
        queryFn: () => taskChecklistApi.readChecklist(taskId as string),
        enabled: !!taskId,
    });
};
