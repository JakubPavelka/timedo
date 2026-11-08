import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { Pill } from '@/components/ui/Pill/Pill';
import { ChevronRight, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Input } from '@/components/ui/Input/Input';
import { Select, type SelectOption } from '@/components/ui/Select/Select';
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
    taskTotalTime?: string;
    taskEstimatedTime?: string;
    description?: string;
    project?: { label: string; color: string };
    onDeleteClick?: () => Promise<void>;
    onItemClick?: (id: string) => void;
    isExpanded?: boolean;
    taskOptions?: SelectOption[];
    onTaskChange?: (taskId: string | null) => void;
    onDescriptionSubmit?: (description: string) => void;
};

type FocusTimeEntryHistoryItemEditProps = {
    taskId?: string;
    title?: string;
    description?: string;
    taskOptions: SelectOption[];
    onTaskChange?: (taskId: string | null) => void;
    onDescriptionSubmit?: (description: string) => void;
};

const FocusTimeEntryHistoryItemEdit = (props: FocusTimeEntryHistoryItemEditProps) => {
    const { t } = useTranslation();
    const description = props.description ?? '';
    const [descriptionDraft, setDescriptionDraft] = useState(description);

    const isCurrentTaskMissing =
        !!props.taskId &&
        !props.taskOptions.some((option) => option.value === props.taskId);
    const taskOptions =
        isCurrentTaskMissing && props.title
            ? [{ value: props.taskId!, label: props.title }, ...props.taskOptions]
            : props.taskOptions;

    const handleTaskChange = (taskId: string) => props.onTaskChange?.(taskId);

    const handleTaskClear = () => props.onTaskChange?.(null);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescriptionDraft(e.target.value);
    };

    const handleDescriptionBlur = () => {
        const value = descriptionDraft.trim();

        if (value !== description) {
            props.onDescriptionSubmit?.(value);
        }
    };

    const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <div className={styles.FocusTimeEntryHistoryItem__edit}>
            <div className={styles.FocusTimeEntryHistoryItem__editSelect}>
                <Select
                    value={props.taskId}
                    options={taskOptions}
                    onChange={handleTaskChange}
                    onClear={handleTaskClear}
                    placeholder={t('Focus.selectTask')}
                    emptyText={t('Focus.Tracking.noTasks')}
                />
            </div>
            <Input
                variant={'filled'}
                className={styles.FocusTimeEntryHistoryItem__editInput}
                value={descriptionDraft}
                onChange={handleDescriptionChange}
                onBlur={handleDescriptionBlur}
                onKeyDown={handleDescriptionKeyDown}
                placeholder={t('Focus.descriptionPlaceholder')}
            />
            {props.taskId && (
                <Link
                    to={'/dashboard/tasks/$taskId'}
                    params={{ taskId: props.taskId }}
                    className={styles.FocusTimeEntryHistoryItem__taskLink}
                >
                    <span>{t('Focus.taskDetail')}</span>
                    <ChevronRight width={16} height={16} />
                </Link>
            )}
        </div>
    );
};

export const FocusTimeEntryHistoryItem = (props: FocusTimeEntryHistoryItemProps) => {
    const { t } = useTranslation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const handleItemClick = () => props.onItemClick?.(props.id);

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleConfirmDelete = async () => {
        try {
            await props?.onDeleteClick?.();
            handleCloseDeleteModal();
        } catch {
            //
        }
    };

    return (
        <>
            <li className={styles.FocusTimeEntryHistoryItem}>
                <div
                    className={styles.FocusTimeEntryHistoryItem__row}
                    onClick={handleItemClick}
                    aria-expanded={props.isExpanded}
                >
                    <div className={styles.FocusTimeEntryHistoryItem__flex}>
                        <div className={styles.FocusTimeEntryHistoryItem__dateWrapper}>
                            <p className={styles.FocusTimeEntryHistoryItem__date}>
                                {props.date}
                            </p>
                            <p className={styles.FocusTimeEntryHistoryItem__time}>
                                {props.timeStartedAt}
                            </p>
                        </div>
                        <div className={styles.FocusTimeEntryHistoryItem__titleWrapper}>
                            <div
                                className={styles.FocusTimeEntryHistoryItem__pillWrapper}
                            >
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
                                <p
                                    className={
                                        styles.FocusTimeEntryHistoryItem__description
                                    }
                                >
                                    {props.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={styles.FocusTimeEntryHistoryItem__rightSide}>
                        <div className={styles.FocusTimeEntryHistoryItem__statsWrapper}>
                            <p className={styles.FocusTimeEntryHistoryItem__trackedTime}>
                                {props.timeTracked}
                            </p>
                            {props.taskTotalTime && (
                                <p
                                    className={
                                        styles.FocusTimeEntryHistoryItem__progressLabel
                                    }
                                >
                                    {props.taskEstimatedTime
                                        ? `${props.taskTotalTime} / ${props.taskEstimatedTime}`
                                        : props.taskTotalTime}
                                </p>
                            )}
                        </div>
                        <div
                            className={styles.FocusTimeEntryHistoryItem__deleteIcon}
                            onClick={handleDeleteClick}
                            role={'button'}
                            tabIndex={0}
                            aria-label={t('General.delete')}
                        >
                            <Trash2 width={16} height={16} />
                        </div>
                    </div>
                </div>
                {props.isExpanded && (
                    <FocusTimeEntryHistoryItemEdit
                        taskId={props.taskId}
                        title={props.title}
                        description={props.description}
                        taskOptions={props.taskOptions ?? []}
                        onTaskChange={props.onTaskChange}
                        onDescriptionSubmit={props.onDescriptionSubmit}
                    />
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
                        <Trash2
                            className={styles.FocusTimeEntryHistoryItem__deleteModalIcon}
                            width={18}
                            height={18}
                        />
                    }
                    confirmText={t('General.delete')}
                    confirmIcon={<Trash2 width={16} height={16} />}
                />
            )}
        </>
    );
};
