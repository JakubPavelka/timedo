import { Pill } from '@/components/ui/Pill/Pill';
import { Plus, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCallback, useState, type KeyboardEvent } from 'react';
import { toast } from 'sonner';
import { Popover } from '@/components/ui/Popover/Popover';
import { useTagStore } from '@/store/tagStore';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { useUpdateTask } from '@/hooks/api/useTask';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { LabelColorForm } from '@/components/features/Forms/LabelColorForm/LabelColorForm';
import { TagSchema, type TagData } from '@timedo/shared/src/schemas/tagsSchema';
import { useCreateTag } from '@/hooks/api/useTag';
import clsx from 'clsx';
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
    const { mutate: updateTask } = useUpdateTask(props.taskId);
    const { mutate: createTag } = useCreateTag();
    const allTags = useTagStore((s) => s.tags);
    const [showCreateTag, setShowCreateTag] = useState(false);

    const isTagChecked = (tagId: string) => props.tags.some((tag) => tag.id === tagId);
    const handleShowCreateTag = () => setShowCreateTag(true);
    const handleHideCreateTag = () => setShowCreateTag(false);
    const handlePopoverOpenChange = useCallback((isOpen: boolean) => {
        if (!isOpen) {
            setShowCreateTag(false);
        }
    }, []);
    const handleCreateTagKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleShowCreateTag();
        }
    };

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
                    toast.error(getErrorMessage(err, 'TaskDetail.updateTagsError', t));
                },
            }
        );
    };

    const handleCreateTag = (data: TagData) => {
        return createTag(data, {
            onSuccess: () => {
                toast.success(t('Task.Modal.createTagSuccess'));
                setShowCreateTag(false);
            },
            onError: (err) => {
                toast.error(getErrorMessage(err, 'Task.Modal.createTagError', t));
            },
        });
    };

    return (
        <div className={styles.TaskDetailTags}>
            <Popover
                onOpenChange={handlePopoverOpenChange}
                trigger={
                    <div className={styles.TaskDetailTags__tagIconWrapper}>
                        <div className={styles.TaskDetailTags__tagIcon}>
                            <Tag width={18} height={18} />
                        </div>
                        <p>{t('Task.Modal.tags')}</p>
                    </div>
                }
            >
                <div
                    className={clsx(
                        styles.TaskDetailTags__popover,
                        showCreateTag && styles['TaskDetailTags__popover--createActive']
                    )}
                >
                    {showCreateTag ? (
                        <LabelColorForm
                            schema={TagSchema}
                            namePlaceholder={t('Task.Modal.tagName')}
                            onSubmit={handleCreateTag}
                            onClose={handleHideCreateTag}
                        />
                    ) : allTags.length > 0 ? (
                        allTags.map((tag) => (
                            <Checkbox
                                key={tag.id}
                                checked={isTagChecked(tag.id)}
                                onChange={() => handleOnCheckboxChange(tag.id)}
                                label={
                                    <div
                                        className={styles.TaskDetailTags__checkboxWrapper}
                                    >
                                        <span
                                            className={styles.TaskDetailTags__dot}
                                            style={{ color: tag.color }}
                                        />
                                        {tag.label}
                                    </div>
                                }
                            />
                        ))
                    ) : (
                        <p className={styles.TaskDetailTags__noTagsText}>
                            {t('Task.Modal.noTags')}
                        </p>
                    )}
                    {!showCreateTag && (
                        <div
                            onClick={handleShowCreateTag}
                            onKeyDown={handleCreateTagKeyDown}
                            role={'button'}
                            tabIndex={0}
                            className={styles.TaskDetailTags__createTagWrapper}
                        >
                            <p className={styles.TaskDetailTags__createTagText}>
                                {t('Task.Modal.createTag')}
                            </p>
                            <Plus width={16} height={16} />
                        </div>
                    )}
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
