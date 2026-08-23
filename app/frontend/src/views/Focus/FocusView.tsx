import { FocusStopwatch } from '@/components/features/Focus/FocusStopwatch/FocusStopwatch';
import {
    useCreateTimeEntry,
    useActiveTimeEntry,
    useStopTimeEntry,
    useGetTimeEntries,
} from '@/hooks/api/useTimeEntry';
import { useTimerMode } from '@/hooks/useTimerMode';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { toast } from 'sonner';
import styles from './FocusView.module.scss';
import { FocusTimeEntryHistory } from '@/components/features/Focus/FocusTimeEntryHistory/FocusTimeEntryHistory';
import { mapTimeEntryToHistoryItem } from '@/utils/mapTimeEntryToHistoryItem';

export const FocusView = () => {
    const { t, i18n } = useTranslation();
    const timerMode = useTimerMode((s) => s.timerMode);
    const { mutate: createTimeEntry } = useCreateTimeEntry();
    const { mutate: stopTimeEntry } = useStopTimeEntry();
    const { data: activeEntry } = useActiveTimeEntry();
    const { data: allTimeEntries } = useGetTimeEntries();
    const isRunning = !!activeEntry;

    const timeEntryHistoryItems =
        allTimeEntries?.map((entry) =>
            mapTimeEntryToHistoryItem(entry, t, i18n.language)
        ) ?? [];

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

    return (
        <div className={styles.FocusView}>
            <div className={styles.FocusView__stopwatchWrapper}>
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
            </div>
            <FocusTimeEntryHistory timeEntries={timeEntryHistoryItems} />
        </div>
    );
};
