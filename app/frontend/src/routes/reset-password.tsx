import { createFileRoute } from '@tanstack/react-router';
import { ResetPasswordView } from '@/views/Auth/ResetPasswordView';

export const Route = createFileRoute('/reset-password')({
    component: ResetPasswordView,
});
