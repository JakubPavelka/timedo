import { createFileRoute } from '@tanstack/react-router';
import { CalendarView } from '@/views/Calendar/CalendarView';

export const Route = createFileRoute('/dashboard/calendar')({
    component: CalendarView,
});
