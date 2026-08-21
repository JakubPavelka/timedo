import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Power } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import styles from './TaskDetailTimeTracking.module.scss';

type TaskDetailTimeTrackingProps = {
    workedMinutes: number;
    estimateMinutes: number;
    onTimerClick: () => void;
    onTurnOffTracking: () => void;
};

const MINUTES_PER_DAY = 24 * 60;

const formatDuration = (totalMinutes: number) => {
    const days = Math.floor(totalMinutes / MINUTES_PER_DAY);
    const hours = Math.floor((totalMinutes % MINUTES_PER_DAY) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) {
        parts.push(`${days}d`);
    }
    if (hours > 0) {
        parts.push(`${hours}h`);
    }
    if (minutes > 0) {
        parts.push(`${minutes}m`);
    }

    if (parts.length === 0) {
        return '0m';
    }

    return parts.join(' ');
};

export const TaskDetailTimeTracking = (props: TaskDetailTimeTrackingProps) => {
    const { t } = useTranslation();

    const percent =
        props.estimateMinutes > 0
            ? Math.min(
                  100,
                  Math.round((props.workedMinutes / props.estimateMinutes) * 100)
              )
            : 0;
    const remainingMinutes = Math.max(0, props.estimateMinutes - props.workedMinutes);
    const isOverEstimate =
        props.estimateMinutes > 0 && props.workedMinutes > props.estimateMinutes;

    return (
        <div className={styles.TaskDetailTimeTracking}>
            <div className={styles.TaskDetailTimeTracking__header}>
                <p className={styles.TaskDetailTimeTracking__time}>
                    {formatDuration(props.workedMinutes)}
                </p>
                <div className={styles.TaskDetailTimeTracking__headerRight}>
                    <p className={styles.TaskDetailTimeTracking__estimate}>
                        {t('TaskDetail.RightSide.estimateOf', {
                            time: formatDuration(props.estimateMinutes),
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
                        time: formatDuration(remainingMinutes),
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
