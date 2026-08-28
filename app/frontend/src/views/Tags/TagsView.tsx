import { ProgressCard } from '@/components/ui/ProgressCard/ProgressCard';
import { useDeleteTag, useGetTagsWithTasks, useUpdateTag } from '@/hooks/api/useTag';
import { AddCard } from '@/components/ui/AddCard/AddCard';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { EditLabelColorModal } from '@/components/ui/Modal/EditLabelColorModal/EditLabelColorModal';
import { TagSchema, type TagData } from '@timedo/shared/src/schemas/tagsSchema';
import type { TagWithTasks } from '@/api/tag/tag.api';
import styles from './TagsView.module.scss';

export const TagsView = () => {
    const { t } = useTranslation();
    const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
    const [editingTag, setEditingTag] = useState<TagWithTasks | null>(null);
    const { data: tags } = useGetTagsWithTasks();
    const { mutate: deleteTag } = useDeleteTag();
    const { mutate: updateTag } = useUpdateTag();

    const handleShowEditModal = (tag: TagWithTasks) => setEditingTag(tag);
    const handleHideEditModal = () => setEditingTag(null);
    const handleShowDeleteModal = (tagId: string) => setDeletingTagId(tagId);
    const handleHideDeleteModal = () => setDeletingTagId(null);

    const handleTagDelete = () => {
        if (!deletingTagId) {
            return;
        }

        deleteTag(deletingTagId, {
            onSuccess: () => {
                toast.success(t('Tags.DeleteModal.success'));
                handleHideDeleteModal();
            },
            onError: (err) =>
                toast.error(getErrorMessage(err, 'Tags.DeleteModal.error', t)),
        });
    };

    const handleTagUpdate = (data: TagData) => {
        if (!editingTag) {
            return;
        }

        updateTag(
            { ...data, id: editingTag.id },
            {
                onSuccess: () => {
                    toast.success(t('Tags.EditModal.success'));
                    handleHideEditModal();
                },
                onError: (err) =>
                    toast.error(getErrorMessage(err, 'Tags.EditModal.error', t)),
            }
        );
    };

    return (
        <>
            <div className={styles.TagsView}>
                <div className={styles.TagsView__grid}>
                    {tags?.map((tag) => (
                        <ProgressCard
                            key={tag.id}
                            title={tag.label}
                            color={tag.color}
                            tasksDone={tag.tasksDone}
                            totalTasks={tag.totalTasks}
                            duration={tag.duration}
                            onDelete={() => handleShowDeleteModal(tag.id)}
                            onEdit={() => handleShowEditModal(tag)}
                        />
                    ))}
                    <AddCard text={t('Tags.newTag')} onClick={() => console.log('xd')} />
                </div>
            </div>
            {!!deletingTagId && (
                <ConfirmModal
                    isOpen={!!deletingTagId}
                    onClose={handleHideDeleteModal}
                    title={t('Tags.DeleteModal.title')}
                    description={t('Tags.DeleteModal.description')}
                    confirmText={t('General.delete')}
                    onConfirm={handleTagDelete}
                    variant={'danger'}
                    confirmIcon={<Trash width={16} height={16} />}
                    icon={
                        <Trash
                            className={styles.TagsView__deleteIcon}
                            width={18}
                            height={18}
                        />
                    }
                />
            )}
            {!!editingTag && (
                <EditLabelColorModal
                    isOpen={!!editingTag}
                    onClose={handleHideEditModal}
                    onSubmit={handleTagUpdate}
                    schema={TagSchema}
                    title={t('Tags.EditModal.title')}
                    description={t('Tags.EditModal.description')}
                    nameLabel={t('Tags.CreateModal.name')}
                    colorLabel={t('Tags.CreateModal.color')}
                    defaultValues={{ label: editingTag.label, color: editingTag.color }}
                />
            )}
        </>
    );
};
