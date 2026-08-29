import clsx from 'clsx';
import styles from './Skeleton.module.scss';

type SkeletonProps = {
    width?: string | number;
    height?: string | number;
    radius?: string | number;
    className?: string;
};

export const Skeleton = ({ width, height, radius, className }: SkeletonProps) => (
    <span
        className={clsx(styles.Skeleton, className)}
        style={{ width, height, borderRadius: radius }}
    />
);
