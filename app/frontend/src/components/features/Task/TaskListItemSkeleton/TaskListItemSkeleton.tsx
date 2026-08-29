import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from './TaskListItemSkeleton.module.scss';

export const TaskListItemSkeleton = () => (
    <div className={styles.TaskListItemSkeleton}>
        <div className={styles.TaskListItemSkeleton__leftWrapper}>
            <Skeleton width={18} height={18} radius={999} />
            <div className={styles.TaskListItemSkeleton__contentWrapper}>
                <Skeleton width={'40%'} height={16} />
                <div className={styles.TaskListItemSkeleton__pillsWrapper}>
                    <Skeleton width={64} height={20} radius={999} />
                    <Skeleton width={64} height={20} radius={999} />
                    <Skeleton width={64} height={20} radius={999} />
                </div>
            </div>
        </div>
        <Skeleton width={90} height={28} radius={6} />
    </div>
);
