import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Power } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { formatDuration } from '@/utils/formatDuration';
import styles from './TaskDetailTimeTracking.module.scss';

type TaskDetailTimeTrackingProps = {
    workedSeconds: number;
    estimateSeconds: number;
    onTimerClick: () => void;
    onTurnOffTracking: () => void;
};

export const TaskDetailTimeTracking = (props: TaskDetailTimeTrackingProps) => {
    const { t } = useTranslation();

    const percent =
        props.estimateSeconds > 0
            ? Math.min(
                  100,
                  Math.round((props.workedSeconds / props.estimateSeconds) * 100)
              )
            : 0;
    const remainingSeconds = Math.max(0, props.estimateSeconds - props.workedSeconds);
    const isOverEstimate =
        props.estimateSeconds > 0 && props.workedSeconds > props.estimateSeconds;

    return (
        <div className={styles.TaskDetailTimeTracking}>
            <div className={styles.TaskDetailTimeTracking__header}>
                <p className={styles.TaskDetailTimeTracking__time}>
                    {formatDuration(props.workedSeconds)}
                </p>
                <div className={styles.TaskDetailTimeTracking__headerRight}>
                    <p className={styles.TaskDetailTimeTracking__estimate}>
                        {t('TaskDetail.RightSide.estimateOf', {
                            time: formatDuration(props.estimateSeconds),
                        })}
                    </p>
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
