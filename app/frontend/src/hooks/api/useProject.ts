import { projectApi } from '@/api/project/project.api';
import { useMutation } from '@tanstack/react-query';

export const useCreateProject = () => {
    return useMutation({
        mutationFn: projectApi.createProject,
    });
};
