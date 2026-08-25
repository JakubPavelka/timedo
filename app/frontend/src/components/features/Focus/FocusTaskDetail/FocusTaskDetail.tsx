import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { useEditableField } from '@/hooks/useEditableField';
import { useTaskStore } from '@/store/taskStore';
import { useGetTasks } from '@/hooks/api/useTask';
import { useUpdateTimeEntry } from '@/hooks/api/useTimeEntry';
import { Select } from '@/components/ui/Select/Select';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Pill } from '@/components/ui/Pill/Pill';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import styles from './FocusTaskDetail.module.scss';

const TASK_OPTIONS_LIMIT = 100;

type FocusTaskDetailProps = {
    id?: string;
    taskId?: string | null;
    description?: string;
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
    const selectedTask = tasks.find((task) => task.id === props.taskId);

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
            <span>
                <p className={styles.FocusTaskDetail__sectionText}>
                    {t('Focus.recordDetail')}
                </p>
                <p className={styles.FocusTaskDetail__title}>
                    {selectedTask?.title ?? t('Focus.untrackedTime')}
                </p>
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
