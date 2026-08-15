import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Route } from '@/routes/dashboard/tasks/$taskId';
import { useGetTask } from '@/hooks/api/useTask';
import { TaskDetailTitle } from '@/components/features/Task/Detail/TaskDetailTitle/TaskDetailTitle';
import { TaskDetailDescription } from '@/components/features/Task/Detail/TaskDetailDescription/TaskDetailDescription';
import { TaskDetailPriority } from '@/components/features/Task/Detail/TaskDetailPriority/TaskDetailPriority';
import { TaskDetailProject } from '@/components/features/Task/Detail/TaskDetailProject/TaskDetailProject';
import { TaskDetailLink } from '@/components/features/Task/Detail/TaskDetailLink/TaskDetailLink';
import { TaskDetailTags } from '@/components/features/Task/Detail/TaskDetailTags/TaskDetailTags';
import styles from './TaskDetailView.module.scss';

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
                <div className={styles.TaskDetailView__badges}>
                    <TaskDetailProject taskId={taskId} project={task?.project ?? null} />
                    {task?.priority && (
                        <TaskDetailPriority taskId={taskId} priority={task.priority} />
                    )}
                </div>
                <TaskDetailTitle taskId={taskId} title={task?.title ?? ''} />

                <TaskDetailTags taskId={taskId} tags={task?.tags ?? []} />

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
                <p className={styles.TaskDetailView__heading}>{t('TaskDetail.links')}</p>
                {task?.links !== undefined && (
                    <TaskDetailLink taskId={taskId} links={task?.links ?? []} />
                )}
            </div>
            <div className={styles.TaskDetailView__right}></div>
        </div>
    );
};
