import type { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import type { TimeEntryWithTask } from '@/api/timeEntry/timeEntry.api';
import type { FocusTimeEntryHistoryItemProps } from '@/components/features/Focus/FocusTimeEntryHistory/FocusTimeEntryHistoryItem';
import { formatDurationShort } from './formatDurationShort';
import { formatDateGroup } from './formatDateGroup';

export const mapTimeEntryToHistoryItem = (
    entry: TimeEntryWithTask,
    t: TFunction,
    locale: string
): FocusTimeEntryHistoryItemProps => {
    const startedAt = DateTime.fromISO(entry.startedAt, { locale, zone: 'local' });

    return {
        id: entry.id,
        taskId: entry.taskId ?? undefined,
        title: entry.task?.title,
        description: entry.description ?? undefined,
        project: entry.task?.project ?? undefined,
        date: formatDateGroup(startedAt, t),
        timeStartedAt: startedAt.toLocaleString(DateTime.TIME_SIMPLE),
        timeTracked: `+${formatDurationShort(entry.duration ?? 0)}`,
        taskTotalTime: entry.task
            ? formatDurationShort(entry.task.workedTime)
            : undefined,
        taskEstimatedTime: entry.task?.estimatedTime
            ? formatDurationShort(entry.task.estimatedTime)
            : undefined,
    };
};
