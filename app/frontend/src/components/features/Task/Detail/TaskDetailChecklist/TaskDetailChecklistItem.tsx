import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import {
    useUpdateTaskChecklist,
    useDeleteTaskChecklist,
} from '@/hooks/api/useTaskChecklist';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { TaskChecklistItem as TaskChecklistItemData } from '@/api/taskChecklist/taskChecklist.api';
import styles from './TaskDetailChecklist.module.scss';

export type ChecklistNode = TaskChecklistItemData & { children: ChecklistNode[] };

type TaskDetailChecklistItemProps = {
    item: ChecklistNode;
    taskId: string;
};

export const TaskDetailChecklistItem = (props: TaskDetailChecklistItemProps) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(true);
    const { mutate: updateItem } = useUpdateTaskChecklist(props.taskId);
    const { mutate: deleteItem } = useDeleteTaskChecklist(props.taskId);

    const hasChildren = props.item.children.length > 0;

    const handleToggleExpanded = () => setExpanded((prev) => !prev);

    const handleToggleCompleted = () => {
        updateItem(
            { id: props.item.id, completed: !props.item.completed },
            {
                onError: (err) => {
                    toast.error(
                        getErrorMessage(err, 'TaskDetail.updateChecklistItemError', t)
                    );
                },
            }
        );
    };

    const handleDelete = () => {
        deleteItem(props.item.id, {
            onSuccess: () => {
                toast.success(t('TaskDetail.deleteChecklistItemSuccess'));
            },
            onError: (err) => {
                toast.error(
                    getErrorMessage(err, 'TaskDetail.deleteChecklistItemError', t)
                );
            },
        });
    };

    return (
        <div className={styles.TaskDetailChecklistItem}>
            <div className={styles.TaskDetailChecklistItem__row}>
                <Checkbox
                    round
                    variant={'outline'}
                    checked={props.item.completed}
                    onChange={handleToggleCompleted}
                />
                <p
                    className={clsx(
                        styles.TaskDetailChecklistItem__label,
                        props.item.completed &&
                            styles['TaskDetailChecklistItem__label--completed']
                    )}
                >
                    {props.item.label}
                </p>
                <X
                    className={styles.TaskDetailChecklistItem__deleteIcon}
                    onClick={handleDelete}
                    width={16}
                    height={16}
                />
                {hasChildren && (
                    <ChevronDown
                        className={clsx(
                            styles.TaskDetailChecklistItem__chevron,
                            !expanded &&
                                styles['TaskDetailChecklistItem__chevron--collapsed']
                        )}
                        onClick={handleToggleExpanded}
                        width={16}
                        height={16}
                    />
                )}
            </div>
            {hasChildren && expanded && (
                <div className={styles.TaskDetailChecklistItem__children}>
                    {props.item.children.map((child) => (
                        <TaskDetailChecklistItem
                            key={child.id}
                            item={child}
                            taskId={props.taskId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
