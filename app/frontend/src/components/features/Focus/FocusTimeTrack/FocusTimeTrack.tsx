import { useTranslation, Trans } from 'react-i18next';
import { Select } from '@/components/ui/Select/Select';
import { formatDuration } from '@/utils/formatDuration';
import { useElapsedSeconds } from '@/hooks/useElapsedSeconds';
import { Play, Square, Plus } from 'lucide-react';
import clsx from 'clsx';
import styles from './FocusTimeTrack.module.scss';

type FocusTimeTrackProps = {
    timerRunning: boolean;
    onTrackClick: () => void;
    startedAt?: string | Date;
};

const ICON_SIZE = 16;

export const FocusTimeTrack = (props: FocusTimeTrackProps) => {
    const { t } = useTranslation();

    const elapsedSeconds = useElapsedSeconds(props.startedAt, props.timerRunning);

    return (
        <div className={styles.FocusTimeTrack}>
            <div className={styles.FocusTimeTrack__textWrapper}>
                <p>{t('Focus.Tracking.notRunning')}</p>
                <Select
                    variant={'ghost'}
                    onChange={() => {}}
                    options={[]}
                    placeholder={t('Focus.Tracking.selectTask')}
                />
                <button>
                    <Plus width={ICON_SIZE} height={ICON_SIZE} />
                    <span>{t('Focus.Tracking.addDescription')}</span>
                </button>
            </div>
            <div className={styles.FocusTimeTrack__timeWrapper}>
                <p
                    className={clsx(
                        props.timerRunning
                            ? styles.FocusTimeTrack__time
                            : styles.FocusTimeTrack__timeEmpty
                    )}
                >
                    {formatDuration(elapsedSeconds)}
                </p>
                <button
                    className={styles.FocusTimeTrack__playButton}
                    onClick={props.onTrackClick}
                >
                    {props.timerRunning ? (
                        <Square width={ICON_SIZE} height={ICON_SIZE} />
                    ) : (
                        <Play width={ICON_SIZE} height={ICON_SIZE} />
                    )}
                </button>
            </div>
        </div>
    );
};
