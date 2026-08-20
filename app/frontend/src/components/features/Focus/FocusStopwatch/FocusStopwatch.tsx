import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl';
import { useTranslation } from 'react-i18next';
import { useTimerMode } from '@/hooks/useTimerMode';
import { Pause, Play, RotateCcw, Square } from 'lucide-react';
import clsx from 'clsx';
import styles from './FocusStopwatch.module.scss';

type FocusStopwatchType = {
    isRunning: boolean;
    onTrackClick: () => void;
    onResetClick: () => void;
    onSaveAndResetClick: () => void;
};

const ICON_SIZE = 16;

export const FocusStopwatch = (props: FocusStopwatchType) => {
    const { t } = useTranslation();
    const timerType = useTimerMode((s) => s.timerMode);
    const setTimerType = useTimerMode((s) => s.setTimerMode);

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
                <SegmentedControl variant={'round'} items={stopwatchTypeSegmentedData} />
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
                    <p className={styles.FocusStopwatch__stopwatchTime}>00:00</p>
                    <p className={styles.FocusStopwatch__stopwatchText}>
                        {timerType === 'STOPWATCH' ? t('Focus.worked') : `/ 50:00`}
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
                        <Pause width={ICON_SIZE} height={ICON_SIZE} />
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
