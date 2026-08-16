import { Priority } from '@timedo/shared/src/schemas/taskSchema';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { Pill } from '@/components/ui/Pill/Pill';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { useTranslation } from 'react-i18next';
import type { Tag } from '@/store/tagStore';
import type { Project } from '@/store/projectStore';
import styles from './TaskListItem.module.scss';

type TaskListItem = {
    id: string;
    title: string;
    priority: Priority;
    tags?: Tag[];
    project?: Omit<Project, '_count'>;
    selected?: boolean;
    onSelectChange?: (id: string, selected: boolean) => void;
};

export const TaskListItem = (props: TaskListItem) => {
    const { t } = useTranslation();
    const priority = props.priority.toLowerCase();

    return (
        <div className={styles.TaskListItem}>
            <div className={styles.TaskListItem__leftWrapper}>
                <Checkbox
                    round
                    checked={props.selected ?? false}
                    onChange={(e) => props.onSelectChange?.(props.id, e.target.checked)}
                />
                <div className={styles.TaskListItem__contentWrapper}>
                    <span className={styles.TaskListItem__title}>{props.title}</span>
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
                    </div>
                </div>
            </div>
        </div>
    );
};
