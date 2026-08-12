import { Pill } from '@/components/ui/Pill/Pill';
import { Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { toast } from 'sonner';
import { Popover } from '@/components/ui/Popover/Popover';
import { useTagStore } from '@/store/tagStore';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { useUpdateTask } from '@/hooks/api/useTask';
import { ApiError } from '@/api/ApiError';
import styles from './TaskDetailTags.module.scss';

type TaskDetailTagsProps = {
    tags: {
        id: string;
        label: string;
        color: string;
    }[];
    taskId: string;
};

export const TaskDetailTags = (props: TaskDetailTagsProps) => {
    const { t } = useTranslation();
    const allTags = useTagStore((s) => s.tags);
    const { mutate: updateTask } = useUpdateTask(props.taskId);
    const [showCreateTag, setShowCreateTag] = useState(false);

    const isTagChecked = (tagId: string) => props.tags.some((tag) => tag.id === tagId);

    const handleOnCheckboxChange = (tagId: string) => {
        const tagIds = isTagChecked(tagId)
            ? props.tags.filter((tag) => tag.id !== tagId).map((tag) => tag.id)
            : [...props.tags.map((tag) => tag.id), tagId];

        updateTask(
            { tags: tagIds },
            {
                onSuccess: () => {
                    toast.success(t('TaskDetail.updateTagsSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                            ? t(`BackendErrors.${err.code}`)
                            : t('TaskDetail.updateTagsError')
                    );
                },
            }
        );
    };

    return (
        <div className={styles.TaskDetailTags}>
            <Popover
                trigger={
                    <div className={styles.TaskDetailTags__tagIconWrapper}>
                        <div className={styles.TaskDetailTags__tagIcon}>
                            <Tag width={18} height={18} />
                        </div>
                        <p>{t('Task.Modal.tags')}</p>
                    </div>
                }
            >
                <div className={styles.TaskDetailTags__popover}>
                    {allTags.map((tag) => (
                        <Checkbox
                            key={tag.id}
                            checked={isTagChecked(tag.id)}
                            onChange={() => handleOnCheckboxChange(tag.id)}
                            label={
                                <div className={styles.TaskDetailTags__checkboxWrapper}>
                                    <span
                                        className={styles.TaskDetailTags__dot}
                                        style={{ color: tag.color }}
                                    />
                                    {tag.label}
                                </div>
                            }
                        />
                    ))}
                </div>
            </Popover>

            <div className={styles.TaskDetailTags__tags}>
                {props.tags.map((tag) => (
                    <Pill key={tag.id} variant={'colored'} color={tag.color} hashtag>
                        {tag.label}
                    </Pill>
                ))}
            </div>
        </div>
    );
};
