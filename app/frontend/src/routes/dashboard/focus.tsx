import { createFileRoute } from '@tanstack/react-router';
import { FocusView } from '@/views/Focus/FocusView';

export const Route = createFileRoute('/dashboard/focus')({
    component: FocusView,
});
