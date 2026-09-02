import { createFileRoute } from '@tanstack/react-router';
import { PrivacyPolicyView } from '@/views/Legal/PrivacyPolicyView';

export const Route = createFileRoute('/privacy-policy')({
    component: PrivacyPolicyView,
});
