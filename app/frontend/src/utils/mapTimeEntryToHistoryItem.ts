import type { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import type { TimeEntryWithTask } from '@/api/timeEntry/timeEntry.api';
import type { FocusTimeEntryHistoryItemProps } from '@/components/features/Focus/FocusTimeEntryHistory/FocusTimeEntryHistoryItem';
import { formatDurationShort } from './formatDurationShort';

const formatDateGroup = (startedAt: DateTime, t: TFunction) => {
    const now = DateTime.now();
    console.log(now);
    const yesterday = now.minus({ days: 1 });

    if (startedAt.hasSame(now, 'day')) {
        return t('Focus.History.today');
    }

    if (startedAt.hasSame(yesterday, 'day')) {
        return t('Focus.History.yesterday');
    }

    return startedAt.toLocaleString({
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
    });
};

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
    };
};
