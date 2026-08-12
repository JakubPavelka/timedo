import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { LinkBaseSchema } from '@timedo/shared/src/schemas/linkSchema';
import { useEditableField } from '@/hooks/useEditableField';
import { useUpdateTask } from '@/hooks/api/useTask';
import { ApiError } from '@/api/ApiError';
import { TaskDetailLinkItem } from './TaskDetailLinkItem';
import { TaskDetailLinkEditRow } from './TaskDetailLinkEditRow';
import styles from './TaskDetailLink.module.scss';

type TaskDetailLinkProps = {
    links: { id: string; label: string; url: string }[];
    taskId: string;
};

export const TaskDetailLink = (props: TaskDetailLinkProps) => {
    const { t } = useTranslation();
    const { mutate: updateTask, isPending } = useUpdateTask(props.taskId);
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
        schema: LinkBaseSchema,
        value: { label: '', url: '' },
    });

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraft((prev) => ({ ...prev, label: e.target.value }));
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraft((prev) => ({ ...prev, url: e.target.value }));
    };

    const handleSubmitLink = () => {
        if (isPending) {
            return;
        }

        const value = validate();

        if (value === undefined) {
            return;
        }

        const links = [
            ...props.links.map((link) => ({ label: link.label, url: link.url })),
            { label: value.label, url: value.url },
        ];

        updateTask(
            { links },
            {
                onSuccess: () => {
                    stopAdding();
                    toast.success(t('TaskDetail.addLinkSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                            ? t(`BackendErrors.${err.code}`)
                            : t('TaskDetail.addLinkError')
                    );
                },
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmitLink();
        } else if (e.key === 'Escape') {
            cancelAdding();
        }
    };

    return (
        <div className={styles.TaskDetailLink}>
            {props.links.length > 0 && (
                <div className={styles.TaskDetailLink__linksWrapper}>
                    {props.links.map((link) => (
                        <TaskDetailLinkItem
                            key={link.id}
                            link={link}
                            allLinks={props.links}
                            taskId={props.taskId}
                        />
                    ))}
                </div>
            )}
            {isAdding ? (
                <TaskDetailLinkEditRow
                    draft={draft}
                    error={error}
                    isPending={isPending}
                    onLabelChange={handleLabelChange}
                    onUrlChange={handleUrlChange}
                    onKeyDown={handleKeyDown}
                    onCancel={cancelAdding}
                    onSubmit={handleSubmitLink}
                />
            ) : (
                <div
                    id={'links'}
                    className={styles.TaskDetailLink__addLinkWrapper}
                    onClick={startAdding}
                >
                    <p>{t('Task.Modal.addLink')}</p>
                    <Plus width={16} height={16} />
                </div>
            )}
        </div>
    );
};
