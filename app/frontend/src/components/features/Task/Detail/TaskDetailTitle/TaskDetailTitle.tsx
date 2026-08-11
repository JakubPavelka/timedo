import { useTranslation } from 'react-i18next';
import { useEditableField } from '@/hooks/useEditableField';
import { UpdateTaskSchema } from '@timedo/shared/src/schemas/taskSchema';
import { Input } from '@/components/ui/Input/Input';
import { useUpdateTask } from '@/hooks/api/useTask';
import { toast } from 'sonner';
import { ApiError } from '@/api/ApiError';
import styles from './TaskDetailTitle.module.scss';

type TaskDetailTitleProps = {
    title: string;
    taskId: string;
};

export const TaskDetailTitle = (props: TaskDetailTitleProps) => {
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
        schema: UpdateTaskSchema.shape.title,
        value: props.title,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraft(e.target.value);
    };

    const handleSubmitTitle = () => {
        if (isPending) {
            return;
        }

        const value = validate();

        if (value === undefined) {
            return;
        }

        updateTask(
            { title: value },
            {
                onSuccess: () => {
                    stopEditing();
                    toast.success(t('TaskDetail.updateTitleSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                            ? t(`BackendErrors.${err.code}`)
                            : t('TaskDetail.updateTitleError')
                    );
                },
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmitTitle();
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    return (
        <>
            {isEditing ? (
                <>
                    <Input
                        className={styles.TaskDetailTitle__titleEditInput}
                        value={draft}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSubmitTitle}
                        disabled={isPending}
                        variant={'ghost'}
                        autoFocus
                    />
                    {error && (
                        <p className={styles.TaskDetailTitle__titleError}>{t(error)}</p>
                    )}
                </>
            ) : (
                <p onClick={startEditing} className={styles.TaskDetailTitle__taskName}>
                    {props.title}
                </p>
            )}
        </>
    );
};
