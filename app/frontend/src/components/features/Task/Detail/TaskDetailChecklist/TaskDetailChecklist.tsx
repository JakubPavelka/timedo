import { useTranslation } from 'react-i18next';
import { Check, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Pill } from '@/components/ui/Pill/Pill';
import { Input } from '@/components/ui/Input/Input';
import { useEditableField } from '@/hooks/useEditableField';
import { getErrorMessage } from '@/utils/getErrorMessage';
import {
    useCreateTaskChecklist,
    useReadTaskChecklist,
} from '@/hooks/api/useTaskChecklist';
import type { TaskChecklistItem } from '@/api/taskChecklist/taskChecklist.api';
import { TaskDetailChecklistItem, type ChecklistNode } from './TaskDetailChecklistItem';
import { AddChecklistItemSchema } from './taskDetailChecklist.schema';
import styles from './TaskDetailChecklist.module.scss';

type TaskDetailChecklistProps = {
    taskId: string;
};

const buildChecklistTree = (items: TaskChecklistItem[]): ChecklistNode[] => {
    const nodeMap = new Map<string, ChecklistNode>();
    items.forEach((item) => nodeMap.set(item.id, { ...item, children: [] }));

    const roots: ChecklistNode[] = [];

    nodeMap.forEach((node) => {
        const parent = node.parentId ? nodeMap.get(node.parentId) : undefined;
        if (parent) {
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
};

export const TaskDetailChecklist = (props: TaskDetailChecklistProps) => {
    const { t } = useTranslation();
    const { data: items } = useReadTaskChecklist(props.taskId);
    const { mutate: createItem, isPending: isCreating } = useCreateTaskChecklist(
        props.taskId
    );
    const {
        startEditing: startAdding,
        isEditing: isAdding,
        cancelEditing: cancelAdding,
        stopEditing: stopAdding,
        draft,
        setDraft,
        error,
        validate,
    } = useEditableField({
        schema: AddChecklistItemSchema,
        value: { label: '' },
    });

    const allItems = items ?? [];
    const tree = buildChecklistTree(allItems);
    const totalCount = allItems.length;
    const completedCount = allItems.filter((item) => item.completed).length;

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraft({ label: e.target.value });
    };

    const handleAddItem = () => {
        if (isCreating) {
            return;
        }

        const value = validate();

        if (value === undefined) {
            return;
        }

        createItem(
            { label: value.label },
            {
                onSuccess: () => {
                    stopAdding();
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddItem();
        } else if (e.key === 'Escape') {
            cancelAdding();
        }
    };

    return (
        <div className={styles.TaskDetailChecklist}>
            <div className={styles.TaskDetailChecklist__header}>
                <p className={styles.TaskDetailChecklist__heading}>
                    {t('TaskDetail.checklist')}
                </p>
                <Pill>{`${completedCount}/${totalCount}`}</Pill>
            </div>
            {tree.length > 0 && (
                <div className={styles.TaskDetailChecklist__list}>
                    {tree.map((node) => (
                        <TaskDetailChecklistItem
                            key={node.id}
                            item={node}
                            taskId={props.taskId}
                        />
                    ))}
                </div>
            )}
            {isAdding ? (
                <div className={styles.TaskDetailChecklist__addRow}>
                    <Input
                        className={styles.TaskDetailChecklist__addInput}
                        value={draft.label}
                        onChange={handleLabelChange}
                        onKeyDown={handleKeyDown}
                        placeholder={t('TaskDetail.addChecklistItem')}
                        variant={'filled'}
                        disabled={isCreating}
                        autoFocus
                    />
                    <X
                        className={styles.TaskDetailChecklist__actionIcon}
                        onClick={cancelAdding}
                        width={18}
                        height={18}
                    />
                    <Check
                        className={styles.TaskDetailChecklist__actionIcon}
                        onClick={handleAddItem}
                        width={18}
                        height={18}
                    />
                </div>
            ) : (
                <div
                    className={styles.TaskDetailChecklist__addTrigger}
                    onClick={startAdding}
                >
                    <Plus width={16} height={16} />
                    <p>{t('TaskDetail.addChecklistItem')}</p>
                </div>
            )}
            {error && <p className={styles.TaskDetailChecklist__error}>{t(error)}</p>}
        </div>
    );
};
