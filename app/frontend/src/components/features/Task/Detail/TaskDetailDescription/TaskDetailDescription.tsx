import { useTranslation } from 'react-i18next';
import { useEditableField } from '@/hooks/useEditableField';
import { UpdateTaskSchema } from '@timedo/shared/src/schemas/taskSchema';
import { useUpdateTask } from '@/hooks/api/useTask';
import { toast } from 'sonner';
import { ApiError } from '@/api/ApiError';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import styles from './TaskDetailDescription.module.scss';
import { Plus } from 'lucide-react';

type TaskDetailDescriptionProps = {
    description: string;
    taskId: string;
};

export const TaskDetailDescription = (props: TaskDetailDescriptionProps) => {
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
        schema: UpdateTaskSchema.shape.description,
        value: props.description,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDraft(e.target.value);
    };

    const handleSubmitDescription = () => {
        if (isPending) {
            return;
        }

        if (draft === props.description) {
            cancelEditing();
            return;
        }

        const value = validate();

        if (value === undefined) {
            return;
        }

        updateTask(
            { description: value },
            {
                onSuccess: () => {
                    stopEditing();
                    toast.success(t('TaskDetail.updateDescriptionSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                            ? t(`BackendErrors.${err.code}`)
                            : t('TaskDetail.updateDescriptionError')
                    );
                },
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    return (
        <>
            {isEditing ? (
                <>
                    <Textarea
                        value={draft}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSubmitDescription}
                        disabled={isPending}
                        autoFocus
                    />
                    {error && (
                        <p className={styles.TaskDetailDescription__error}>{t(error)}</p>
                    )}
                </>
            ) : (
                <p onClick={startEditing} className={styles.TaskDetailDescription__text}>
                    {props.description || (
                        <span className={styles.TaskDetailDescription__emptyTextWrapper}>
                            {t('TaskDetail.withoutDescription')}
                            <Plus width={16} height={16} />
                        </span>
                    )}
                </p>
            )}
        </>
    );
};
