import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from './TaskDetailSkeleton.module.scss';

export const TaskDetailSkeleton = () => (
    <div className={styles.TaskDetailSkeleton}>
        <div className={styles.TaskDetailSkeleton__header}>
            <Skeleton width={120} height={16} />
            <div className={styles.TaskDetailSkeleton__headerActions}>
                <Skeleton width={110} height={36} radius={8} />
                <Skeleton width={110} height={36} radius={8} />
                <Skeleton width={36} height={36} radius={10} />
            </div>
        </div>
        <div className={styles.TaskDetailSkeleton__columns}>
            <div className={styles.TaskDetailSkeleton__left}>
                <div className={styles.TaskDetailSkeleton__row}>
                    <Skeleton width={72} height={22} radius={999} />
                    <Skeleton width={72} height={22} radius={999} />
                </div>
                <Skeleton width={'60%'} height={28} />
                <div className={styles.TaskDetailSkeleton__row}>
                    <Skeleton width={56} height={20} radius={999} />
                    <Skeleton width={56} height={20} radius={999} />
                </div>
                <Skeleton
                    width={90}
                    height={14}
                    className={styles.TaskDetailSkeleton__label}
                />
                <Skeleton width={'100%'} height={14} />
                <Skeleton width={'90%'} height={14} />
                <Skeleton width={'70%'} height={14} />
                <Skeleton
                    width={70}
                    height={14}
                    className={styles.TaskDetailSkeleton__label}
                />
                <Skeleton width={'100%'} height={40} radius={10} />
                <Skeleton
                    width={110}
                    height={14}
                    className={styles.TaskDetailSkeleton__label}
                />
                <Skeleton width={'100%'} height={48} radius={10} />
                <Skeleton width={'100%'} height={48} radius={10} />
            </div>
            <div className={styles.TaskDetailSkeleton__right}>
                <Skeleton width={'100%'} height={140} radius={12} />
                <Skeleton width={'100%'} height={160} radius={12} />
            </div>
        </div>
    </div>
);
