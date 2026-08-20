import clsx from 'clsx';
import styles from './SegmentedControl.module.scss';

type SegmentedControlItem = {
    title: string;
    isActive: boolean;
    onClick?: () => void;
};

type SegmentedControlVariant = 'default' | 'round';

type SegmentedControlProps = {
    items: SegmentedControlItem[];
    variant?: SegmentedControlVariant;
};

export const SegmentedControl = (props: SegmentedControlProps) => {
    const variant = props.variant ?? 'default';
    const isRound = variant === 'round';

    return (
        <div className={clsx(styles.SegmentedControl, isRound && styles['--round'])}>
            {props.items.map((item, index) => (
                <button
                    key={index}
                    className={clsx(
                        styles.SegmentedControl__text,
                        item.isActive && styles['--active'],
                        isRound && styles['--round']
                    )}
                    onClick={item.onClick}
                >
                    {item.title}
                </button>
            ))}
        </div>
    );
};
