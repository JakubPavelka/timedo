import { FocusStopwatch } from '@/components/features/Focus/FocusStopwatch/FocusStopwatch';
import {
    useCreateTimeEntry,
    useActiveTimeEntry,
    useStopTimeEntry,
    useGetTimeEntries,
    useDeleteTimeEntry,
} from '@/hooks/api/useTimeEntry';
import { useTimerMode } from '@/hooks/useTimerMode';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { FocusTimeEntryHistory } from '@/components/features/Focus/FocusTimeEntryHistory/FocusTimeEntryHistory';
import { mapTimeEntryToHistoryItem } from '@/utils/mapTimeEntryToHistoryItem';
import { FocusTaskDetail } from '@/components/features/Focus/FocusTaskDetail/FocusTaskDetail';
import styles from './FocusView.module.scss';

const PAGE_SIZE = 5;

export const FocusView = () => {
    const { t, i18n } = useTranslation();
    const timerMode = useTimerMode((s) => s.timerMode);
    const { mutate: createTimeEntry } = useCreateTimeEntry();
    const { mutate: stopTimeEntry } = useStopTimeEntry();
    const { mutateAsync: deleteTimeEntry } = useDeleteTimeEntry();
    const { data: activeEntry } = useActiveTimeEntry();
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(PAGE_SIZE);
    const { data: timeEntriesData } = useGetTimeEntries(limit, search || undefined);
    const isRunning = !!activeEntry;

    const timeEntryHistoryItems =
        timeEntriesData?.entries.map((entry) =>
            mapTimeEntryToHistoryItem(entry, t, i18n.language)
        ) ?? [];
    const hasMore = timeEntryHistoryItems.length < (timeEntriesData?.total ?? 0);

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        setLimit(PAGE_SIZE);
    }, []);

    const handleLoadMoreClick = () => setLimit((prev) => prev + PAGE_SIZE);

    const handleCreateTimeEntry = () => {
        return createTimeEntry(
            { type: timerMode },
            {
                onError: (err) =>
                    toast.error(getErrorMessage(err, 'Focus.startError', t)),
            }
        );
    };

    const handleStopTimeEntry = () => {
        return stopTimeEntry(undefined, {
            onError: (err) => toast.error(getErrorMessage(err, 'Focus.stopError', t)),
        });
    };

    const handleDeleteTimeEntry = async (id: string) => {
        try {
            await deleteTimeEntry(id);
            toast.success(t('Focus.timeEntryDeleteSuccess'));
        } catch (err) {
            toast.error(getErrorMessage(err, 'Focus.timeEntryDeleteError', t));
            throw err;
        }
    };

    return (
        <div className={styles.FocusView}>
            <div className={styles.FocusView__topWrapper}>
                <div className={styles.FocusView__stopwatchItem}>
                    <FocusStopwatch
                        onTrackClick={
                            isRunning ? handleStopTimeEntry : handleCreateTimeEntry
                        }
                        isRunning={isRunning}
                        startedAt={activeEntry?.startedAt}
                        plannedDuration={activeEntry?.plannedDuration}
                    />
                </div>
                <div className={styles.FocusView__taskDetailWrapper}>
                    <FocusTaskDetail
                        id={activeEntry?.id}
                        taskId={activeEntry?.taskId}
                        description={activeEntry?.description ?? undefined}
                    />
                </div>
            </div>
            <FocusTimeEntryHistory
                timeEntries={timeEntryHistoryItems}
                hasMore={hasMore}
                onSearchChange={handleSearchChange}
                onLoadMoreClick={handleLoadMoreClick}
                onDeleteClick={handleDeleteTimeEntry}
            />
        </div>
    );
};
