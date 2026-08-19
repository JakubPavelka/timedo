import clsx from 'clsx';
import styles from './Pill.module.scss';

export type PillVariant = 'basic' | 'colored';

export type PillTone = 'accent' | 'success' | 'danger' | 'warning' | 'highlight' | 'info';

type PillProps = {
    children: React.ReactNode;
    variant?: PillVariant;
    tone?: PillTone;
    color?: string;
    icon?: React.ReactNode;
    dot?: boolean;
    className?: string;
    hashtag?: boolean;
};

export const Pill = ({
    children,
    variant = 'basic',
    tone,
    color,
    icon,
    dot,
    className,
    hashtag,
}: PillProps) => (
    <span
        className={clsx(
            styles.Pill,
            styles[`Pill--${variant}`],
            tone && styles[`Pill--${tone}`],
            className
        )}
        style={{ '--pill-color': color } as React.CSSProperties}
    >
        {dot && <span className={styles.Pill__dot} />}
        {icon && <span className={styles.Pill__icon}>{icon}</span>}
        <span className={styles.Pill__label}>
            {hashtag && '#'} {''}
            {children}
        </span>
    </span>
);
