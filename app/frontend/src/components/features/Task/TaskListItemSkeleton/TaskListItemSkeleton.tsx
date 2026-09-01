import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from './TaskListItemSkeleton.module.scss';

export const TaskListItemSkeleton = () => (
    <div className={styles.TaskListItemSkeleton}>
        <Skeleton
            className={styles.TaskListItemSkeleton__checkbox}
            width={18}
            height={18}
            radius={999}
        />
        <Skeleton
            className={styles.TaskListItemSkeleton__title}
            width={'40%'}
            height={16}
        />
        <div className={styles.TaskListItemSkeleton__pillsWrapper}>
            <Skeleton width={64} height={20} radius={999} />
            <Skeleton width={64} height={20} radius={999} />
            <Skeleton width={64} height={20} radius={999} />
        </div>
        <Skeleton
            className={styles.TaskListItemSkeleton__stats}
            width={90}
            height={28}
            radius={6}
        />
    </div>
);
