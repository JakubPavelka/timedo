import styles from './Spinner.module.scss';
import clsx from 'clsx';

type SpinnerSize = 'sm' | 'md' | 'lg';

type SpinnerProps = {
    size?: SpinnerSize;
    className?: string;
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
    <span
        className={clsx(styles.Spinner, styles[`Spinner--${size}`], className)}
    />
);
