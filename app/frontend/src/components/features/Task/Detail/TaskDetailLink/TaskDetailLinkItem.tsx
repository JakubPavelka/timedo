import { useTranslation } from 'react-i18next';
import { Check, Edit, X } from 'lucide-react';
import { toast } from 'sonner';
import { LinkBaseSchema } from '@timedo/shared/src/schemas/linkSchema';
import { LinkItem } from '@/components/ui/LinkItem/LinkItem';
import { Input } from '@/components/ui/Input/Input';
import { useEditableField } from '@/hooks/useEditableField';
import { useUpdateTask } from '@/hooks/api/useTask';
import { ApiError } from '@/api/ApiError';
import styles from './TaskDetailLink.module.scss';

type Link = { id: string; label: string; url: string };

type TaskDetailLinkItemProps = {
    link: Link;
    allLinks: Link[];
    taskId: string;
};

export const TaskDetailLinkItem = (props: TaskDetailLinkItemProps) => {
    const { t } = useTranslation();
    const { mutate: updateTask, isPending } = useUpdateTask(props.taskId);
    const {
        startEditing,
        isEditing,
        cancelEditing,
        stopEditing,
        draft,
        setDraft,
        error,
        validate,
    } = useEditableField({
        schema: LinkBaseSchema,
        value: { label: props.link.label, url: props.link.url },
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

        if (draft.label === props.link.label && draft.url === props.link.url) {
            cancelEditing();
            return;
        }

        const value = validate();

        if (value === undefined) {
            return;
        }

        const links = props.allLinks.map((link) =>
            link.id === props.link.id
                ? { label: value.label, url: value.url }
                : { label: link.label, url: link.url }
        );

        updateTask(
            { links },
            {
                onSuccess: () => {
                    stopEditing();
                    toast.success(t('TaskDetail.updateLinkSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                            ? t(`BackendErrors.${err.code}`)
                            : t('TaskDetail.updateLinkError')
                    );
                },
            }
        );
    };

    const handleDeleteLink = () => {
        if (isPending) {
            return;
        }

        const links = props.allLinks
            .filter((link) => link.id !== props.link.id)
            .map((link) => ({ label: link.label, url: link.url }));

        updateTask(
            { links },
            {
                onSuccess: () => {
                    toast.success(t('TaskDetail.deleteLinkSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                            ? t(`BackendErrors.${err.code}`)
                            : t('TaskDetail.deleteLinkError')
                    );
                },
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmitLink();
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    if (isEditing) {
        return (
            <div>
                <div className={styles.TaskDetailLink__editInputs}>
                    <Input
                        className={styles.TaskDetailLink__editInput}
                        value={draft.label}
                        onChange={handleLabelChange}
                        onKeyDown={handleKeyDown}
                        placeholder={t('Task.Modal.linkName')}
                        variant={'filled'}
                        disabled={isPending}
                        autoFocus
                    />
                    <Input
                        className={styles.TaskDetailLink__editInput}
                        value={draft.url}
                        onChange={handleUrlChange}
                        onKeyDown={handleKeyDown}
                        placeholder={t('Task.Modal.linkUrl')}
                        variant={'filled'}
                        disabled={isPending}
                    />
                    <X
                        className={styles.TaskDetailLink__actionIcon}
                        onClick={cancelEditing}
                        width={18}
                        height={18}
                    />
                    <Check
                        className={styles.TaskDetailLink__actionIcon}
                        onClick={handleSubmitLink}
                        width={18}
                        height={18}
                    />
                </div>
                {error && <p className={styles.TaskDetailLink__error}>{t(error)}</p>}
            </div>
        );
    }

    return (
        <div className={styles.TaskDetailView__linkWrapper}>
            <LinkItem
                className={styles.TaskDetailLink__link}
                url={props.link.url}
                label={props.link.label}
            />
            <X
                className={styles.TaskDetailLink__actionIcon}
                onClick={handleDeleteLink}
                width={18}
                height={18}
            />
            <Edit
                className={styles.TaskDetailLink__actionIcon}
                onClick={startEditing}
                width={18}
                height={18}
            />
        </div>
    );
};
