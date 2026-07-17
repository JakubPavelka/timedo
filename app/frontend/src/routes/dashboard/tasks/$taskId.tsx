import { createFileRoute } from '@tanstack/react-router';
import { TaskView } from '@/views/Task/TaskView';

export const Route = createFileRoute('/dashboard/tasks/$taskId')({
    component: TaskView,
});
