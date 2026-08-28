import { Input } from '@/components/ui/Input/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl';
import { Button } from '@/components/ui/Button/Button';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Filter } from '@/components/ui/Filter/Filter';
import { useProjectStore } from '@/store/projectStore';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { Popover, type PopoverHandle } from '@/components/ui/Popover/Popover';
import { Route } from '@/routes/dashboard/tasks/index';
import { useState, useEffect, useRef } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDeleteTasks } from '@/hooks/api/useTask';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { BulkActionsMenu } from '@/components/features/Task/BulkActionsMenu/BulkActionsMenu';
import { useTagStore } from '@/store/tagStore';
import styles from './TaskHeader.module.scss';

type TaskHeader = {
    onNewTaskClick: () => void;
    selectedTasks: Set<string>;
    onUnselectAll: () => void;
};

export const TaskHeader = (props: TaskHeader) => {
    const { t } = useTranslation();
    const projects = useProjectStore((s) => s.projects);
    const tags = useTagStore((s) => s.tags);
    const { mutate: deleteTasks } = useDeleteTasks();
    const {
        status,
        priority: priorityParam,
        project: projectParam,
        tag: tagParam,
        search,
    } = Route.useSearch();
    const navigate = Route.useNavigate();
    const priority = priorityParam ? priorityParam.split(',') : [];
    const project = projectParam ? projectParam.split(',') : [];
    const tag = tagParam ? tagParam.split(',') : [];
    const [searchInput, setSearchInput] = useState(search ?? '');
    const [prevSearch, setPrevSearch] = useState(search);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const bulkActionsPopoverRef = useRef<PopoverHandle>(null);
    if (search !== prevSearch) {
        setPrevSearch(search);
        setSearchInput(search ?? '');
    }
    const debouncedSearch = useDebouncedValue(searchInput, 500);

    const activeFilters = priority.length + project.length + tag.length;

    const handlePriorityToggle = (level: 'LOW' | 'MEDIUM' | 'HIGH') => {
        const nextPriority = priority.includes(level)
            ? priority.filter((p) => p !== level)
            : [...priority, level];

        navigate({
            search: (prev) => ({
                ...prev,
                priority: nextPriority.join(',') || undefined,
            }),
        });
    };

    const handleProjectToggle = (proj: string) => {
        const nextProject = project.includes(proj)
            ? project.filter((p) => p !== proj)
            : [...project, proj];

        navigate({
            search: (prev) => ({
                ...prev,
                project: nextProject.join(',') || undefined,
            }),
        });
    };

    const handleTagToggle = (tagId: string) => {
        const nextTag = tag.includes(tagId)
            ? tag.filter((p) => p !== tagId)
            : [...tag, tagId];

        navigate({
            search: (prev) => ({
                ...prev,
                tag: nextTag.join(',') || undefined,
            }),
        });
    };

    const handleStatusChange = (nextStatus: string | undefined) => {
        navigate({ search: (prev) => ({ ...prev, status: nextStatus }) });
    };

    const handleShowDeleteModal = () => {
        bulkActionsPopoverRef.current?.close();
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleCloseBulkActionsMenu = () => bulkActionsPopoverRef.current?.close();
    const handleUnselectAll = () => {
        bulkActionsPopoverRef.current?.close();
        props.onUnselectAll();
    };

    useEffect(() => {
        navigate({
            search: (prev) => ({ ...prev, search: debouncedSearch || undefined }),
            replace: true,
        });
    }, [debouncedSearch, navigate]);

    const statusSegmentedData = [
        {
            title: t('Task.Status.all'),
            isActive: status === undefined,
            onClick: () => handleStatusChange(undefined),
        },
        {
            title: t('Task.Status.active'),
            isActive: status === 'ACTIVE',
            onClick: () => handleStatusChange('ACTIVE'),
        },
        {
            title: t('Task.Status.todo'),
            isActive: status === 'TODO',
            onClick: () => handleStatusChange('TODO'),
        },
        {
            title: t('Task.Status.done'),
            isActive: status === 'DONE',
            onClick: () => handleStatusChange('DONE'),
        },
    ];

    const handleDeleteTasks = () => {
        return deleteTasks(Array.from(props.selectedTasks), {
            onSuccess: () => {
                toast.success(t('Task.tasksDeleteSuccess'));
                handleCloseDeleteModal();
            },
            onError: (err) =>
                toast.error(getErrorMessage(err, 'Task.tasksDeleteError', t)),
        });
    };

    return (
        <>
            <div className={styles.TaskHeader}>
                <div className={styles.TaskHeader__leftSide}>
                    <div className={styles.TaskHeader__searchInput}>
                        <Input
                            id={'task-search'}
                            placeholder={t('Task.searchTasks')}
                            prefixIcon={<Search width={16} height={16} />}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <SegmentedControl items={statusSegmentedData} />

                    <Filter activeFilters={activeFilters}>
                        <div className={styles.TaskHeader__filterMenu}>
                            <p className={styles.TaskHeader__filterTitle}>
                                {t('Task.Modal.priority')}
                            </p>

                            <div className={styles.TaskHeader__filterPriorityWrapper}>
                                <Checkbox
                                    size={'sm'}
                                    label={
                                        <div
                                            className={
                                                styles.TaskHeader__filterPriorityItem
                                            }
                                        >
                                            <PriorityIcon level={'LOW'} />
                                            <p>{t('Task.Priority.low')}</p>
                                        </div>
                                    }
                                    checked={priority.includes('LOW')}
                                    onChange={() => handlePriorityToggle('LOW')}
                                />
                                <Checkbox
                                    size={'sm'}
                                    label={
                                        <div
                                            className={
                                                styles.TaskHeader__filterPriorityItem
                                            }
                                        >
                                            <PriorityIcon level={'MEDIUM'} />
                                            <p>{t('Task.Priority.medium')}</p>
                                        </div>
                                    }
                                    checked={priority.includes('MEDIUM')}
                                    onChange={() => handlePriorityToggle('MEDIUM')}
                                />
                                <Checkbox
                                    size={'sm'}
                                    label={
                                        <div
                                            className={
                                                styles.TaskHeader__filterPriorityItem
                                            }
                                        >
                                            <PriorityIcon level={'HIGH'} />
                                            <p>{t('Task.Priority.high')}</p>
                                        </div>
                                    }
                                    checked={priority.includes('HIGH')}
                                    onChange={() => handlePriorityToggle('HIGH')}
                                />
                            </div>
                            {projects.length > 0 && (
                                <>
                                    <div className={styles.TaskHeader__filterDivider} />

                                    <p className={styles.TaskHeader__filterTitle}>
                                        {t('Task.Modal.project')}
                                    </p>
                                    <div
                                        className={
                                            styles.TaskHeader__filterProjectWrapper
                                        }
                                    >
                                        {projects.map((proj) => (
                                            <Checkbox
                                                key={proj.id}
                                                label={
                                                    <span
                                                        className={
                                                            styles.TaskHeader__filterProjectItem
                                                        }
                                                    >
                                                        <span
                                                            style={{
                                                                background: proj.color,
                                                            }}
                                                            className={
                                                                styles.TaskHeader__filterProjectDot
                                                            }
                                                        />
                                                        {proj.label}
                                                    </span>
                                                }
                                                size={'sm'}
                                                onChange={() =>
                                                    handleProjectToggle(proj.id)
                                                }
                                                checked={project.includes(proj.id)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                            {tags.length > 0 && (
                                <>
                                    <div className={styles.TaskHeader__filterDivider} />

                                    <p className={styles.TaskHeader__filterTitle}>
                                        {t('Task.Modal.tags')}
                                    </p>
                                    <div className={styles.TaskHeader__filterTagWrapper}>
                                        {tags.map((singleTag) => (
                                            <Checkbox
                                                key={singleTag.id}
                                                label={
                                                    <span
                                                        className={
                                                            styles.TaskHeader__filterTagItem
                                                        }
                                                    >
                                                        <span
                                                            style={{
                                                                background:
                                                                    singleTag.color,
                                                            }}
                                                            className={
                                                                styles.TaskHeader__filterTagDot
                                                            }
                                                        />
                                                        {singleTag.label}
                                                    </span>
                                                }
                                                size={'sm'}
                                                onChange={() =>
                                                    handleTagToggle(singleTag.id)
                                                }
                                                checked={tag.includes(singleTag.id)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </Filter>
                </div>

                <div className={styles.TaskHeader__rightSide}>
                    {props.selectedTasks.size > 0 && (
                        <Popover
                            ref={bulkActionsPopoverRef}
                            align={'right'}
                            trigger={
                                <Button variant={'outline'}>
                                    <span className={styles.TaskHeader__buttonWrapper}>
                                        {t('Task.actions', {
                                            count: props.selectedTasks.size,
                                        })}
                                    </span>
                                </Button>
                            }
                        >
                            <BulkActionsMenu
                                selectedTaskIds={Array.from(props.selectedTasks)}
                                onUnselectAll={handleUnselectAll}
                                onDeleteClick={handleShowDeleteModal}
                                onClose={handleCloseBulkActionsMenu}
                            />
                        </Popover>
                    )}
                    <Button onClick={props.onNewTaskClick}>
                        <span className={styles.TaskHeader__buttonWrapper}>
                            <Plus width={16} height={16} />
                            <span>{t('Task.newTask')}</span>
                        </span>
                    </Button>
                </div>
            </div>
            {showDeleteModal && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleDeleteTasks}
                    variant={'danger'}
                    title={t('Task.deleteTasksModalTitle')}
                    description={t('Task.deleteTasksModalDescription')}
                    icon={<Trash2 width={18} height={18} />}
                    confirmText={t('General.delete')}
                    confirmIcon={<Trash2 width={16} height={16} />}
                />
            )}
        </>
    );
};
