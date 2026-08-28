import { ProgressCard } from '@/components/ui/ProgressCard/ProgressCard';
import {
    useCreateTag,
    useDeleteTag,
    useGetTagsWithTasks,
    useUpdateTag,
} from '@/hooks/api/useTag';
import { AddCard } from '@/components/ui/AddCard/AddCard';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { LabelColorModal } from '@/components/ui/Modal/LabelColorModal/LabelColorModal';
import { TagSchema, type TagData } from '@timedo/shared/src/schemas/tagsSchema';
import type { TagWithTasks } from '@/api/tag/tag.api';
import { PRESET_COLORS } from '@/data/labelColorData';
import styles from './TagsView.module.scss';

export const TagsView = () => {
    const { t } = useTranslation();
    const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
    const [editingTag, setEditingTag] = useState<TagWithTasks | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { data: tags } = useGetTagsWithTasks();
    const { mutate: deleteTag } = useDeleteTag();
    const { mutate: updateTag } = useUpdateTag();
    const { mutate: createTag } = useCreateTag();

    const handleShowEditModal = (tag: TagWithTasks) => setEditingTag(tag);
    const handleHideEditModal = () => setEditingTag(null);
    const handleShowDeleteModal = (tagId: string) => setDeletingTagId(tagId);
    const handleHideDeleteModal = () => setDeletingTagId(null);
    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleHideCreateModal = () => setShowCreateModal(false);

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

    const handleTagCreate = (data: TagData) => {
        createTag(data, {
            onSuccess: () => {
                toast.success(t('Tags.CreateModal.success'));
                handleHideCreateModal();
            },
            onError: (err) =>
                toast.error(getErrorMessage(err, 'Tags.CreateModal.error', t)),
        });
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
                    <AddCard text={t('Tags.newTag')} onClick={handleShowCreateModal} />
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
                <LabelColorModal
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
            {showCreateModal && (
                <LabelColorModal
                    isOpen={showCreateModal}
                    onClose={handleHideCreateModal}
                    onSubmit={handleTagCreate}
                    schema={TagSchema}
                    title={t('Tags.CreateModal.title')}
                    description={t('Tags.CreateModal.description')}
                    nameLabel={t('Tags.CreateModal.name')}
                    colorLabel={t('Tags.CreateModal.color')}
                    defaultValues={{ label: '', color: PRESET_COLORS[0] }}
                    creating
                />
            )}
        </>
    );
};
