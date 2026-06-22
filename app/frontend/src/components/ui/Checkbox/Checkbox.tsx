import React, { type InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.scss';
import { Check } from 'lucide-react';
import clsx from 'clsx';

type CheckboxProps = {
    label?: React.ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Checkbox = ({ label, className, id, ...rest }: CheckboxProps) => (
    <label className={clsx(styles.Checkbox, className)} htmlFor={id}>
        <input
            type="checkbox"
            id={id}
            className={styles.Checkbox__input}
            {...rest}
        />
        <span className={styles.Checkbox__box}>
            <Check className={styles.Checkbox__check} width={12} height={12} />
        </span>
        {label && <span className={styles.Checkbox__label}>{label}</span>}
    </label>
);
