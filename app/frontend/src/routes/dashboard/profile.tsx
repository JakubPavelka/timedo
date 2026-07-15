import { createFileRoute } from '@tanstack/react-router';
import { ProfileView } from '@/views/Profile/ProfileView';

export const Route = createFileRoute('/dashboard/profile')({
    component: ProfileView,
});
