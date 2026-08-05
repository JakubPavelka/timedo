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
import styles from './TaskView.module.scss';
import { Link } from '@tanstack/react-router';
import { useTaskFilter } from '@/hooks/useTaskFilter';

export const TaskView = () => {
    const { t } = useTranslation();
    const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
    const tasks = useTaskStore((s) => s.tasks);
    const { mutate: createTask } = useCreateTask();
    const status = useTaskFilter((s) => s.status);
    const priority = useTaskFilter((s) => s.priority);
    useGetTasks('20', '0', priority, status);

    const handleModalOpen = () => setNewTaskModalOpen(true);
    const handleModalClose = () => setNewTaskModalOpen(false);

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
            <TaskHeader onNewTaskClick={handleModalOpen} />
            <div className={styles.TaskView__tasksWrapper}>
                {tasks.map((task) => (
                    <Link
                        className={styles.TaskView__taskLink}
                        key={task.id}
                        to={task.id}
                    >
                        <TaskListItem
                            priority={task.priority}
                            title={task.title}
                            project={task.project ?? undefined}
                            tags={task.tags}
                        />
                    </Link>
                ))}
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
