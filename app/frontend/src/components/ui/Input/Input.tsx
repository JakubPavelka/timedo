import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Input.module.scss';
import clsx from 'clsx';

type InputVariant = 'default' | 'filled' | 'ghost';

type InputProps = {
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    variant?: InputVariant;
} & React.InputHTMLAttributes<HTMLInputElement>;

const ICON_SIZE = 16;

export const Input = ({
    prefixIcon,
    suffixIcon,
    variant = 'default',
    type,
    disabled,
    className,
    ...rest
}: InputProps) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => setShowPassword((prev) => !prev);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className={clsx(styles.Input, styles[`Input--${variant}`], className)}>
            {prefixIcon && <div className={styles.Input__prefixIcon}>{prefixIcon}</div>}
            <input
                className={clsx(
                    styles.Input__input,
                    type === 'password' && styles['Input__input--withLockIcon']
                )}
                {...rest}
                type={inputType}
                disabled={disabled}
            />
            {type === 'password' && (
                <button
                    onClick={handleShowPassword}
                    type="button"
                    className={styles.Input__toggle}
                    aria-label={
                        showPassword ? t('Input.hidePassword') : t('Input.showPassword')
                    }
                >
                    {showPassword ? (
                        <EyeOff
                            className={styles.Input__icon}
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                        />
                    ) : (
                        <Eye
                            className={styles.Input__icon}
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                        />
                    )}
                </button>
            )}
            {suffixIcon && <div className={styles.Input__suffixIcon}>{suffixIcon}</div>}
        </div>
    );
};
