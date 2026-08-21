import React, { type InputHTMLAttributes } from 'react';
import styles from './Switch.module.scss';
import clsx from 'clsx';

type SwitchProps = {
    label?: React.ReactNode;
    ref?: React.Ref<HTMLInputElement>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Switch = ({ label, className, id, ref, ...rest }: SwitchProps) => (
    <label
        className={clsx(styles.Switch, className)}
        htmlFor={id}
        onClick={(e) => e.stopPropagation()}
    >
        <input
            ref={ref}
            type={'checkbox'}
            id={id}
            className={styles.Switch__input}
            {...rest}
        />
        <span className={styles.Switch__track}>
            <span className={styles.Switch__thumb} />
        </span>
        {label && <span className={styles.Switch__label}>{label}</span>}
    </label>
);
