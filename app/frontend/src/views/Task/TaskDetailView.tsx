import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Route } from '@/routes/dashboard/tasks/$taskId';
import { useGetTask } from '@/hooks/api/useTask';
import styles from './TaskDetailView.module.scss';
import { Pill } from '@/components/ui/Pill/Pill';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { LinkItem } from '@/components/ui/LinkItem/LinkItem';

export const TaskDetailView = () => {
    const { t } = useTranslation();
    const { taskId } = Route.useParams();
    const { data: task } = useGetTask(taskId);
    console.log(task);

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
                <p className={styles.TaskDetailView__taskName}>{task?.title}</p>
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
