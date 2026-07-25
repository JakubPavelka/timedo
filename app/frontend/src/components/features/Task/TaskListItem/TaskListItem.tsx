import { Priority } from '@timedo/shared/src/schemas/taskSchema';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { Pill } from '@/components/ui/Pill/Pill';
import { useTranslation } from 'react-i18next';
import styles from './TaskListItem.module.scss';

type TaskListItem = {
    title: string;
    priority: Priority;
    tags?: any[];
    project?: {
        label: string;
        color: string;
        id: string;
    };
};

export const TaskListItem = (props: TaskListItem) => {
    const { t } = useTranslation();
    const priority = props.priority.toLowerCase();

    return (
        <div className={styles.TaskListItem}>
            <div className={styles.TaskListItem__leftWrapper}>
                <span className={styles.TaskListItem__title}>{props.title}</span>
                <div className={styles.TaskListItem__pillsWrapper}>
                    {props.project && (
                        <Pill
                            variant={'basic'}
                            color={props.project.color}
                            tone={'danger'}
                            dot
                        >
                            {props.project.label}
                        </Pill>
                    )}
                    {props?.tags}
                    <Pill>
                        <span className={styles.TaskListItem__priorityPill}>
                            <PriorityIcon level={props.priority} />
                            <span>{t(`Task.Priority.${priority}`)}</span>
                        </span>
                    </Pill>
                </div>
            </div>
        </div>
    );
};
