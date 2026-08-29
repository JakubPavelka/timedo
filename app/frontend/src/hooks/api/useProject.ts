import { projectApi } from '@/api/project/project.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectStore } from '@/store/projectStore';

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectApi.createProject,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
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

export const useGetProjectsWithTasks = () => {
    return useQuery({
        queryKey: ['projects', 'with-tasks'],
        queryFn: projectApi.getProjectsWithTasks,
        retry: false,
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    const updateProject = useProjectStore((s) => s.updateProject);

    return useMutation({
        mutationFn: projectApi.updateProject,
        onSuccess: (data) => {
            updateProject(data);
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task'] });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    const deleteProject = useProjectStore((s) => s.deleteProject);

    return useMutation({
        mutationFn: (projectId: string) => projectApi.deleteProject(projectId),
        onSuccess: (_, projectId) => {
            deleteProject(projectId);
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task'] });
        },
    });
};
