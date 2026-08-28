import { ProgressCard } from '@/components/ui/ProgressCard/ProgressCard';
import { useDeleteTag, useGetTagsWithTasks } from '@/hooks/api/useTag';
import { AddCard } from '@/components/ui/AddCard/AddCard';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import styles from './TagsView.module.scss';

export const TagsView = () => {
    const { t } = useTranslation();
    const [showEditModal, setShowEditModal] = useState(false);
    const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
    const { data: tags } = useGetTagsWithTasks();
    const { mutate: deleteTag } = useDeleteTag();

    console.log(deletingTagId);

    const handleShowEditModal = () => setShowEditModal(true);
    const handleHideEditModal = () => setShowEditModal(false);
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
                            onEdit={handleShowEditModal}
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
        </>
    );
};
