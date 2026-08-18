import clsx from 'clsx';
import { Check, Circle, CircleDot } from 'lucide-react';
import { Priority, Status } from '@timedo/shared/src/schemas/taskSchema';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { Pill, type PillTone, type PillVariant } from '@/components/ui/Pill/Pill';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { TaskListItemActions } from '@/components/features/Task/TaskListItemActions/TaskListItemActions';
import { useTranslation } from 'react-i18next';
import type { Tag } from '@/store/tagStore';
import type { Project } from '@/store/projectStore';
import styles from './TaskListItem.module.scss';

type TaskListItem = {
    id: string;
    title: string;
    priority: Priority;
    status: Status;
    tags?: Tag[];
    project?: Omit<Project, '_count'>;
    selected?: boolean;
    onSelectChange?: (id: string, selected: boolean) => void;
};

const STATUS_PILL: Record<
    Status,
    { variant: PillVariant; tone?: PillTone; icon: React.ReactNode }
> = {
    [Status.TODO]: {
        variant: 'basic',
        icon: <Circle width={12} height={12} />,
    },
    [Status.ACTIVE]: {
        variant: 'colored',
        tone: 'accent',
        icon: <CircleDot width={12} height={12} />,
    },
    [Status.DONE]: {
        variant: 'colored',
        tone: 'success',
        icon: <Check width={12} height={12} />,
    },
};

export const TaskListItem = (props: TaskListItem) => {
    const { t } = useTranslation();
    const priority = props.priority.toLowerCase();
    const isDone = props.status === Status.DONE;
    const statusPill = STATUS_PILL[props.status];

    return (
        <div className={styles.TaskListItem}>
            <div className={styles.TaskListItem__leftWrapper}>
                <Checkbox
                    round
                    checked={props.selected ?? false}
                    onChange={(e) => props.onSelectChange?.(props.id, e.target.checked)}
                />
                <div className={styles.TaskListItem__contentWrapper}>
                    <span
                        className={clsx(
                            styles.TaskListItem__title,
                            isDone && styles['TaskListItem__title--finished']
                        )}
                    >
                        {props.title}
                    </span>
                    <div className={styles.TaskListItem__pillsWrapper}>
                        {props.project && (
                            <Pill variant={'basic'} color={props.project.color} dot>
                                {props.project.label}
                            </Pill>
                        )}
                        {props.tags?.map((tag) => (
                            <Pill
                                key={tag.id}
                                hashtag
                                variant={'colored'}
                                color={tag.color}
                            >
                                {tag.label}
                            </Pill>
                        ))}
                        <Pill>
                            <span className={styles.TaskListItem__priorityPill}>
                                <PriorityIcon level={props.priority} />
                                <span>{t(`Task.Priority.${priority}`)}</span>
                            </span>
                        </Pill>
                        <Pill
                            variant={statusPill.variant}
                            tone={statusPill.tone}
                            icon={statusPill.icon}
                        >
                            {t(`Task.Status.${props.status.toLowerCase()}`)}
                        </Pill>
                    </div>
                </div>
            </div>
            <TaskListItemActions
                taskId={props.id}
                tagIds={props.tags?.map((tag) => tag.id) ?? []}
            />
        </div>
    );
};
