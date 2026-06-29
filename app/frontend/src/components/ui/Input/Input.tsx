import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Input.module.scss';
import clsx from 'clsx';

type InputProps = {
    prefixIcon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const ICON_SIZE = 16;

export const Input = ({ prefixIcon, type, disabled, ...rest }: InputProps) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => setShowPassword((prev) => !prev);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className={styles.Input}>
            {prefixIcon && (
                <div className={styles.Input__prefixIcon}>{prefixIcon}</div>
            )}
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
                        showPassword
                            ? t('Input.hidePassword')
                            : t('Input.showPassword')
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
        </div>
    );
};
