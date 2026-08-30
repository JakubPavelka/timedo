import { taskChecklistApi } from '@/api/taskChecklist/taskChecklist.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
    TaskChecklistData,
    UpdateTaskChecklistData,
    DeleteTaskChecklistData,
} from '@timedo/shared/src/schemas/taskChecklistSchema';
import { useQueryClient } from '@tanstack/react-query';

export const useCreateTaskChecklist = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<TaskChecklistData, 'taskId'>) =>
            taskChecklistApi.createChecklist({ ...data, taskId }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['task-checklist', taskId] }),
    });
};

export const useUpdateTaskChecklist = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTaskChecklistData) =>
            taskChecklistApi.updateChecklist(data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['task-checklist', taskId] }),
    });
};

export const useDeleteTaskChecklist = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: DeleteTaskChecklistData['id']) =>
            taskChecklistApi.deleteChecklist(id),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['task-checklist', taskId] }),
    });
};

export const useReadTaskChecklist = (taskId: string | null | undefined) => {
    return useQuery({
        queryKey: ['task-checklist', taskId],
        queryFn: () => taskChecklistApi.readChecklist(taskId as string),
        enabled: !!taskId,
    });
};
