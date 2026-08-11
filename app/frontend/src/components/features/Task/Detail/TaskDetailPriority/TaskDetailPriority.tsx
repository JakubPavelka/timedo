import { Popover, type PopoverHandle } from '@/components/ui/Popover/Popover';
import { Pill } from '@/components/ui/Pill/Pill';
import {
    PriorityIcon,
    type PriorityLevel,
} from '@/components/ui/PriorityIcon/PriorityIcon';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { useUpdateTask } from '@/hooks/api/useTask';
import { PRIORITY } from '@/data/priorityData';
import styles from './TaskDetailPriority.module.scss';

type TaskDetailPriorityProps = {
    priority: PriorityLevel;
    taskId: string;
};

export const TaskDetailPriority = (props: TaskDetailPriorityProps) => {
    const { t } = useTranslation();
    const { mutate: updateTask } = useUpdateTask(props.taskId);
    const popoverRef = useRef<PopoverHandle>(null);

    const handleSelect = (priority: PriorityLevel) => {
        popoverRef.current?.close();

        if (priority === props.priority) {
            return;
        }

        updateTask({ priority });
    };

    return (
        <Popover
            ref={popoverRef}
            trigger={
                <Pill>
                    <span className={styles.TaskDetailView__priorityWrapper}>
                        <PriorityIcon level={props.priority} />
                        <span>{t(`Task.Priority.${props.priority.toLowerCase()}`)}</span>
                    </span>
                </Pill>
            }
        >
            <div className={styles.TaskDetailPriority__list}>
                {PRIORITY.map((prio) => (
                    <div
                        key={prio.value}
                        className={styles.TaskDetailPriority__item}
                        onClick={() => handleSelect(prio.value as PriorityLevel)}
                    >
                        <PriorityIcon level={prio.value as PriorityLevel} />
                        <span>{t(`Task.Priority.${prio.value.toLowerCase()}`)}</span>
                    </div>
                ))}
            </div>
        </Popover>
    );
};
