import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';
import { ChevronRight, Play } from 'lucide-react';
import clsx from 'clsx';
import { Spinner } from '../Spinner/Spinner';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
    haveRightArrow?: boolean;
    havePlayIcon?: boolean;
    variant?: ButtonVariant;
    isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
    variant = 'primary',
    haveRightArrow,
    havePlayIcon,
    isLoading,
    children,
    type,
    ...rest
}: ButtonProps) => {
    return (
        <button
            className={clsx(styles.Button, styles[`Button--${variant}`])}
            type={type ?? 'button'}
            disabled={isLoading}
            {...rest}
        >
            {havePlayIcon && (
                <Play
                    className={styles.Button_playIcon}
                    width={12}
                    height={12}
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
