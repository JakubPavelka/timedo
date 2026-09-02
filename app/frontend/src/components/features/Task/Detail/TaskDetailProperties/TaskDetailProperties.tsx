import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Folder, Hourglass, Timer } from 'lucide-react';
import {
    PriorityIcon,
    type PriorityLevel,
} from '@/components/ui/PriorityIcon/PriorityIcon';
import styles from './TaskDetailProperties.module.scss';

type TaskDetailPropertiesProps = {
    priority: PriorityLevel;
    project: string;
    estimate?: string;
    term?: string;
    timeWorked?: string;
};

const EMPTY_PLACEHOLDER = '–';

export const TaskDetailProperties = (props: TaskDetailPropertiesProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.TaskDetailProperties}>
            {/* PRIORITA */}
            <div className={styles.TaskDetailProperties__rowWrapper}>
                <div className={styles.TaskDetailProperties__iconText}>
                    <PriorityIcon level={'HIGH'} color={'var(--text-2)'} />
                    <p>{t('TaskDetail.RightSide.priority')}</p>
                </div>
                <div className={styles.TaskDetailProperties__textAlign}>
                    <PriorityIcon level={props.priority} />
                    {t(`Task.Priority.${props.priority.toLowerCase()}`)}
                </div>
            </div>
            {/* PROJEKT */}
            <div
                className={clsx(
                    styles.TaskDetailProperties__rowWrapper,
                    styles.TaskDetailProperties__borderTop
                )}
            >
                <div className={styles.TaskDetailProperties__iconText}>
                    <Folder width={14} height={14} />
                    <p>{t('TaskDetail.RightSide.project')}</p>
                </div>
                <p
                    className={clsx(styles.TaskDetailProperties__value, {
                        [styles['TaskDetailProperties__value--placeholder']]:
                            !props.project,
                    })}
                >
                    {props.project || EMPTY_PLACEHOLDER}
                </p>
            </div>
            {/* ODHAD */}
            <div
                className={clsx(
                    styles.TaskDetailProperties__rowWrapper,
                    styles.TaskDetailProperties__borderTop
                )}
            >
                <div className={styles.TaskDetailProperties__iconText}>
                    <Hourglass width={14} height={14} />
                    <p>{t('TaskDetail.RightSide.estimate')}</p>
                </div>
                <p
                    className={clsx(styles.TaskDetailProperties__value, {
                        [styles['TaskDetailProperties__value--placeholder']]:
                            !props.estimate,
                    })}
                >
                    {props.estimate ?? EMPTY_PLACEHOLDER}
                </p>
            </div>
            {/* TERMÍN */}
            {/*
            <div
                className={clsx(
                    styles.TaskDetailProperties__rowWrapper,
                    styles.TaskDetailProperties__borderTop
                )}
            >
                <div className={styles.TaskDetailProperties__iconText}>
                    <Calendar width={14} height={14} />
                    <p>{t('TaskDetail.RightSide.term')}</p>
                </div>
                <p className={styles.TaskDetailProperties__value}>xx</p>
            </div>
            */}
            {/* ODPRACOVÁNO */}
            <div
                className={clsx(
                    styles.TaskDetailProperties__rowWrapper,
                    styles.TaskDetailProperties__borderTop
                )}
            >
                <div className={styles.TaskDetailProperties__iconText}>
                    <Timer width={14} height={14} />
                    <p>{t('TaskDetail.RightSide.hoursWorked')}</p>
                </div>
                <p
                    className={clsx(styles.TaskDetailProperties__value, {
                        [styles['TaskDetailProperties__value--placeholder']]:
                            !props.timeWorked,
                    })}
                >
                    {props.timeWorked ?? EMPTY_PLACEHOLDER}
                </p>
            </div>
        </div>
    );
};
