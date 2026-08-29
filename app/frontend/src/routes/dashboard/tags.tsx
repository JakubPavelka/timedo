import { TagsView } from '@/views/Tags/TagsView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/tags')({
    component: TagsView,
});
