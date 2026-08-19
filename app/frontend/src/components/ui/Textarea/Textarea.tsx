import styles from './Textarea.module.scss';
import clsx from 'clsx';

type TextareaVariant = 'default' | 'filled';

type TextareaProps = {
    variant?: TextareaVariant;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({
    variant = 'default',
    disabled,
    className,
    ...rest
}: TextareaProps) => (
    <div
        className={clsx(
            styles.Textarea,
            styles[`Textarea--${variant}`],
            className
        )}
    >
        <textarea
            className={styles.Textarea__input}
            {...rest}
            disabled={disabled}
        />
    </div>
);
