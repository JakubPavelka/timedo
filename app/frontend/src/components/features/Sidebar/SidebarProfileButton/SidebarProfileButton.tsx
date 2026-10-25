import { useAuthStore } from '@/store/authStore';
import { EllipsisVertical } from 'lucide-react';
import clsx from 'clsx';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import styles from './SidebarProfileButton.module.scss';

type SidebarProfileButtonProps = {
    isCollapsed?: boolean;
};

export const SidebarProfileButton = (props: SidebarProfileButtonProps) => {
    const { user } = useAuthStore();

    if (!user) {
        return null;
    }

    return (
        <div
            className={clsx(
                styles.SidebarProfileButton,
                props.isCollapsed && styles['SidebarProfileButton--collapsed']
            )}
        >
            <div className={styles.SidebarProfileButton__initialsWrapper}>
                <Avatar firstName={user.firstName} lastName={user.lastName} />
                {!props.isCollapsed && (
                    <p className={styles.SidebarProfileButton__nameText}>
                        {user?.firstName} {user?.lastName && <br />} {user?.lastName}
                    </p>
                )}
            </div>
            {!props.isCollapsed && <EllipsisVertical width={18} height={18} />}
        </div>
    );
};
