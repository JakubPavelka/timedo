import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';
import { Settings } from 'lucide-react';
import clsx from 'clsx';
import styles from './SidebarProfileButton.module.scss';

type SidebarProfileButtonProps = {
    isCollapsed?: boolean;
};

export const SidebarProfileButton = (props: SidebarProfileButtonProps) => {
    const { user } = useAuthStore();
    const initialFirstName = user?.firstName?.slice(0, 1);
    const initialLastName = user?.lastName?.slice(0, 1);

    if (!user) {
        return null;
    }

    return (
        <Link
            className={clsx(
                styles.SidebarProfileButton,
                props.isCollapsed && styles['SidebarProfileButton--collapsed']
            )}
            to={'/dashboard/profile'}
        >
            <div className={styles.SidebarProfileButton__initialsWrapper}>
                <div className={styles.SidebarProfileButton__initials}>
                    <p className={styles.SidebarProfileButton__initialText}>
                        {initialFirstName} {user?.lastName && initialLastName}
                    </p>
                </div>
                {!props.isCollapsed && (
                    <p className={styles.SidebarProfileButton__nameText}>
                        {user?.firstName} {user?.lastName && <br />}{' '}
                        {user?.lastName}
                    </p>
                )}
            </div>
            {!props.isCollapsed && <Settings width={18} height={18} />}
        </Link>
    );
};
