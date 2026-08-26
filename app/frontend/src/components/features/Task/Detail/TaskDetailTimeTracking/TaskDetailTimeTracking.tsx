import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Check, Pencil, Plus, Power, X } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { formatDuration } from '@/utils/formatDuration';
import { useEditableField } from '@/hooks/useEditableField';
import { useUpdateTask } from '@/hooks/api/useTask';
import { getErrorMessage } from '@/utils/getErrorMessage';
import styles from './TaskDetailTimeTracking.module.scss';

type TaskDetailTimeTrackingProps = {
    taskId: string;
    workedSeconds: number;
    estimateSeconds: number | null;
    onTimerClick: () => void;
    onTurnOffTracking: () => void;
};

const EstimateDraftSchema = z.string().refine((value) => {
    const parsed = Number(value.replace(',', '.'));
    return !isNaN(parsed) && parsed > 0;
}, 'Validation.estimatedTimeInvalid');

export const TaskDetailTimeTracking = (props: TaskDetailTimeTrackingProps) => {
    const { t } = useTranslation();
    const { mutate: updateTask, isPending } = useUpdateTask(props.taskId);

    const hasEstimate = props.estimateSeconds !== null && props.estimateSeconds > 0;
    const estimateHoursValue = hasEstimate
        ? String(Math.round((props.estimateSeconds! / 3600) * 100) / 100)
        : '';

    const {
        startEditing: startEditingEstimate,
        isEditing: isEditingEstimate,
        cancelEditing: cancelEditingEstimate,
        stopEditing: stopEditingEstimate,
        draft: estimateDraft,
        setDraft: setEstimateDraft,
        error: estimateError,
        validate: validateEstimate,
    } = useEditableField({
        schema: EstimateDraftSchema,
        value: estimateHoursValue,
    });
    const percent = hasEstimate
        ? Math.min(100, Math.round((props.workedSeconds / props.estimateSeconds!) * 100))
        : 0;
    const remainingSeconds = hasEstimate
        ? Math.max(0, props.estimateSeconds! - props.workedSeconds)
        : 0;
    const isOverEstimate = hasEstimate && props.workedSeconds > props.estimateSeconds!;

    const handleEstimateDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEstimateDraft(e.target.value);
    };

    const handleSubmitEstimate = () => {
        if (isPending) {
            return;
        }

        const value = validateEstimate();

        if (value === undefined) {
            return;
        }

        const estimatedTime = Math.round(Number(value.replace(',', '.')) * 60 * 60);
        const successKey = hasEstimate
            ? 'TaskDetail.updateEstimateSuccess'
            : 'TaskDetail.addEstimateSuccess';
        const errorKey = hasEstimate
            ? 'TaskDetail.updateEstimateError'
            : 'TaskDetail.addEstimateError';

        updateTask(
            { estimatedTime },
            {
                onSuccess: () => {
                    stopEditingEstimate();
                    toast.success(t(successKey));
                },
                onError: (err) => {
                    toast.error(getErrorMessage(err, errorKey, t));
                },
            }
        );
    };

    const handleEstimateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmitEstimate();
        } else if (e.key === 'Escape') {
            cancelEditingEstimate();
        }
    };

    return (
        <div className={styles.TaskDetailTimeTracking}>
            <div className={styles.TaskDetailTimeTracking__header}>
                <p className={styles.TaskDetailTimeTracking__time}>
                    {formatDuration(props.workedSeconds)}
                </p>
                <div className={styles.TaskDetailTimeTracking__headerRight}>
                    {hasEstimate && !isEditingEstimate && (
                        <>
                            <p className={styles.TaskDetailTimeTracking__estimate}>
                                {t('TaskDetail.RightSide.estimateOf', {
                                    time: formatDuration(props.estimateSeconds!),
                                })}
                            </p>
                            <Pencil
                                className={styles.TaskDetailTimeTracking__actionIcon}
                                onClick={startEditingEstimate}
                                width={14}
                                height={14}
                                aria-label={t('TaskDetail.RightSide.editEstimate')}
                            />
                        </>
                    )}
                    <button
                        type={'button'}
                        className={styles.TaskDetailTimeTracking__toggleOff}
                        onClick={props.onTurnOffTracking}
                        aria-label={t('TaskDetail.RightSide.turnOff')}
                    >
                        <Power width={16} height={16} />
                    </button>
                </div>
            </div>
            {isEditingEstimate ? (
                <div>
                    <p className={styles.TaskDetailTimeTracking__estimateLabel}>
                        {t('Task.Modal.inHours')}
                    </p>
                    <div className={styles.TaskDetailTimeTracking__estimateInputs}>
                        <Input
                            className={styles.TaskDetailTimeTracking__estimateInput}
                            value={estimateDraft}
                            onChange={handleEstimateDraftChange}
                            onKeyDown={handleEstimateKeyDown}
                            placeholder={t('Task.Modal.estimatedTimePlaceholder')}
                            type={'text'}
                            inputMode={'decimal'}
                            variant={'filled'}
                            disabled={isPending}
                            autoFocus
                        />
                        <X
                            className={styles.TaskDetailTimeTracking__actionIcon}
                            onClick={cancelEditingEstimate}
                            width={18}
                            height={18}
                        />
                        <Check
                            className={styles.TaskDetailTimeTracking__actionIcon}
                            onClick={handleSubmitEstimate}
                            width={18}
                            height={18}
                        />
                    </div>
                    {estimateError && (
                        <p className={styles.TaskDetailTimeTracking__error}>
                            {t(estimateError)}
                        </p>
                    )}
                </div>
            ) : hasEstimate ? (
                <>
                    <div className={styles.TaskDetailTimeTracking__progressTrack}>
                        <div
                            className={clsx(styles.TaskDetailTimeTracking__progressBar, {
                                [styles['TaskDetailTimeTracking__progressBar--over']]:
                                    isOverEstimate,
                            })}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <div className={styles.TaskDetailTimeTracking__footer}>
                        <p className={styles.TaskDetailTimeTracking__footerText}>
                            {t('TaskDetail.RightSide.percentOfEstimate', { percent })}
                        </p>
                        <p className={styles.TaskDetailTimeTracking__footerText}>
                            {t('TaskDetail.RightSide.remaining', {
                                time: formatDuration(remainingSeconds),
                            })}
                        </p>
                    </div>
                </>
            ) : (
                <div
                    className={styles.TaskDetailTimeTracking__addEstimateWrapper}
                    onClick={startEditingEstimate}
                >
                    <p>{t('TaskDetail.RightSide.addEstimate')}</p>
                    <Plus width={16} height={16} />
                </div>
            )}
            <Button
                className={styles.TaskDetailTimeTracking__button}
                onClick={props.onTimerClick}
                havePlayIcon
                fullWidth
            >
                <p>{t('TaskDetail.RightSide.startTimer')}</p>
            </Button>
        </div>
    );
};
