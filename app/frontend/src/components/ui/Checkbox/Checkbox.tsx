import React, { type InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.scss';
import { Check } from 'lucide-react';
import clsx from 'clsx';

type CheckboxSize = 'sm' | 'md';

type CheckboxProps = {
    label?: React.ReactNode;
    size?: CheckboxSize;
    round?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;

const CHECK_ICON_SIZE: Record<CheckboxSize, number> = {
    sm: 9,
    md: 12,
};

export const Checkbox = ({
    label,
    size = 'md',
    round = false,
    className,
    id,
    ...rest
}: CheckboxProps) => (
    <label
        className={clsx(
            styles.Checkbox,
            styles[`Checkbox--${size}`],
            round && styles['Checkbox--round'],
            className
        )}
        htmlFor={id}
        onClick={(e) => e.stopPropagation()}
    >
        <input type="checkbox" id={id} className={styles.Checkbox__input} {...rest} />
        <span className={styles.Checkbox__box}>
            {round ? (
                <span className={styles.Checkbox__dot} />
            ) : (
                <Check
                    className={styles.Checkbox__check}
                    width={CHECK_ICON_SIZE[size]}
                    height={CHECK_ICON_SIZE[size]}
                />
            )}
        </span>
        {label && <span className={styles.Checkbox__label}>{label}</span>}
    </label>
);
