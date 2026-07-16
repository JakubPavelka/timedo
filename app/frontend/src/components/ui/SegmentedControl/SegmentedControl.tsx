import clsx from 'clsx';
import styles from './SegmentedControl.module.scss';

type SegmentedControlItem = {
    title: string;
    isActive: boolean;
    onClick?: () => void;
};

type SegmentedControlProps = {
    items: SegmentedControlItem[];
};

export const SegmentedControl = (props: SegmentedControlProps) => (
    <div className={styles.SegmentedControl}>
        {props.items.map((item, index) => (
            <button
                key={index}
                className={clsx(
                    styles.SegmentedControl__text,
                    item.isActive && styles['--active']
                )}
                onClick={item.onClick}
            >
                {item.title}
            </button>
        ))}
    </div>
);
