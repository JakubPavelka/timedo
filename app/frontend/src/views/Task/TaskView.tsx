import { TaskHeader } from '@/components/features/Task/TaskHeader/TaskHeader';
import { NewTaskModal } from '@/components/features/Task/NewTaskModal/NewTaskModal';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { useCreateTask, useGetTasks } from '@/hooks/api/useTask';
import type { TaskData } from '@timedo/shared/src/schemas/taskSchema';
import { toast } from 'sonner';
import { ApiError } from '@/api/ApiError';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/store/taskStore';
import { TaskListItem } from '@/components/features/Task/TaskListItem/TaskListItem';
import { Link } from '@tanstack/react-router';
import { Route } from '@/routes/dashboard/tasks/index';
import { FilePlus2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import styles from './TaskView.module.scss';

export const TaskView = () => {
    const { t } = useTranslation();
    const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
    const tasks = useTaskStore((s) => s.tasks);
    const { mutate: createTask } = useCreateTask();
    const { priority, status, project, search } = Route.useSearch();
    const priorityFilter = priority ? priority.split(',') : undefined;
    const projectFilter = project ? project.split(',') : undefined;
    const { isPending } = useGetTasks(
        '20',
        '0',
        priorityFilter,
        status,
        projectFilter,
        search
    );

    console.log(selectedTaskIds);

    const handleModalOpen = () => setNewTaskModalOpen(true);
    const handleModalClose = () => setNewTaskModalOpen(false);

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
                toast.error(
                    err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                        ? t(`BackendErrors.${err.code}`)
                        : t('Task.Modal.createError')
                ),
        });
    };

    return (
        <div className={styles.TaskView}>
            <TaskHeader
                onNewTaskClick={handleModalOpen}
                selectedCount={selectedTaskIds.size}
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
