import React, { type InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.scss';

type RadioSize = 'sm' | 'md';

type RadioProps = {
    label?: React.ReactNode;
    size?: RadioSize;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;

export const Radio = ({ label, size = 'md', className, id, ...rest }: RadioProps) => (
    <label
        className={clsx(styles.Radio, styles[`Radio--${size}`], className)}
        htmlFor={id}
    >
        <input type={'radio'} id={id} className={styles.Radio__input} {...rest} />
        <span className={styles.Radio__circle}>
            <span className={styles.Radio__dot} />
        </span>
        {label && <span className={styles.Radio__label}>{label}</span>}
    </label>
);
