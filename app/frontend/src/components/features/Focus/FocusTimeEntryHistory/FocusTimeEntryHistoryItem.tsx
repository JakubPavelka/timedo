import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { Pill } from '@/components/ui/Pill/Pill';
import { Link } from '@tanstack/react-router';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FocusTimeEntryHistoryItem.module.scss';

export type FocusTimeEntryHistoryItemProps = {
    id: string;
    timeTracked: string;
    timeStartedAt: string;
    date: string;
    title?: string;
    taskId?: string;
    estimatedTime?: string;
    description?: string;
    project?: { label: string; color: string };
    onDeleteClick?: () => Promise<void>;
};

export const FocusTimeEntryHistoryItem = (props: FocusTimeEntryHistoryItemProps) => {
    const { t } = useTranslation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleConfirmDelete = async () => {
        try {
            await props?.onDeleteClick?.();
            handleCloseDeleteModal();
        } catch {
            //
        }
    };

    const content = (
        <>
            <div className={styles.FocusTimeEntryHistoryItem__flex}>
                <div className={styles.FocusTimeEntryHistoryItem__dateWrapper}>
                    <p className={styles.FocusTimeEntryHistoryItem__date}>{props.date}</p>
                    <p className={styles.FocusTimeEntryHistoryItem__time}>
                        {props.timeStartedAt}
                    </p>
                </div>
                <div className={styles.FocusTimeEntryHistoryItem__titleWrapper}>
                    <div className={styles.FocusTimeEntryHistoryItem__pillWrapper}>
                        <p className={styles.FocusTimeEntryHistoryItem__title}>
                            {props.title ?? t('Focus.History.untrackedTime')}
                        </p>
                        {props.project && (
                            <Pill dot color={props.project.color}>
                                {props.project.label}
                            </Pill>
                        )}
                    </div>
                    {props.description && (
                        <p className={styles.FocusTimeEntryHistoryItem__description}>
                            {props.description}
                        </p>
                    )}
                </div>
            </div>
            <div className={styles.FocusTimeEntryHistoryItem__rightSide}>
                <div className={styles.FocusTimeEntryHistoryItem__statsWrapper}>
                    <p className={styles.FocusTimeEntryHistoryItem__delta}>
                        {props.timeTracked}
                    </p>
                    {props.estimatedTime && (
                        <p className={styles.FocusTimeEntryHistoryItem__progressLabel}>
                            {props.timeTracked} / {props.estimatedTime}
                        </p>
                    )}
                </div>
                <div onClick={handleDeleteClick} role={'button'} tabIndex={0}>
                    <Trash width={16} height={16} />
                </div>
            </div>
        </>
    );

    return (
        <>
            <li className={styles.FocusTimeEntryHistoryItem}>
                {props.taskId ? (
                    <Link to="/dashboard/tasks/$taskId" params={{ taskId: props.taskId }}>
                        {content}
                    </Link>
                ) : (
                    content
                )}
            </li>
            {showDeleteModal && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                    variant={'danger'}
                    title={t('Focus.timeEntryDeleteModalTitle')}
                    description={t('Focus.timeEntryDeleteModalDescription')}
                    icon={
                        <Trash
                            className={styles.FocusTimeEntryHistoryItem__deleteModalIcon}
                            width={18}
                            height={18}
                        />
                    }
                    confirmText={t('General.delete')}
                    confirmIcon={<Trash width={16} height={16} />}
                />
            )}
        </>
    );
};
