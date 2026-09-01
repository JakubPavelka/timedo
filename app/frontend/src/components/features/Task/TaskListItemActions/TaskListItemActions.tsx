import { useRef, useState, type MouseEvent } from 'react';
import { toast } from 'sonner';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Popover, type PopoverHandle } from '@/components/ui/Popover/Popover';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { TaskListItemActionsMenu } from '@/components/features/Task/TaskListItemActionsMenu/TaskListItemActionsMenu';
import { useDeleteTask } from '@/hooks/api/useTask';
import { getErrorMessage } from '@/utils/getErrorMessage';
import styles from './TaskListItemActions.module.scss';

type TaskListItemActionsProps = {
    taskId: string;
    tagIds: string[];
    className?: string;
};

export const TaskListItemActions = (props: TaskListItemActionsProps) => {
    const { t } = useTranslation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const actionsPopoverRef = useRef<PopoverHandle>(null);
    const { mutate: deleteTask } = useDeleteTask(props.taskId);

    const handleAreaClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleCloseActionsMenu = () => actionsPopoverRef.current?.close();
    const handleShowDeleteModal = () => {
        actionsPopoverRef.current?.close();
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleDeleteTask = () => {
        deleteTask(undefined, {
            onSuccess: () => {
                toast.success(t('TaskDetail.deleteTaskSuccess'));
                handleCloseDeleteModal();
            },
            onError: (err) =>
                toast.error(getErrorMessage(err, 'TaskDetail.deleteTaskError', t)),
        });
    };

    return (
        <div
            className={clsx(styles.TaskListItemActions, props.className)}
            onClick={handleAreaClick}
        >
            <Popover
                ref={actionsPopoverRef}
                align={'right'}
                trigger={
                    <button
                        type={'button'}
                        className={styles.TaskListItemActions__trigger}
                        aria-label={t('Task.taskActions')}
                    >
                        <MoreVertical width={16} height={16} />
                    </button>
                }
            >
                <TaskListItemActionsMenu
                    taskId={props.taskId}
                    tagIds={props.tagIds}
                    onDeleteClick={handleShowDeleteModal}
                    onClose={handleCloseActionsMenu}
                />
            </Popover>
            {showDeleteModal && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleDeleteTask}
                    variant={'danger'}
                    title={t('TaskDetail.deleteTaskModalTitle')}
                    description={t('TaskDetail.deleteTaskModalDescription')}
                    icon={<Trash2 width={18} height={18} />}
                    confirmText={t('General.delete')}
                    confirmIcon={<Trash2 width={16} height={16} />}
                />
            )}
        </div>
    );
};
