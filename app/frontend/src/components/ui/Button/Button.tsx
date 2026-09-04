import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';
import { Play } from 'lucide-react';
import clsx from 'clsx';
import { Spinner } from '../Spinner/Spinner';

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'danger'
    | 'outline-danger'
    | 'outline-success';

type ButtonProps = {
    havePlayIcon?: boolean;
    variant?: ButtonVariant;
    isLoading?: boolean;
    fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
    const {
        variant = 'primary',
        fullWidth,
        havePlayIcon,
        isLoading,
        children,
        type,
        className,
        disabled,
        ...rest
    } = props;

    return (
        <button
            className={clsx(
                styles.Button,
                styles[`Button--${variant}`],
                fullWidth && styles.Button__full,
                className
            )}
            type={type ?? 'button'}
            disabled={isLoading || disabled}
            {...rest}
        >
            {havePlayIcon && (
                <Play className={styles.Button_playIcon} width={10} height={10} />
            )}
            {isLoading ? (
                <Spinner size={'sm'} className={styles.Button__spinner} />
            ) : (
                <span className={styles.Button__text}>{children}</span>
            )}
        </button>
    );
};
