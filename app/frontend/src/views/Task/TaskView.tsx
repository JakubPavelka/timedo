import { TaskHeader } from '@/components/features/Task/TaskHeader/TaskHeader';
import { NewTaskModal } from '@/components/features/Task/NewTaskModal/NewTaskModal';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { useCreateTask, useGetTasks } from '@/hooks/api/useTask';
import type { TaskData } from '@timedo/shared/src/schemas/taskSchema';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/store/taskStore';
import { TaskListItem } from '@/components/features/Task/TaskListItem/TaskListItem';
import { Link } from '@tanstack/react-router';
import { Route } from '@/routes/dashboard/tasks/index';
import { FilePlus2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import styles from './TaskView.module.scss';

export const TaskView = () => {
    const { t } = useTranslation();
    const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
    const tasks = useTaskStore((s) => s.tasks);
    const { mutate: createTask } = useCreateTask();
    const { priority, status, project, search, offset, limit } = Route.useSearch();
    const priorityFilter = priority ? priority.split(',') : undefined;
    const projectFilter = project ? project.split(',') : undefined;
    const navigate = Route.useNavigate();
    const currentLimit = limit ?? 10;
    const currentOffset = offset ?? 0;
    const { isPending, data } = useGetTasks(
        currentLimit,
        currentOffset,
        priorityFilter,
        status,
        projectFilter,
        search
    );
    const total = data?.total ?? 0;
    const currentPage = Math.floor(currentOffset / currentLimit) + 1;
    const maxPage = Math.max(Math.ceil(total / currentLimit), 1);

    console.log(Math.floor(currentOffset / currentLimit) + 1);

    const handleModalOpen = () => setNewTaskModalOpen(true);
    const handleModalClose = () => setNewTaskModalOpen(false);
    const handleUnselectAll = () => setSelectedTaskIds(new Set());

    const handleSelectChange = (id: string, selected: boolean) => {
        setSelectedTaskIds((prev) => {
            const next = new Set(prev);
            if (selected) {
                next.add(id);
            } else {
                next.delete(id);
            }
            return next;
        });
    };

    const handleCreateTask = (data: TaskData) => {
        return createTask(data, {
            onSuccess: () => {
                toast.success(t('Task.Modal.createSuccess'));
                setNewTaskModalOpen(false);
            },
            onError: (err) =>
                toast.error(getErrorMessage(err, 'Task.Modal.createError', t)),
        });
    };

    const handleClickPaginationForward = () => {
        navigate({
            search: (prev) => ({
                ...prev,
                offset: Math.min(
                    currentOffset + currentLimit,
                    (maxPage - 1) * currentLimit
                ),
            }),
        });
    };

    const handleClickPaginationBack = () => {
        navigate({
            search: (prev) => ({
                ...prev,
                offset: Math.max(currentOffset - currentLimit, 0),
            }),
        });
    };

    return (
        <div className={styles.TaskView}>
            <TaskHeader
                onNewTaskClick={handleModalOpen}
                selectedTasks={selectedTaskIds}
                onUnselectAll={handleUnselectAll}
            />
            {isPending ? null : tasks.length > 0 ? (
                <div className={styles.TaskView__tasksWrapper}>
                    {tasks.map((task) => (
                        <Link
                            className={styles.TaskView__taskLink}
                            key={task.id}
                            to={task.id}
                        >
                            <TaskListItem
                                id={task.id}
                                priority={task.priority}
                                status={task.status}
                                title={task.title}
                                project={task.project ?? undefined}
                                tags={task.tags}
                                selected={selectedTaskIds.has(task.id)}
                                onSelectChange={handleSelectChange}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={styles.TaskView__emptyWrapper}>
                    <div className={styles.TaskView__emptyIcon}>
                        <FilePlus2 width={24} height={24} />
                    </div>
                    <p className={styles.TaskView__noTaskTitle}>{t('Task.noTasks')}</p>
                    <p className={styles.TaskView__noTaskDescription}>
                        {t('Task.noTasksDescription')}
                    </p>
                    <Button onClick={handleModalOpen}>
                        <span className={styles.TaskView__buttonWrapper}>
                            <Plus width={16} height={16} />
                            <span>{t('Task.newTask')}</span>
                        </span>
                    </Button>
                </div>
            )}
            <div className={styles.TaskView__paginationWrapper}>
                <Pagination
                    currentPage={String(currentPage)}
                    maxPage={String(maxPage)}
                    onClickBack={handleClickPaginationBack}
                    onClickForward={handleClickPaginationForward}
                />
            </div>

            {newTaskModalOpen && (
                <Modal
                    isOpen={newTaskModalOpen}
                    onClose={handleModalClose}
                    closeOnOverlayClick={false}
                >
                    <NewTaskModal
                        onSubmit={handleCreateTask}
                        onClose={handleModalClose}
                    />
                </Modal>
            )}
        </div>
    );
};
