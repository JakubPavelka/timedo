import { projectApi } from '@/api/project/project.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectStore } from '@/store/projectStore';

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectApi.createProject,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });
};

export const useGetProjects = () => {
    const setProjects = useProjectStore((s) => s.setProjects);

    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const projects = await projectApi.getProjects();
            setProjects(projects);
            return projects;
        },
        retry: false,
    });
};
