import { Fragment, useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { Select } from '@/components/ui/Select/Select';
import { Input } from '@/components/ui/Input/Input';
import { formatDuration } from '@/utils/formatDuration';
import { useElapsedSeconds } from '@/hooks/useElapsedSeconds';
import { Play, Square, Plus } from 'lucide-react';
import clsx from 'clsx';
import styles from './FocusTimeTrack.module.scss';

type FocusTimeTrackProps = {
    timerRunning: boolean;
    onTrackClick: () => void;
    startedAt?: string | Date;
    description?: string;
    onDescriptionSubmit: (description: string) => void;
};

const ICON_SIZE = 16;

export const FocusTimeTrack = (props: FocusTimeTrackProps) => {
    const { t, i18n } = useTranslation();

    const elapsedSeconds = useElapsedSeconds(props.startedAt, props.timerRunning);
    const timeParts = formatDuration(elapsedSeconds).split(':');
    const description = props.description ?? '';

    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [descriptionDraft, setDescriptionDraft] = useState(description);

    const getStartedAtTime = () => {
        if (!props.startedAt) {
            return '';
        }

        const startedAt =
            props.startedAt instanceof Date
                ? DateTime.fromJSDate(props.startedAt)
                : DateTime.fromISO(props.startedAt);

        return startedAt.setLocale(i18n.language).toLocaleString(DateTime.TIME_SIMPLE);
    };

    const handleDescriptionEditStart = () => {
        setDescriptionDraft(description);
        setIsEditingDescription(true);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescriptionDraft(e.target.value);
    };

    const handleDescriptionBlur = () => {
        setIsEditingDescription(false);

        const value = descriptionDraft.trim();

        if (value !== description) {
            props.onDescriptionSubmit(value);
        }
    };

    const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <div className={styles.FocusTimeTrack}>
            <div className={styles.FocusTimeTrack__textWrapper}>
                {props.timerRunning ? (
                    <p
                        className={clsx(
                            styles.FocusTimeTrack__status,
                            styles['FocusTimeTrack__status--running']
                        )}
                    >
                        <span className={styles.FocusTimeTrack__statusDot} />
                        {t('Focus.Tracking.running', { time: getStartedAtTime() })}
                    </p>
                ) : (
                    <p className={styles.FocusTimeTrack__status}>
                        {t('Focus.Tracking.notRunning')}
                    </p>
                )}
                <Select
                    variant={'ghost'}
                    onChange={() => {}}
                    options={[]}
                    placeholder={t('Focus.Tracking.selectTask')}
                />
                {isEditingDescription ? (
                    <Input
                        variant={'ghost'}
                        className={styles.FocusTimeTrack__descriptionInput}
                        value={descriptionDraft}
                        onChange={handleDescriptionChange}
                        onBlur={handleDescriptionBlur}
                        onKeyDown={handleDescriptionKeyDown}
                        placeholder={t('Focus.descriptionPlaceholder')}
                        autoFocus
                    />
                ) : description ? (
                    <button
                        type={'button'}
                        className={styles.FocusTimeTrack__description}
                        onClick={handleDescriptionEditStart}
                    >
                        {description}
                    </button>
                ) : (
                    <button
                        type={'button'}
                        className={styles.FocusTimeTrack__addDescription}
                        onClick={handleDescriptionEditStart}
                    >
                        <Plus width={ICON_SIZE} height={ICON_SIZE} />
                        <span>{t('Focus.Tracking.addDescription')}</span>
                    </button>
                )}
            </div>
            <div className={styles.FocusTimeTrack__timeWrapper}>
                <p
                    className={clsx(
                        props.timerRunning
                            ? styles.FocusTimeTrack__time
                            : styles.FocusTimeTrack__timeEmpty
                    )}
                >
                    {timeParts.map((part, index) => (
                        <Fragment key={index}>
                            {index > 0 && (
                                <span className={styles.FocusTimeTrack__colon}>:</span>
                            )}
                            {part}
                        </Fragment>
                    ))}
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
