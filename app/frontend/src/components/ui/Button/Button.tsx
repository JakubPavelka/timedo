import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';
import { ChevronRight, Play } from 'lucide-react';
import clsx from 'clsx';
import { Spinner } from '../Spinner/Spinner';

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'danger'
    | 'outline-danger';

type ButtonProps = {
    haveRightArrow?: boolean;
    havePlayIcon?: boolean;
    variant?: ButtonVariant;
    isLoading?: boolean;
    fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
    const {
        variant = 'primary',
        haveRightArrow,
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
                <Play
                    className={styles.Button_playIcon}
                    width={10}
                    height={10}
                />
            )}
            <span className={styles.Button__text}>{children}</span>
            {isLoading ? (
                <Spinner size="sm" className={styles.Button__spinner} />
            ) : (
                haveRightArrow && (
                    <ChevronRight
                        className={styles.Button__chevronRight}
                        width={16}
                        height={16}
                    />
                )
            )}
        </button>
    );
};
