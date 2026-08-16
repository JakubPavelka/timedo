import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/api/task/task.api';
import { useTaskStore, type Task } from '@/store/taskStore';
import type { UpdateTaskData } from '@timedo/shared/src/schemas/taskSchema';

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
    limit: string,
    offset: string,
    priority: string[] | undefined,
    status: string | undefined,
    project: string[] | undefined,
    search: string | undefined
) => {
    const setTasks = useTaskStore((s) => s.setTasks);

    return useQuery({
        queryKey: ['tasks', limit, offset, priority, status, project, search],
        queryFn: async () => {
            const tasks = await taskApi.getTasks(
                limit,
                offset,
                priority,
                status,
                project,
                search
            );
            setTasks(tasks);
            return tasks;
        },
        retry: false,
    });
};

export const useGetTask = (taskId: string) => {
    return useQuery({
        queryKey: ['task', taskId],
        queryFn: (): Promise<Task> => taskApi.getTask(taskId),
        retry: false,
    });
};

export const useUpdateTask = (taskId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTaskData) => taskApi.updateTask(taskId, data),
        onSuccess: (updated) => {
            queryClient.setQueryData(['task', taskId], updated);
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
