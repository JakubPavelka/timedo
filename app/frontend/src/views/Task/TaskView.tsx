import { TaskHeader } from '@/components/features/Task/TaskHeader/TaskHeader';
import { NewTaskDialog } from '@/components/features/Task/NewTaskDialog/NewTaskDialog';
import { useEffect, useState } from 'react';
import { useGetTasks } from '@/hooks/api/useTask';
import { useDelayedPending } from '@/hooks/useDelayedPending';
import { useNewTaskModal } from '@/hooks/useNewTaskModal';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useTranslation } from 'react-i18next';
import { useTaskStore } from '@/store/taskStore';
import { TaskListItem } from '@/components/features/Task/TaskListItem/TaskListItem';
import { TaskListItemSkeleton } from '@/components/features/Task/TaskListItemSkeleton/TaskListItemSkeleton';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { Link, useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/dashboard/tasks/index';
import { FilePlus2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { useCreateTimeEntry } from '@/hooks/api/useTimeEntry';
import { EntryType } from '@timedo/shared/src/schemas/timeEntrySchema';
import { useTimerMode } from '@/hooks/useTimerMode';
import styles from './TaskView.module.scss';

export const TaskView = () => {
    const { t } = useTranslation();
    const {
        isOpen: newTaskModalOpen,
        openModal,
        closeModal,
        handleCreateTask,
    } = useNewTaskModal();
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
    const tasks = useTaskStore((s) => s.tasks);
    const { mutate: createTimeEntry } = useCreateTimeEntry();
    const { priority, status, project, search, tag, offset, limit } = Route.useSearch();
    const priorityFilter = priority ? priority.split(',') : undefined;
    const projectFilter = project ? project.split(',') : undefined;
    const tagFilter = tag ? tag.split(',') : undefined;
    const navigate = Route.useNavigate();
    const navigateGlobal = useNavigate();
    const setTimerMode = useTimerMode((s) => s.setTimerMode);
    const currentLimit = limit ?? 10;
    const currentOffset = offset ?? 0;
    const { isPending, data } = useGetTasks(
        currentLimit,
        currentOffset,
        priorityFilter,
        status,
        projectFilter,
        search,
        tagFilter
    );
    const showSkeleton = useDelayedPending(isPending);
    const total = data?.total ?? 0;
    const currentPage = Math.floor(currentOffset / currentLimit) + 1;
    const maxPage = Math.max(Math.ceil(total / currentLimit), 1);
    const lastPageOffset = (maxPage - 1) * currentLimit;

    useEffect(() => {
        if (isPending || currentOffset <= lastPageOffset) {
            return;
        }
        navigate({ search: (prev) => ({ ...prev, offset: lastPageOffset }) });
    }, [isPending, currentOffset, lastPageOffset, navigate]);

    const visibleSelectedTaskIds = new Set(
        tasks.filter((task) => selectedTaskIds.has(task.id)).map((task) => task.id)
    );
    const allTasksSelected =
        tasks.length > 0 && tasks.length === visibleSelectedTaskIds.size;

    const handleUnselectAll = () => setSelectedTaskIds(new Set());

    const handleToggleSelectAll = () => {
        if (allTasksSelected) {
            setSelectedTaskIds(new Set());
        } else {
            setSelectedTaskIds(new Set(tasks.map((task) => task.id)));
        }
    };

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

    const handleClickPaginationForward = () => {
        navigate({
            search: (prev) => ({
                ...prev,
                offset: Math.min(currentOffset + currentLimit, lastPageOffset),
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

    const handleTrackClick = (taskId: string) => {
        setTimerMode(EntryType.STOPWATCH);
        createTimeEntry(
            { taskId, type: EntryType.STOPWATCH },
            {
                onSuccess: () => navigateGlobal({ to: '/dashboard/focus' }),
                onError: (err) =>
                    toast.error(getErrorMessage(err, 'Focus.startError', t)),
            }
        );
    };

    return (
        <div className={styles.TaskView}>
            <TaskHeader
                onNewTaskClick={openModal}
                selectedTasks={visibleSelectedTaskIds}
                onUnselectAll={handleUnselectAll}
            />
            {showSkeleton ? (
                <div className={styles.TaskView__tasksWrapper}>
                    {Array.from({ length: currentLimit }).map((_, index) => (
                        <TaskListItemSkeleton key={index} />
                    ))}
                </div>
            ) : isPending ? null : tasks.length > 0 ? (
                <>
                    <Checkbox
                        className={styles.TaskView__selectAllWrapper}
                        label={t('Task.selectAll')}
                        checked={allTasksSelected}
                        onChange={handleToggleSelectAll}
                    />
                    <div className={styles.TaskView__tasksWrapper}>
                        {tasks.map((task) => (
                            <Link
                                className={styles.TaskView__taskLink}
                                key={task.id}
                                to={task.id}
                                search={(prev) => prev}
                            >
                                <TaskListItem
                                    id={task.id}
                                    priority={task.priority}
                                    status={task.status}
                                    title={task.title}
                                    project={task.project ?? undefined}
                                    tags={task.tags}
                                    selected={selectedTaskIds.has(task.id)}
                                    isTracked={task.isTracked}
                                    workedTime={task.workedTime}
                                    estimatedTime={task.estimatedTime}
                                    onSelectChange={handleSelectChange}
                                    onTrackClick={handleTrackClick}
                                />
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <div className={styles.TaskView__emptyWrapper}>
                    <div className={styles.TaskView__emptyIcon}>
                        <FilePlus2 width={24} height={24} />
                    </div>
                    <p className={styles.TaskView__noTaskTitle}>{t('Task.noTasks')}</p>
                    <p className={styles.TaskView__noTaskDescription}>
                        {t('Task.noTasksDescription')}
                    </p>
                    <Button onClick={openModal}>
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
                    disableBack={currentOffset <= 0}
                    disableForward={currentOffset >= lastPageOffset}
                />
            </div>

            <NewTaskDialog
                isOpen={newTaskModalOpen}
                onClose={closeModal}
                onSubmit={handleCreateTask}
            />
        </div>
    );
};
