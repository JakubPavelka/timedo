import clsx from 'clsx';
import styles from './IconItem.module.scss';

type IconItemProps = {
    title: string;
    description: string;
    icon: React.ReactNode;
    rightActions?: React.ReactNode;
    danger?: boolean;
};

export const IconItem = (props: IconItemProps) => (
    <div className={styles.IconItem}>
        <div className={styles.IconItem__leftSide}>
            <div
                className={clsx(
                    styles.IconItem__iconWrapper,
                    props.danger && styles['--danger']
                )}
            >
                {props.icon}
            </div>
            <div className={styles.IconItem__textWrapper}>
                <p className={styles.IconItem__title}>{props.title}</p>
                <p className={styles.IconItem__description}>
                    {props.description}
                </p>
            </div>
        </div>
        {props.rightActions}
    </div>
);
