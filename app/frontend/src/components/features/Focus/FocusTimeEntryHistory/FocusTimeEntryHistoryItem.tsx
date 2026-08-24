import styles from './FocusTimeEntryHistoryItem.module.scss';
import { Pill } from '@/components/ui/Pill/Pill';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

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
};

export const FocusTimeEntryHistoryItem = (props: FocusTimeEntryHistoryItemProps) => {
    const { t } = useTranslation();

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
        </>
    );

    return (
        <li className={styles.FocusTimeEntryHistoryItem}>
            {props.taskId ? (
                <Link to="/dashboard/tasks/$taskId" params={{ taskId: props.taskId }}>
                    {content}
                </Link>
            ) : (
                content
            )}
        </li>
    );
};
