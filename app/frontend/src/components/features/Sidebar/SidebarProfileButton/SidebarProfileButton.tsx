import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';
import { Settings } from 'lucide-react';
import styles from './SidebarProfileButton.module.scss';

export const SidebarProfileButton = () => {
    const { user } = useAuthStore();
    const initialFirstName = user?.firstName?.slice(0, 1);
    const initialLastName = user?.lastName?.slice(0, 1);

    return (
        <Link className={styles.SidebarProfileButton} to={'/profile'}>
            <div className={styles.SidebarProfileButton__initialsWrapper}>
                <div className={styles.SidebarProfileButton__initials}>
                    <p className={styles.SidebarProfileButton__initialText}>
                        {initialFirstName} {user?.lastName && initialLastName}
                    </p>
                </div>
                <p className={styles.SidebarProfileButton__nameText}>
                    {user?.firstName} {user?.lastName && <br />}{' '}
                    {user?.lastName}
                </p>
            </div>
            <Settings width={18} height={18} />
        </Link>
    );
};
