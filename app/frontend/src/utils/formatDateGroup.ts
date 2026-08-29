import type { TFunction } from 'i18next';
import { DateTime } from 'luxon';

export const formatDateGroup = (startedAt: DateTime, t: TFunction) => {
    const now = DateTime.now();
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
