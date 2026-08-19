import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timeEntryApi } from '@/api/timeEntry/timeEntry.api';

export const useCreateTimeEntry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: timeEntryApi.createTimeEntry,
        onSuccess: (_, variables) => {
            if (variables.taskId) {
                queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
            }
        },
    });
};
