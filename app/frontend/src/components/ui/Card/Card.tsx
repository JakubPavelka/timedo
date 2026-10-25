import styles from './Card.module.scss';
import clsx from 'clsx';

type CardProps = {
    children: React.ReactNode;
    className?: string;
    flush?: boolean;
};

export const Card = (props: CardProps) => (
    <div className={clsx(styles.Card, props.flush && styles['--flush'], props.className)}>
        {props.children}
    </div>
);
