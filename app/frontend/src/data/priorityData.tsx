import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';

export const PRIORITY = [
    {
        label: 'Task.Priority.lowPriority',
        value: 'LOW',
        icon: <PriorityIcon level={'LOW'} />,
    },
    {
        label: 'Task.Priority.mediumPriority',
        value: 'MEDIUM',
        icon: <PriorityIcon level={'MEDIUM'} />,
    },
    {
        label: 'Task.Priority.highPriority',
        value: 'HIGH',
        icon: <PriorityIcon level={'HIGH'} />,
    },
];
