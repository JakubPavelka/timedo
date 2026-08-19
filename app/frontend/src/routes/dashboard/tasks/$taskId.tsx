import { createFileRoute } from '@tanstack/react-router';
import { TaskDetailView } from '@/views/Task/TaskDetailView';

export const Route = createFileRoute('/dashboard/tasks/$taskId')({
    component: TaskDetailView,
});
