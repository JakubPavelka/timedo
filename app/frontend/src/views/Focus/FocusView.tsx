import {
    useCreateTimeEntry,
    useActiveTimeEntry,
    useStopTimeEntry,
    useGetTimeEntries,
    useDeleteTimeEntry,
    useUpdateTimeEntry,
} from '@/hooks/api/useTimeEntry';
import { useTimerMode } from '@/hooks/useTimerMode';
import { useGetTask, useGetTasks } from '@/hooks/api/useTask';
import type { Task } from '@/store/taskStore';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { FocusTimeEntryHistory } from '@/components/features/Focus/FocusTimeEntryHistory/FocusTimeEntryHistory';
import { mapTimeEntryToHistoryItem } from '@/utils/mapTimeEntryToHistoryItem';
import styles from './FocusView.module.scss';
import { FocusTimeTrack } from '@/components/features/Focus/FocusTimeTrack/FocusTimeTrack';

const PAGE_SIZE = 5;
const TASK_OPTIONS_LIMIT = 100;

export const FocusView = () => {
    const { t, i18n } = useTranslation();
    const [timeEntryDetailId, setTimeEntryDetailId] = useState<string | undefined>();
    const timerMode = useTimerMode((s) => s.timerMode);
    const { mutate: createTimeEntry } = useCreateTimeEntry();
    const { mutate: stopTimeEntry } = useStopTimeEntry();
    const { mutateAsync: deleteTimeEntry } = useDeleteTimeEntry();
    const { mutate: updateTimeEntry } = useUpdateTimeEntry();
    const [pendingDescription, setPendingDescription] = useState('');
    const [pendingTaskId, setPendingTaskId] = useState<string>();
    const { data: activeEntry } = useActiveTimeEntry();
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(PAGE_SIZE);
    const { data: timeEntriesData, isFetching: timeEntriesIsFetching } =
        useGetTimeEntries(limit, search || undefined);
    const isRunning = !!activeEntry;

    const [resolvedSearch, setResolvedSearch] = useState('');
    const [prevIsFetching, setPrevIsFetching] = useState(timeEntriesIsFetching);
    if (timeEntriesIsFetching !== prevIsFetching) {
        setPrevIsFetching(timeEntriesIsFetching);
        if (!timeEntriesIsFetching) {
            setResolvedSearch(search);
        }
    }

    const timeEntryHistoryItems =
        timeEntriesData?.entries.map((entry) =>
            mapTimeEntryToHistoryItem(entry, t, i18n.language)
        ) ?? [];
    const hasMore = timeEntryHistoryItems.length < (timeEntriesData?.total ?? 0);
    const emptySearch = timeEntryHistoryItems.length === 0 && resolvedSearch.length > 0;

    const selectedEntry = timeEntryDetailId
        ? timeEntriesData?.entries.find((entry) => entry.id === timeEntryDetailId)
        : activeEntry;

    const currentTaskId: string | undefined = isRunning
        ? (activeEntry.taskId ?? undefined)
        : (pendingTaskId ?? selectedEntry?.taskId ?? undefined);

    const { data: tasksData } = useGetTasks(
        TASK_OPTIONS_LIMIT,
        0,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
    const { data: currentTask } = useGetTask(currentTaskId);
    const tasks: Task[] = tasksData?.tasks ?? [];
    const isCurrentTaskMissing =
        !!currentTask && !tasks.some((task) => task.id === currentTask.id);
    const taskOptions = (isCurrentTaskMissing ? [currentTask, ...tasks] : tasks).map(
        (task) => ({
            value: task.id,
            label: task.title,
        })
    );

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        setLimit(PAGE_SIZE);
    }, []);

    const handleLoadMoreClick = () => setLimit((prev) => prev + PAGE_SIZE);

    const handleCreateTimeEntry = () => {
        return createTimeEntry(
            {
                type: timerMode,
                taskId: currentTaskId,
                description: pendingDescription || undefined,
            },
            {
                onSuccess: () => {
                    setPendingDescription('');
                    setPendingTaskId(undefined);
                },
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

    const handleTaskChange = (taskId: string | null) => {
        if (!activeEntry) {
            setPendingTaskId(taskId ?? undefined);
            return;
        }

        updateTimeEntry(
            { id: activeEntry.id, taskId },
            {
                onError: (err) =>
                    toast.error(getErrorMessage(err, 'Focus.assignToTaskError', t)),
            }
        );
    };

    const handleDescriptionSubmit = (description: string) => {
        if (!activeEntry) {
            setPendingDescription(description);
            return;
        }

        updateTimeEntry(
            { id: activeEntry.id, description },
            {
                onError: (err) =>
                    toast.error(getErrorMessage(err, 'Focus.updateDescriptionError', t)),
            }
        );
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
            <FocusTimeTrack
                onTrackClick={isRunning ? handleStopTimeEntry : handleCreateTimeEntry}
                timerRunning={isRunning}
                startedAt={activeEntry?.startedAt}
                description={
                    isRunning ? (activeEntry.description ?? '') : pendingDescription
                }
                onDescriptionSubmit={handleDescriptionSubmit}
                taskId={currentTaskId}
                taskOptions={taskOptions}
                onTaskChange={handleTaskChange}
            />
            <FocusTimeEntryHistory
                timeEntries={timeEntryHistoryItems}
                hasMore={hasMore}
                entriesSum={timeEntriesData?.totalUnfiltered}
                emptySearch={emptySearch}
                onSearchChange={handleSearchChange}
                onLoadMoreClick={handleLoadMoreClick}
                onDeleteClick={handleDeleteTimeEntry}
                onItemClick={setTimeEntryDetailId}
            />
        </div>
    );
};
