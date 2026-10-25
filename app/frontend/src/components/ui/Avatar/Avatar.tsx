import clsx from 'clsx';
import styles from './Avatar.module.scss';

export type AvatarSize = 'sm' | 'lg';

type AvatarProps = {
    firstName: string;
    lastName?: string | null;
    size?: AvatarSize;
    className?: string;
};

export const Avatar = ({ firstName, lastName, size = 'sm', className }: AvatarProps) => {
    const initials = [firstName.slice(0, 1), lastName?.slice(0, 1)]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={clsx(styles.Avatar, styles[`Avatar--${size}`], className)}>
            <p className={styles.Avatar__initials}>{initials}</p>
        </div>
    );
};
