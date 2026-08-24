import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl';
import { useTranslation } from 'react-i18next';
import { useTimerMode } from '@/hooks/useTimerMode';
import { useElapsedSeconds } from '@/hooks/useElapsedSeconds';
import { formatDuration } from '@/utils/formatDuration';
import { Play, RotateCcw, Square } from 'lucide-react';
import clsx from 'clsx';
import styles from './FocusStopwatch.module.scss';

const DEFAULT_POMODORO_DURATION = 50 * 60;

type FocusStopwatchType = {
    isRunning: boolean;
    onTrackClick: () => void;
    startedAt?: string | Date;
    plannedDuration?: number;
};

const ICON_SIZE = 16;

export const FocusStopwatch = (props: FocusStopwatchType) => {
    const { t } = useTranslation();
    const timerType = useTimerMode((s) => s.timerMode);
    const setTimerType = useTimerMode((s) => s.setTimerMode);
    const elapsedSeconds = useElapsedSeconds(props.startedAt, props.isRunning);
    const plannedDuration = props.plannedDuration ?? DEFAULT_POMODORO_DURATION;
    const displaySeconds =
        timerType === 'STOPWATCH'
            ? elapsedSeconds
            : Math.max(plannedDuration - elapsedSeconds, 0);

    const stopwatchTypeSegmentedData = [
        {
            title: t('Focus.stopwatch'),
            isActive: timerType === 'STOPWATCH',
            onClick: () => setTimerType('STOPWATCH'),
        },
        {
            title: t('Focus.pomodoro'),
            isActive: timerType === 'POMODORO',
            onClick: () => setTimerType('POMODORO'),
        },
    ];

    return (
        <div className={styles.FocusStopwatch}>
            <div className={styles.FocusStopwatch__segmentedControl}>
                <SegmentedControl
                    disabled={props.isRunning}
                    variant={'round'}
                    items={stopwatchTypeSegmentedData}
                />
            </div>
            <div className={styles.FocusStopwatch__stopwatch}>
                <div className={styles.FocusStopwatch__stopwatchCircle}>
                    {timerType === 'STOPWATCH' && (
                        <div
                            className={clsx(
                                styles.FocusStopwatch__activeCircleTrack,
                                props.isRunning &&
                                    styles['FocusStopwatch__activeCircleTrack--running']
                            )}
                        >
                            <div className={styles.FocusStopwatch__activeCircle} />
                        </div>
                    )}
                    <p className={styles.FocusStopwatch__stopwatchType}>
                        {timerType === 'STOPWATCH'
                            ? t('Focus.stopwatch')
                            : t('Focus.pomodoro')}
                    </p>
                    <p className={styles.FocusStopwatch__stopwatchTime}>
                        {formatDuration(displaySeconds)}
                    </p>
                    <p className={styles.FocusStopwatch__stopwatchText}>
                        {timerType === 'STOPWATCH'
                            ? t('Focus.worked')
                            : `/ ${formatDuration(plannedDuration)}`}
                    </p>
                </div>
            </div>
            <div className={styles.FocusStopwatch__stopwatchButtons}>
                <button className={styles.FocusStopwatch__sideButton}>
                    <RotateCcw width={ICON_SIZE} height={ICON_SIZE} />
                </button>
                <button
                    onClick={props.onTrackClick}
                    className={styles.FocusStopwatch__startButton}
                >
                    {props.isRunning ? (
                        <Square width={ICON_SIZE} height={ICON_SIZE} />
                    ) : (
                        <Play width={ICON_SIZE} height={ICON_SIZE} />
                    )}
                </button>
                <button
                    className={clsx(
                        styles.FocusStopwatch__sideButton,
                        styles['FocusStopwatch__sideButton--filled']
                    )}
                >
                    <Square width={12} height={12} />
                </button>
            </div>
        </div>
    );
};
