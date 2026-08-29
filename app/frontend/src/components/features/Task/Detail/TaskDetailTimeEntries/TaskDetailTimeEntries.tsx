import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { useDeleteTimeEntry, useGetTimeEntries } from '@/hooks/api/useTimeEntry';
import { formatDateGroup } from '@/utils/formatDateGroup';
import { formatDurationShort } from '@/utils/formatDurationShort';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { toLocalDateTime } from '@/utils/toLocalDateTime';
import styles from './TaskDetailTimeEntries.module.scss';

type TaskDetailTimeEntriesProps = {
    taskId: string;
};

const ENTRIES_LIMIT = 20;

export const TaskDetailTimeEntries = (props: TaskDetailTimeEntriesProps) => {
    const { t, i18n } = useTranslation();
    const { data } = useGetTimeEntries(ENTRIES_LIMIT, undefined, props.taskId);
    const { mutateAsync: deleteTimeEntry } = useDeleteTimeEntry();
    const [entryToDeleteId, setEntryToDeleteId] = useState<string | undefined>();

    const entries = data?.entries ?? [];
    const maxDuration = Math.max(1, ...entries.map((entry) => entry.duration ?? 0));

    const handleDeleteClick = (id: string) => () => setEntryToDeleteId(id);
    const handleCloseDeleteModal = () => setEntryToDeleteId(undefined);

    const handleConfirmDelete = async () => {
        if (!entryToDeleteId) {
            return;
        }

        try {
            await deleteTimeEntry(entryToDeleteId);
            toast.success(t('Focus.timeEntryDeleteSuccess'));
            handleCloseDeleteModal();
        } catch (err) {
            toast.error(getErrorMessage(err, 'Focus.timeEntryDeleteError', t));
        }
    };

    if (entries.length === 0) {
        return null;
    }

    return (
        <>
            <p className={styles.TaskDetailTimeEntries__heading}>
                {t('TaskDetail.timeTracking')}
            </p>
            <ul className={styles.TaskDetailTimeEntries}>
                {entries.map((entry) => {
                    const startedAt = toLocalDateTime(entry.startedAt, i18n.language);
                    const duration = entry.duration ?? 0;
                    const percent = Math.round((duration / maxDuration) * 100);

                    return (
                        <li key={entry.id} className={styles.TaskDetailTimeEntries__item}>
                            <Clock
                                className={styles.TaskDetailTimeEntries__icon}
                                width={16}
                                height={16}
                            />
                            <div className={styles.TaskDetailTimeEntries__main}>
                                <p className={styles.TaskDetailTimeEntries__dateTime}>
                                    {formatDateGroup(startedAt, t)} &middot;{' '}
                                    {startedAt.toLocaleString(DateTime.TIME_SIMPLE)}
                                </p>
                                {entry.description && (
                                    <p
                                        className={
                                            styles.TaskDetailTimeEntries__description
                                        }
                                    >
                                        {entry.description}
                                    </p>
                                )}
                            </div>
                            <div className={styles.TaskDetailTimeEntries__track}>
                                <div
                                    className={styles.TaskDetailTimeEntries__bar}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <p className={styles.TaskDetailTimeEntries__duration}>
                                {formatDurationShort(duration)}
                            </p>
                            <div
                                className={styles.TaskDetailTimeEntries__deleteIcon}
                                onClick={handleDeleteClick(entry.id)}
                                role={'button'}
                                tabIndex={0}
                                aria-label={t('General.delete')}
                            >
                                <Trash2 width={16} height={16} />
                            </div>
                        </li>
                    );
                })}
            </ul>
            <ConfirmModal
                isOpen={!!entryToDeleteId}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                variant={'danger'}
                title={t('Focus.timeEntryDeleteModalTitle')}
                description={t('Focus.timeEntryDeleteModalDescription')}
                icon={<Trash2 width={18} height={18} />}
                confirmText={t('General.delete')}
                confirmIcon={<Trash2 width={16} height={16} />}
            />
        </>
    );
};
