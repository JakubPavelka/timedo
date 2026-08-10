import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Route } from '@/routes/dashboard/tasks/$taskId';
import { useGetTask, useUpdateTask } from '@/hooks/api/useTask';
import { Pill } from '@/components/ui/Pill/Pill';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { LinkItem } from '@/components/ui/LinkItem/LinkItem';
import { useState } from 'react';
import { Input } from '@/components/ui/Input/Input';
import { TaskSchema } from '@timedo/shared/src/schemas/taskSchema';
import { ApiError } from '@/api/ApiError';
import { toast } from 'sonner';
import styles from './TaskDetailView.module.scss';

export const TaskDetailView = () => {
    const { t } = useTranslation();
    const { taskId } = Route.useParams();
    const { data: task } = useGetTask(taskId);
    const { mutate: updateTask, isPending: isTitleSaving } = useUpdateTask(taskId);
    const [titleEditing, setTitleEditing] = useState(false);
    const [titleDraft, setTitleDraft] = useState('');
    const [titleError, setTitleError] = useState<string>();

    const handleStartTitleEdit = () => {
        setTitleDraft(task?.title ?? '');
        setTitleError(undefined);
        setTitleEditing(true);
    };

    const handleCancelTitleEdit = () => {
        setTitleEditing(false);
        setTitleError(undefined);
    };

    const handleTitleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleDraft(e.target.value);
    };

    const handleSubmitTitle = () => {
        if (isTitleSaving) {
            return;
        }

        const result = TaskSchema.shape.title.safeParse(titleDraft.trim());

        if (!result.success) {
            setTitleError(result.error.issues[0].message);
            return;
        }

        updateTask(
            { title: result.data },
            {
                onSuccess: () => {
                    setTitleEditing(false);
                    setTitleError(undefined);
                    toast.success(t('TaskDetail.updateTitleSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                            ? t(`BackendErrors.${err.code}`)
                            : t('TaskDetail.updateTitleError')
                    );
                },
            }
        );
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmitTitle();
        } else if (e.key === 'Escape') {
            handleCancelTitleEdit();
        }
    };

    return (
        <div className={styles.TaskDetailView}>
            <div className={styles.TaskDetailView__left}>
                <Link to={'/dashboard/tasks'} className={styles.TaskDetailView__back}>
                    <ArrowLeft width={16} height={16} />
                    <span>{t('TaskDetail.backToTasks')}</span>
                </Link>
                {(task?.project || task?.priority) && (
                    <div className={styles.TaskDetailView__badges}>
                        {task.project && (
                            <Pill color={task.project.color} dot>
                                {task.project.label}
                            </Pill>
                        )}
                        {task.priority && (
                            <Pill>
                                <span className={styles.TaskDetailView__priorityWrapper}>
                                    <PriorityIcon level={task.priority} />
                                    <span>
                                        {t(
                                            `Task.Priority.${task.priority.toLowerCase()}`
                                        )}
                                    </span>
                                </span>
                            </Pill>
                        )}
                    </div>
                )}
                {titleEditing ? (
                    <>
                        <Input
                            className={styles.TaskDetailView__titleEditInput}
                            value={titleDraft}
                            onChange={handleTitleDraftChange}
                            onKeyDown={handleTitleKeyDown}
                            onBlur={handleCancelTitleEdit}
                            disabled={isTitleSaving}
                            autoFocus
                            suffixIcon={
                                <Check
                                    width={16}
                                    height={16}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={handleSubmitTitle}
                                />
                            }
                        />
                        {titleError && (
                            <p className={styles.TaskDetailView__titleError}>
                                {t(titleError)}
                            </p>
                        )}
                    </>
                ) : (
                    <p
                        onClick={handleStartTitleEdit}
                        className={styles.TaskDetailView__taskName}
                    >
                        {task?.title}
                    </p>
                )}

                {(task?.tags.length ?? 0) > 0 && (
                    <div className={styles.TaskDetailView__badges}>
                        {task?.tags.map((tag) => (
                            <Pill
                                key={tag.id}
                                variant={'colored'}
                                color={tag.color}
                                hashtag
                            >
                                {tag.label}
                            </Pill>
                        ))}
                    </div>
                )}
                {task?.description && (
                    <>
                        <p className={styles.TaskDetailView__heading}>
                            {t('TaskDetail.description')}
                        </p>
                        <p className={styles.TaskDetailView__text}>{task.description}</p>
                    </>
                )}
                {(task?.links.length ?? 0) > 0 && (
                    <>
                        <p className={styles.TaskDetailView__heading}>
                            {t('TaskDetail.links')}
                        </p>
                        <div className={styles.TaskDetailView__linksWrapper}>
                            {task?.links.map((link) => (
                                <LinkItem
                                    key={link.id}
                                    url={link.url}
                                    label={link.label}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className={styles.TaskDetailView__right}></div>
        </div>
    );
};
