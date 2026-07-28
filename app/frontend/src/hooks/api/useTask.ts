import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/api/task/task.api';
import { useTaskStore, type Task } from '@/store/taskStore';

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

export const useGetTasks = (limit: string, offset: string) => {
    const setTasks = useTaskStore((s) => s.setTasks);

    return useQuery({
        queryKey: ['tasks', limit, offset],
        queryFn: async () => {
            const tasks = await taskApi.getTasks(limit, offset);
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
