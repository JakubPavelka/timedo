import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timeEntryApi } from '@/api/timeEntry/timeEntry.api';

export const useActiveTimeEntry = () =>
    useQuery({
        queryKey: ['activeTimeEntry'],
        queryFn: timeEntryApi.getActiveTimeEntry,
    });

export const useCreateTimeEntry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: timeEntryApi.createTimeEntry,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['activeTimeEntry'] });
            if (variables.taskId) {
                queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
                queryClient.invalidateQueries({ queryKey: ['tasks'] });
            }
        },
    });
};

export const useStopTimeEntry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: timeEntryApi.stopTimeEntry,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['activeTimeEntry'] });
            if (response.data.taskId) {
                queryClient.invalidateQueries({
                    queryKey: ['task', response.data.taskId],
                });
                queryClient.invalidateQueries({ queryKey: ['tasks'] });
            }
        },
    });
};
