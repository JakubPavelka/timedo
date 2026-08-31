import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { Input } from '@/components/ui/Input/Input';
import { useEditableField } from '@/hooks/useEditableField';
import {
    useCreateTaskChecklist,
    useUpdateTaskChecklist,
    useDeleteTaskChecklist,
} from '@/hooks/api/useTaskChecklist';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { TaskChecklistItem as TaskChecklistItemData } from '@/api/taskChecklist/taskChecklist.api';
import { AddChecklistItemSchema } from './taskDetailChecklist.schema';
import styles from './TaskDetailChecklist.module.scss';

export type ChecklistNode = TaskChecklistItemData & { children: ChecklistNode[] };

type TaskDetailChecklistItemProps = {
    item: ChecklistNode;
    taskId: string;
};

export const TaskDetailChecklistItem = (props: TaskDetailChecklistItemProps) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(true);
    const { mutate: updateItem, isPending: isUpdating } = useUpdateTaskChecklist(
        props.taskId
    );
    const { mutate: deleteItem } = useDeleteTaskChecklist(props.taskId);
    const { mutate: createItem, isPending: isCreatingChild } = useCreateTaskChecklist(
        props.taskId
    );

    const {
        startEditing: startEditingLabel,
        isEditing: isEditingLabel,
        cancelEditing: cancelEditingLabel,
        stopEditing: stopEditingLabel,
        draft: labelDraft,
        setDraft: setLabelDraft,
        error: labelError,
        validate: validateLabel,
    } = useEditableField({
        schema: AddChecklistItemSchema,
        value: { label: props.item.label },
    });

    const {
        startEditing: startAddingChild,
        isEditing: isAddingChild,
        cancelEditing: cancelAddingChild,
        stopEditing: stopAddingChild,
        draft: childDraft,
        setDraft: setChildDraft,
        error: childError,
        validate: validateChild,
    } = useEditableField({
        schema: AddChecklistItemSchema,
        value: { label: '' },
    });

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

    const handleLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabelDraft({ label: e.target.value });
    };

    const handleSubmitLabel = () => {
        if (isUpdating) {
            return;
        }

        if (labelDraft.label === props.item.label) {
            cancelEditingLabel();
            return;
        }

        const value = validateLabel();

        if (value === undefined) {
            return;
        }

        updateItem(
            { id: props.item.id, label: value.label },
            {
                onSuccess: () => {
                    stopEditingLabel();
                    toast.success(t('TaskDetail.updateChecklistItemSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        getErrorMessage(err, 'TaskDetail.updateChecklistItemError', t)
                    );
                },
            }
        );
    };

    const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmitLabel();
        } else if (e.key === 'Escape') {
            cancelEditingLabel();
        }
    };

    const handleStartAddingChild = () => {
        setExpanded(true);
        startAddingChild();
    };

    const handleChildLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChildDraft({ label: e.target.value });
    };

    const handleAddChild = () => {
        if (isCreatingChild) {
            return;
        }

        const value = validateChild();

        if (value === undefined) {
            return;
        }

        createItem(
            { label: value.label, parentId: props.item.id },
            {
                onSuccess: () => {
                    stopAddingChild();
                    toast.success(t('TaskDetail.addChecklistItemSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        getErrorMessage(err, 'TaskDetail.addChecklistItemError', t)
                    );
                },
            }
        );
    };

    const handleChildKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddChild();
        } else if (e.key === 'Escape') {
            cancelAddingChild();
        }
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
                {isEditingLabel ? (
                    <Input
                        className={styles.TaskDetailChecklistItem__labelInput}
                        value={labelDraft.label}
                        onChange={handleLabelInputChange}
                        onKeyDown={handleLabelKeyDown}
                        onBlur={handleSubmitLabel}
                        disabled={isUpdating}
                        variant={'ghost'}
                        autoFocus
                    />
                ) : (
                    <p
                        className={clsx(
                            styles.TaskDetailChecklistItem__label,
                            props.item.completed &&
                                styles['TaskDetailChecklistItem__label--completed']
                        )}
                        onClick={startEditingLabel}
                    >
                        {props.item.label}
                    </p>
                )}
                <Plus
                    className={styles.TaskDetailChecklistItem__addChildIcon}
                    onClick={handleStartAddingChild}
                    width={16}
                    height={16}
                />
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
            {labelError && (
                <p className={styles.TaskDetailChecklistItem__error}>{t(labelError)}</p>
            )}
            {(hasChildren || isAddingChild) && expanded && (
                <div className={styles.TaskDetailChecklistItem__children}>
                    {props.item.children.map((child) => (
                        <TaskDetailChecklistItem
                            key={child.id}
                            item={child}
                            taskId={props.taskId}
                        />
                    ))}
                    {isAddingChild && (
                        <div className={styles.TaskDetailChecklistItem__addChildRow}>
                            <Input
                                className={styles.TaskDetailChecklistItem__addChildInput}
                                value={childDraft.label}
                                onChange={handleChildLabelChange}
                                onKeyDown={handleChildKeyDown}
                                placeholder={t('TaskDetail.addChecklistItem')}
                                variant={'filled'}
                                disabled={isCreatingChild}
                                autoFocus
                            />
                            <X
                                className={styles.TaskDetailChecklistItem__actionIcon}
                                onClick={cancelAddingChild}
                                width={18}
                                height={18}
                            />
                            <Check
                                className={styles.TaskDetailChecklistItem__actionIcon}
                                onClick={handleAddChild}
                                width={18}
                                height={18}
                            />
                        </div>
                    )}
                    {childError && (
                        <p className={styles.TaskDetailChecklistItem__error}>
                            {t(childError)}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
