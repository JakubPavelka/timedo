import { createFileRoute } from '@tanstack/react-router';
import { ForgottenPasswordView } from '@/views/Auth/ForgottenPasswordView';

export const Route = createFileRoute('/forgotten-password')({
    component: ForgottenPasswordView,
});
