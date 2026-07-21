import type { FileRouteTypes } from '@/routeTree.gen';
import { Timer, ChartLine, Calendar, ListChecks } from 'lucide-react';

export type SidebarButtonDataType = {
    text: string;
    view: FileRouteTypes['to'];
    icon: React.ReactNode;
};

const ICON_SIZE = 18;

const sidebarButtonsData: SidebarButtonDataType[] = [
    {
        text: 'Sidebar.focus',
        view: '/dashboard/focus',
        icon: <Timer width={ICON_SIZE} height={ICON_SIZE} />,
    },
    {
        text: 'Sidebar.tasks',
        view: '/dashboard/tasks',
        icon: <ListChecks width={ICON_SIZE} height={ICON_SIZE} />,
    },
    {
        text: 'Sidebar.calendar',
        view: '/dashboard/calendar',
        icon: <Calendar width={ICON_SIZE} height={ICON_SIZE} />,
    },
    {
        text: 'Sidebar.overview',
        view: '/dashboard/overview',
        icon: <ChartLine width={ICON_SIZE} height={ICON_SIZE} />,
    },
];

export default sidebarButtonsData;
