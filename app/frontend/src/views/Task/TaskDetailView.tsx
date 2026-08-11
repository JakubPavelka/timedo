import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Route } from '@/routes/dashboard/tasks/$taskId';
import { useGetTask } from '@/hooks/api/useTask';
import { Pill } from '@/components/ui/Pill/Pill';
import { LinkItem } from '@/components/ui/LinkItem/LinkItem';
import styles from './TaskDetailView.module.scss';
import { TaskDetailTitle } from '@/components/features/Task/Detail/TaskDetailTitle/TaskDetailTitle';
import { TaskDetailDescription } from '@/components/features/Task/Detail/TaskDetailDescription/TaskDetailDescription';
import { TaskDetailPriority } from '@/components/features/Task/Detail/TaskDetailPriority/TaskDetailPriority';
import { TaskDetailProject } from '@/components/features/Task/Detail/TaskDetailProject/TaskDetailProject';

export const TaskDetailView = () => {
    const { t } = useTranslation();
    const { taskId } = Route.useParams();
    const { data: task } = useGetTask(taskId);

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
                            <TaskDetailProject
                                taskId={taskId}
                                project={task.project}
                            />
                        )}
                        {task.priority && (
                            <TaskDetailPriority
                                taskId={taskId}
                                priority={task?.priority}
                            />
                        )}
                    </div>
                )}
                <TaskDetailTitle taskId={taskId} title={task?.title ?? ''} />
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
                {task?.description !== undefined && (
                    <>
                        <p className={styles.TaskDetailView__heading}>
                            {t('TaskDetail.description')}
                        </p>
                        <TaskDetailDescription
                            taskId={taskId}
                            description={task.description ?? ''}
                        />
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
