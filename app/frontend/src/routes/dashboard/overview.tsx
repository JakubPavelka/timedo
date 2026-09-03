import { createFileRoute } from '@tanstack/react-router';
import { OverviewView } from '@/views/Overview/OverviewView';

export const Route = createFileRoute('/dashboard/overview')({
    component: OverviewView,
});
