import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { TaskView } from '@/views/Task/TaskView';

export const Route = createFileRoute('/dashboard/tasks/')({
    validateSearch: z.object({
        priority: z.string().optional(),
        status: z.string().optional(),
        project: z.string().optional(),
        search: z.string().optional(),
    }),
    component: TaskView,
});
