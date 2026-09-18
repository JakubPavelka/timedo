import { createFileRoute } from '@tanstack/react-router';
import { RegisterView } from '@/views/Auth/RegisterView';

export const Route = createFileRoute('/forgotten-password')({
    component: RegisterView,
});
