import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/dashboard/tasks/$taskId';
import { useDeleteTask, useGetTask, useUpdateTask } from '@/hooks/api/useTask';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button/Button';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { TaskDetailTitle } from '@/components/features/Task/Detail/TaskDetailTitle/TaskDetailTitle';
import { TaskDetailDescription } from '@/components/features/Task/Detail/TaskDetailDescription/TaskDetailDescription';
import { TaskDetailPriority } from '@/components/features/Task/Detail/TaskDetailPriority/TaskDetailPriority';
import { TaskDetailProject } from '@/components/features/Task/Detail/TaskDetailProject/TaskDetailProject';
import { TaskDetailLink } from '@/components/features/Task/Detail/TaskDetailLink/TaskDetailLink';
import { TaskDetailTags } from '@/components/features/Task/Detail/TaskDetailTags/TaskDetailTags';
import { TaskDetailProperties } from '@/components/features/Task/Detail/TaskDetailProperties/TaskDetailProperties';
import { TaskDetailTimeTracking } from '@/components/features/Task/Detail/TaskDetailTimeTracking/TaskDetailTimeTracking';
import { Pill } from '@/components/ui/Pill/Pill';
import { getErrorMessage } from '@/utils/getErrorMessage';
import styles from './TaskDetailView.module.scss';

export const TaskDetailView = () => {
    const { t } = useTranslation();
    const { taskId } = Route.useParams();
    const { data: task } = useGetTask(taskId);
    const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask(taskId);
    const { mutate: updateTask } = useUpdateTask(taskId);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const handleTimerClick = () => {
        console.log('start timer');
    };

    const handleOpenDeleteModal = () => setShowDeleteModal(true);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleDeleteTask = () => {
        deleteTask(undefined, {
            onSuccess: () => {
                toast.success(t('TaskDetail.deleteTaskSuccess'));
                navigate({
                    to: '/dashboard/tasks',
                    search: (prev) => prev,
                    replace: true,
                });
            },
            onError: (err) =>
                toast.error(getErrorMessage(err, 'TaskDetail.deleteTaskError', t)),
        });
    };

    const isDone = task?.status === 'DONE';

    const doneToggleCopy = isDone
        ? {
              label: 'TaskDetail.reopenTask',
              success: 'TaskDetail.reopenTaskSuccess',
              error: 'TaskDetail.reopenTaskError',
          }
        : {
              label: 'TaskDetail.markAsDone',
              success: 'TaskDetail.markAsDoneSuccess',
              error: 'TaskDetail.markAsDoneError',
          };

    const handleToggleDone = () => {
        updateTask(
            { status: isDone ? 'TODO' : 'DONE' },
            {
                onSuccess: () => toast.success(t(doneToggleCopy.success)),
                onError: (err) =>
                    toast.error(getErrorMessage(err, doneToggleCopy.error, t)),
            }
        );
    };

    return (
        <div className={styles.TaskDetailView}>
            <div className={styles.TaskDetailView__header}>
                <Link
                    to={'/dashboard/tasks'}
                    search={(prev) => prev}
                    className={styles.TaskDetailView__back}
                >
                    <ArrowLeft width={16} height={16} />
                    <span>{t('TaskDetail.backToTasks')}</span>
                </Link>
                <div className={styles.TaskDetailView__headerActions}>
                    <Button
                        variant={isDone ? 'outline' : 'outline-success'}
                        onClick={handleToggleDone}
                    >
                        <span className={styles.TaskDetailView__buttonContent}>
                            <Check width={16} height={16} />
                            <span>{t(doneToggleCopy.label)}</span>
                        </span>
                    </Button>
                    <Button
                        variant={'outline-danger'}
                        onClick={handleOpenDeleteModal}
                        isLoading={isDeleting}
                    >
                        <span className={styles.TaskDetailView__buttonContent}>
                            <X width={16} height={16} />
                            <span>{t('TaskDetail.deleteTask')}</span>
                        </span>
                    </Button>
                </div>
            </div>
            <div className={styles.TaskDetailView__columns}>
                <div className={styles.TaskDetailView__left}>
                    <div className={styles.TaskDetailView__badges}>
                        <TaskDetailProject
                            taskId={taskId}
                            project={task?.project ?? null}
                        />
                        {task?.priority && (
                            <TaskDetailPriority
                                taskId={taskId}
                                priority={task.priority}
                            />
                        )}
                        {isDone && (
                            <Pill
                                variant={'colored'}
                                tone={'success'}
                                icon={<Check width={12} height={12} />}
                            >
                                {t('TaskDetail.markAsDone')}
                            </Pill>
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
                    <p className={styles.TaskDetailView__heading}>
                        {t('TaskDetail.links')}
                    </p>
                    {task?.links !== undefined && (
                        <TaskDetailLink taskId={taskId} links={task?.links ?? []} />
                    )}
                </div>
                <div className={styles.TaskDetailView__right}>
                    <TaskDetailTimeTracking
                        workedMinutes={96}
                        estimateMinutes={180}
                        onTimerClick={handleTimerClick}
                    />
                    <TaskDetailProperties
                        priority={task?.priority ?? 'LOW'}
                        project={task?.project?.label ?? ''}
                    />
                </div>
            </div>
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteTask}
                variant={'danger'}
                title={t('TaskDetail.deleteTaskModalTitle')}
                description={t('TaskDetail.deleteTaskModalDescription')}
                icon={<Trash2 width={18} height={18} />}
                confirmText={t('General.delete')}
                confirmIcon={<Trash2 width={16} height={16} />}
            />
        </div>
    );
};
