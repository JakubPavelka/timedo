import type { FileRouteTypes } from '@/routeTree.gen';
import { Timer, ChartLine, Calendar, ListChecks } from 'lucide-react';

type SidebarButtonDataType = {
    text: string;
    view: FileRouteTypes['fullPaths'];
    icon: React.ReactNode;
};

const ICON_SIZE = 18;

const sidebarButtonsData = [
    {
        text: 'Focus',
        view: 'xd',
        icon: <Timer width={ICON_SIZE} height={ICON_SIZE} />,
    },
    {
        text: 'Ukoly',
        view: 'xdd',
        icon: <ListChecks width={ICON_SIZE} height={ICON_SIZE} />,
    },
    {
        text: 'KAl',
        view: 'xdd',
        icon: <Calendar width={ICON_SIZE} height={ICON_SIZE} />,
    },
    {
        text: 'Prehl',
        view: 'xdd',
        icon: <ChartLine width={ICON_SIZE} height={ICON_SIZE} />,
    },
];

export default sidebarButtonsData;
