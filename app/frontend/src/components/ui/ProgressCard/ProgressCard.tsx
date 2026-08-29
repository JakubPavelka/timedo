import { useTranslation } from 'react-i18next';
import { Pencil, Trash } from 'lucide-react';
import { formatDuration } from '@/utils/formatDuration';
import styles from './ProgressCard.module.scss';

type ProgressCardProps = {
    title: string;
    color: string;
    tasksDone?: number;
    totalTasks?: number;
    duration?: number;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
};

export const ProgressCard = (props: ProgressCardProps) => {
    const { t } = useTranslation();

    const tasksDone = props.tasksDone ?? 0;
    const totalTasks = props.totalTasks ?? 0;
    const progressPercent = totalTasks > 0 ? (tasksDone / totalTasks) * 100 : 0;

    return (
        <div className={styles.ProgressCard} onClick={props.onClick}>
            <div className={styles.ProgressCard__topWrapper}>
                <div className={styles.ProgressCard__titleWrapper}>
                    <span
                        className={styles.ProgressCard__dot}
                        style={{ backgroundColor: props.color }}
                    />
                    <p className={styles.ProgressCard__title}>{props.title}</p>
                </div>
                {(!!props.onDelete || !!props.onEdit) && (
                    <div className={styles.ProgressCard__actionsWrapper}>
                        {!!props.onDelete && (
                            <span
                                onClick={props.onDelete}
                                className={styles.ProgressCard__delete}
                            >
                                <Trash width={16} height={16} />
                            </span>
                        )}
                        {!!props.onEdit && (
                            <span
                                onClick={props.onEdit}
                                className={styles.ProgressCard__edit}
                            >
                                <Pencil width={16} height={16} />
                            </span>
                        )}
                    </div>
                )}
            </div>
            <div className={styles.ProgressCard__progressTrack}>
                <div
                    className={styles.ProgressCard__progressBar}
                    style={{ width: `${progressPercent}%`, backgroundColor: props.color }}
                />
            </div>
            <div className={styles.ProgressCard__bottomWrapper}>
                <p className={styles.ProgressCard__tasks}>
                    {t('ProgressCard.done', { tasksDone, allTasks: totalTasks })}
                </p>
                {!!props.duration && (
                    <p className={styles.ProgressCard__time}>
                        {formatDuration(props.duration)}
                    </p>
                )}
            </div>
        </div>
    );
};
