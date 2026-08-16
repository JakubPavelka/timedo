import React, { useState, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.scss';

type RadioSize = 'sm' | 'md';

type RadioProps = {
    label?: React.ReactNode;
    size?: RadioSize;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'checked'>;

export const Radio = ({
    label,
    size = 'md',
    className,
    id,
    defaultChecked,
    ...rest
}: RadioProps) => {
    const [checked, setChecked] = useState(defaultChecked ?? false);

    const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setChecked((prev) => !prev);
    };

    return (
        <label
            className={clsx(styles.Radio, styles[`Radio--${size}`], className)}
            htmlFor={id}
            onClick={handleLabelClick}
        >
            <input
                type={'radio'}
                id={id}
                className={styles.Radio__input}
                checked={checked}
                readOnly
                {...rest}
            />
            <span className={styles.Radio__circle}>
                <span className={styles.Radio__dot} />
            </span>
            {label && <span className={styles.Radio__label}>{label}</span>}
        </label>
    );
};
