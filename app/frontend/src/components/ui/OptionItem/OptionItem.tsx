import clsx from 'clsx';
import styles from './OptionItem.module.scss';

type OptionItemProps = {
    title: string;
    description?: string;
    rightActions?: React.ReactNode;
    stackOnMobile?: boolean;
};

export const OptionItem = (props: OptionItemProps) => (
    <div
        className={clsx(
            styles.OptionItem,
            props.stackOnMobile && styles['--stackMobile']
        )}
    >
        <div className={styles.OptionItem__textWrapper}>
            <p className={styles.OptionItem__title}>{props.title}</p>
            {props.description && (
                <p className={styles.OptionItem__description}>{props.description}</p>
            )}
        </div>
        {props.rightActions}
    </div>
);
