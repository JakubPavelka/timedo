import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { z } from 'zod';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { useEditableField } from '@/hooks/useEditableField';
import { useTaskStore } from '@/store/taskStore';
import { useGetTasks, useGetTask } from '@/hooks/api/useTask';
import { useUpdateTimeEntry } from '@/hooks/api/useTimeEntry';
import { Select } from '@/components/ui/Select/Select';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Pill } from '@/components/ui/Pill/Pill';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { formatDurationShort } from '@/utils/formatDurationShort';
import styles from './FocusTaskDetail.module.scss';

const TASK_OPTIONS_LIMIT = 100;

type FocusTaskDetailProps = {
    id?: string;
    taskId?: string | null;
    description?: string;
    duration?: number;
};

export const FocusTaskDetail = (props: FocusTaskDetailProps) => {
    const { t } = useTranslation();
    const { mutate: updateTimeEntry, isPending } = useUpdateTimeEntry();
    useGetTasks(TASK_OPTIONS_LIMIT, 0, undefined, undefined, undefined, undefined);
    const tasks = useTaskStore((s) => s.tasks);
    const taskOptions = tasks.map((task) => ({
        value: task.id,
        label: task.title,
    }));
    const { data: selectedTask } = useGetTask(props.taskId);

    const { draft, setDraft, error, validate } = useEditableField({
        schema: z.string(),
        value: props.description ?? '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDraft(e.target.value);
    };

    const handleSubmitDescription = () => {
        if (!props.id || isPending || draft === (props.description ?? '')) {
            return;
        }

        const value = validate();

        if (value === undefined) {
            return;
        }

        updateTimeEntry(
            { id: props.id, description: value },
            {
                onSuccess: () => toast.success(t('Focus.updateDescriptionSuccess')),
                onError: (err) =>
                    toast.error(getErrorMessage(err, 'Focus.updateDescriptionError', t)),
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            setDraft(props.description ?? '');
        }
    };

    const handleAssignTask = (taskId: string) => {
        if (!props.id) {
            return;
        }

        updateTimeEntry(
            { id: props.id, taskId: taskId === '' ? null : taskId },
            {
                onSuccess: () => toast.success(t('Focus.assignToTaskSuccess')),
                onError: (err) =>
                    toast.error(getErrorMessage(err, 'Focus.assignToTaskError', t)),
            }
        );
    };

    return (
        <div className={styles.FocusTaskDetail}>
            <span className={styles.FocusTaskDetail__headerRow}>
                <span>
                    <p className={styles.FocusTaskDetail__sectionText}>
                        {t('Focus.recordDetail')}
                    </p>
                    <p className={styles.FocusTaskDetail__title}>
                        {selectedTask?.title ?? t('Focus.untrackedTime')}
                    </p>
                </span>
                {props.taskId && (
                    <Link
                        to={'/dashboard/tasks/$taskId'}
                        params={{ taskId: props.taskId }}
                        className={styles.FocusTaskDetail__taskLink}
                    >
                        <span>{t('Focus.taskDetail')}</span>
                        <ChevronRight width={16} height={16} />
                    </Link>
                )}
            </span>

            {props.taskId && (
                <span className={styles.FocusTaskDetail__pillWrapper}>
                    {selectedTask?.project?.label && (
                        <Pill dot color={selectedTask.project.color}>
                            {selectedTask.project.label}
                        </Pill>
                    )}
                    {selectedTask?.priority && (
                        <Pill>
                            <span className={styles.FocusTaskDetail__pill}>
                                <PriorityIcon level={selectedTask.priority} />
                                <span>
                                    {t(
                                        `Task.Priority.${selectedTask.priority.toLowerCase()}`
                                    )}
                                </span>
                            </span>
                        </Pill>
                    )}
                </span>
            )}

            {((props.duration ?? 0) > 0 || (selectedTask?.workedTime ?? 0) > 0) && (
                <span className={styles.FocusTaskDetail__timeSquares}>
                    {(props.duration ?? 0) > 0 && (
                        <div className={styles.FocusTaskDetail__timeSquare}>
                            <p className={styles.FocusTaskDetail__squareTime}>
                                {formatDurationShort(props.duration ?? 0)}
                            </p>
                            <p className={styles.FocusTaskDetail__squareText}>
                                {t('Focus.thisEntry')}
                            </p>
                        </div>
                    )}
                    {(selectedTask?.workedTime ?? 0) > 0 && (
                        <div className={styles.FocusTaskDetail__timeSquare}>
                            <p className={styles.FocusTaskDetail__squareTime}>
                                {formatDurationShort(selectedTask?.workedTime ?? 0)}
                            </p>
                            <p className={styles.FocusTaskDetail__squareText}>
                                {t('Focus.total')}
                            </p>
                        </div>
                    )}
                </span>
            )}

            <span>
                <p className={styles.FocusTaskDetail__sectionText}>
                    {t('Focus.description')}
                </p>
                <Textarea
                    value={draft}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSubmitDescription}
                    placeholder={t('Focus.descriptionPlaceholder')}
                    variant={'filled'}
                    disabled={isPending}
                />
                {error && <p className={styles.FocusTaskDetail__error}>{t(error)}</p>}
            </span>

            <span>
                <p className={styles.FocusTaskDetail__sectionText}>
                    {t('Focus.assignToTask')}
                </p>
                <Select
                    options={[
                        { value: '', label: t('Focus.withoutTask') },
                        ...taskOptions,
                    ]}
                    value={props.taskId ?? ''}
                    onChange={handleAssignTask}
                    placeholder={t('Focus.selectTask')}
                />
            </span>
        </div>
    );
};
