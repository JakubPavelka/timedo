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
    disabled?: boolean;
};

export const SegmentedControl = (props: SegmentedControlProps) => {
    const variant = props.variant ?? 'default';
    const isRound = variant === 'round';

    return (
        <div
            className={clsx(
                styles.SegmentedControl,
                isRound && styles['SegmentedControl--round'],
                props.disabled && styles['SegmentedControl--disabled']
            )}
        >
            {props.items.map((item, index) => (
                <button
                    key={index}
                    className={clsx(
                        styles.SegmentedControl__text,
                        item.isActive && styles['SegmentedControl__text--active'],
                        isRound && styles['SegmentedControl__text--round'],
                        props.disabled && styles['SegmentedControl__text--disabled']
                    )}
                    onClick={!props.disabled ? item.onClick : undefined}
                >
                    {item.title}
                </button>
            ))}
        </div>
    );
};
