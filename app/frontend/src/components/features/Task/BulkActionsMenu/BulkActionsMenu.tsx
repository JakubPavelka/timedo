import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
    ArrowLeft,
    BarChart3,
    Check,
    ChevronRight,
    Circle,
    CircleDot,
    Folder,
    Hash,
    Trash2,
    XCircle,
} from 'lucide-react';
import clsx from 'clsx';
import {
    PriorityIcon,
    type PriorityLevel,
} from '@/components/ui/PriorityIcon/PriorityIcon';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { PRIORITY } from '@/data/priorityData';
import { useProjectStore } from '@/store/projectStore';
import { useTagStore } from '@/store/tagStore';
import { useUpdateTasks } from '@/hooks/api/useTask';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Status } from '@timedo/shared/src/schemas/taskSchema';
import styles from './BulkActionsMenu.module.scss';

type BulkActionsMenuProps = {
    selectedTaskIds: string[];
    onUnselectAll: () => void;
    onDeleteClick: () => void;
    onClose: () => void;
};

type MenuView = 'main' | 'priority' | 'status' | 'project' | 'tags';

const STATUS_OPTIONS = [
    {
        value: Status.TODO,
        label: 'Task.Status.todo',
        icon: <Circle width={14} height={14} />,
    },
    {
        value: Status.ACTIVE,
        label: 'Task.Status.active',
        icon: <CircleDot width={14} height={14} />,
    },
    {
        value: Status.DONE,
        label: 'Task.Status.done',
        icon: <Check width={14} height={14} />,
    },
];

export const BulkActionsMenu = (props: BulkActionsMenuProps) => {
    const { t } = useTranslation();
    const [view, setView] = useState<MenuView>('main');
    const [checkedTagIds, setCheckedTagIds] = useState<string[]>([]);
    const projects = useProjectStore((s) => s.projects);
    const tags = useTagStore((s) => s.tags);
    const { mutate: updateTasks } = useUpdateTasks();

    const handleShowPriority = () => setView('priority');
    const handleShowStatus = () => setView('status');
    const handleShowProject = () => setView('project');
    const handleShowTags = () => setView('tags');
    const handleShowMain = () => setView('main');

    const handleUpdateError = (err: unknown) =>
        toast.error(getErrorMessage(err, 'Task.updateTasksError', t));

    const handleSelectPriority = (priority: PriorityLevel) => {
        updateTasks(
            { taskIds: props.selectedTaskIds, data: { priority } },
            {
                onSuccess: () => {
                    toast.success(t('Task.updateTasksSuccess'));
                    props.onClose();
                },
                onError: handleUpdateError,
            }
        );
    };

    const handleSelectStatus = (status: Status) => {
        updateTasks(
            { taskIds: props.selectedTaskIds, data: { status } },
            {
                onSuccess: () => {
                    toast.success(t('Task.updateTasksSuccess'));
                    props.onClose();
                },
                onError: handleUpdateError,
            }
        );
    };

    const handleSelectProject = (projectId: string) => {
        updateTasks(
            { taskIds: props.selectedTaskIds, data: { projectId } },
            {
                onSuccess: () => {
                    toast.success(t('Task.updateTasksSuccess'));
                    props.onClose();
                },
                onError: handleUpdateError,
            }
        );
    };

    const handleToggleTag = (tagId: string) => {
        const nextTagIds = checkedTagIds.includes(tagId)
            ? checkedTagIds.filter((id) => id !== tagId)
            : [...checkedTagIds, tagId];

        setCheckedTagIds(nextTagIds);

        updateTasks(
            { taskIds: props.selectedTaskIds, data: { tags: nextTagIds } },
            {
                onSuccess: () => {
                    toast.success(t('Task.updateTasksSuccess'));
                },
                onError: handleUpdateError,
            }
        );
    };

    if (view === 'main') {
        return (
            <div className={styles.BulkActionsMenu}>
                <div
                    className={styles.BulkActionsMenu__item}
                    onClick={handleShowPriority}
                >
                    <BarChart3 width={16} height={16} />
                    <span>{t('Task.changePriority')}</span>
                    <ChevronRight
                        width={14}
                        height={14}
                        className={styles.BulkActionsMenu__chevron}
                    />
                </div>
                <div className={styles.BulkActionsMenu__item} onClick={handleShowStatus}>
                    <CircleDot width={16} height={16} />
                    <span>{t('Task.changeStatus')}</span>
                    <ChevronRight
                        width={14}
                        height={14}
                        className={styles.BulkActionsMenu__chevron}
                    />
                </div>
                <div className={styles.BulkActionsMenu__item} onClick={handleShowProject}>
                    <Folder width={16} height={16} />
                    <span>{t('Task.changeProject')}</span>
                    <ChevronRight
                        width={14}
                        height={14}
                        className={styles.BulkActionsMenu__chevron}
                    />
                </div>
                <div className={styles.BulkActionsMenu__item} onClick={handleShowTags}>
                    <Hash width={16} height={16} />
                    <span>{t('Task.changeTags')}</span>
                    <ChevronRight
                        width={14}
                        height={14}
                        className={styles.BulkActionsMenu__chevron}
                    />
                </div>
                <div className={styles.BulkActionsMenu__divider} />
                <div
                    className={styles.BulkActionsMenu__item}
                    onClick={props.onUnselectAll}
                >
                    <XCircle width={16} height={16} />
                    <span>{t('Task.unselectSelected')}</span>
                </div>
                <div
                    className={clsx(
                        styles.BulkActionsMenu__item,
                        styles['BulkActionsMenu__item--danger']
                    )}
                    onClick={props.onDeleteClick}
                >
                    <Trash2 width={16} height={16} />
                    <span>{t('Task.deleteSelected')}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.BulkActionsMenu}>
            <div className={styles.BulkActionsMenu__header} onClick={handleShowMain}>
                <ArrowLeft width={14} height={14} />
                <span>
                    {t(
                        view === 'priority'
                            ? 'Task.changePriority'
                            : view === 'status'
                              ? 'Task.changeStatus'
                              : view === 'project'
                                ? 'Task.changeProject'
                                : 'Task.changeTags'
                    )}
                </span>
            </div>
            <div className={styles.BulkActionsMenu__divider} />

            {view === 'priority' &&
                PRIORITY.map((prio) => (
                    <div
                        key={prio.value}
                        className={styles.BulkActionsMenu__item}
                        onClick={() => handleSelectPriority(prio.value as PriorityLevel)}
                    >
                        <PriorityIcon level={prio.value as PriorityLevel} />
                        <span>{t(`Task.Priority.${prio.value.toLowerCase()}`)}</span>
                    </div>
                ))}

            {view === 'status' &&
                STATUS_OPTIONS.map((statusOption) => (
                    <div
                        key={statusOption.value}
                        className={styles.BulkActionsMenu__item}
                        onClick={() => handleSelectStatus(statusOption.value)}
                    >
                        {statusOption.icon}
                        <span>{t(statusOption.label)}</span>
                    </div>
                ))}

            {view === 'project' &&
                (projects.length > 0 ? (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            className={styles.BulkActionsMenu__item}
                            onClick={() => handleSelectProject(project.id)}
                        >
                            <span
                                className={styles.BulkActionsMenu__dot}
                                style={{ backgroundColor: project.color }}
                            />
                            <span>{project.label}</span>
                        </div>
                    ))
                ) : (
                    <p className={styles.BulkActionsMenu__emptyText}>
                        {t('Task.Modal.noProjects')}
                    </p>
                ))}

            {view === 'tags' &&
                (tags.length > 0 ? (
                    tags.map((tag) => (
                        <Checkbox
                            key={tag.id}
                            className={styles.BulkActionsMenu__checkboxItem}
                            checked={checkedTagIds.includes(tag.id)}
                            onChange={() => handleToggleTag(tag.id)}
                            label={
                                <div className={styles.BulkActionsMenu__checkboxWrapper}>
                                    <span
                                        className={styles.BulkActionsMenu__dot}
                                        style={{ backgroundColor: tag.color }}
                                    />
                                    {tag.label}
                                </div>
                            }
                        />
                    ))
                ) : (
                    <p className={styles.BulkActionsMenu__emptyText}>
                        {t('Task.Modal.noTags')}
                    </p>
                ))}
        </div>
    );
};
