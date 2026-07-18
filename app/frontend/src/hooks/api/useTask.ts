import { useMutation } from '@tanstack/react-query';
import { taskApi } from '@/api/task/task.api';

export const useCreateTask = () => {
    return useMutation({
        mutationFn: taskApi.createTask,
    });
};
