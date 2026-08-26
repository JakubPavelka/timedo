import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/api/task/task.api';
import { useTaskStore, type Task } from '@/store/taskStore';
import type {
    UpdateTaskData,
    UpdateTasksData,
} from '@timedo/shared/src/schemas/taskSchema';

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: taskApi.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useGetTasks = (
    limit: number,
    offset: number,
    priority: string[] | undefined,
    status: string | undefined,
    project: string[] | undefined,
    search: string | undefined
) => {
    const setTasks = useTaskStore((s) => s.setTasks);

    return useQuery({
        queryKey: ['tasks', limit, offset, priority, status, project, search],
        queryFn: async () => {
            const { tasks, total } = await taskApi.getTasks(
                limit,
                offset,
                priority,
                status,
                project,
                search
            );
            setTasks(tasks);
            return { tasks, total };
        },
        retry: false,
    });
};

export const useGetTask = (taskId: string | null | undefined) => {
    return useQuery({
        queryKey: ['task', taskId],
        queryFn: (): Promise<Task> => taskApi.getTask(taskId as string),
        enabled: !!taskId,
        retry: false,
    });
};

export const useUpdateTask = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTaskData) => taskApi.updateTask(taskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['task', taskId] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useDeleteTask = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => taskApi.deleteTask(taskId),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['task', taskId] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useDeleteTasks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskIds: string[]) => taskApi.deleteTasks(taskIds),
        onSuccess: (_, taskIds) => {
            taskIds.forEach((taskId) =>
                queryClient.removeQueries({ queryKey: ['task', taskId] })
            );
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

export const useUpdateTasks = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            taskIds,
            data,
        }: {
            taskIds: string[];
            data: Omit<UpdateTasksData, 'taskIds'>;
        }) => taskApi.updateTasks(taskIds, data),
        onSuccess: (_, { taskIds }) => {
            taskIds.forEach((taskId) =>
                queryClient.invalidateQueries({ queryKey: ['task', taskId] })
            );
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};
