import { useMutation, useQuery } from '@tanstack/react-query';
import { taskApi } from '@/api/task/task.api';
import { useTaskStore } from '@/store/taskStore';

export const useCreateTask = () => {
    return useMutation({
        mutationFn: taskApi.createTask,
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
        queryFn: () => taskApi.getTask(taskId),
        retry: false,
    });
};
