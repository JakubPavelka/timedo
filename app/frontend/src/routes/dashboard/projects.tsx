import { ProjectsView } from '@/views/Projects/ProjectsView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/projects')({
    component: ProjectsView,
});
