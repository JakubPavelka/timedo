import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import styles from './ProfileHeader.module.scss';

export const ProfileHeader = () => {
    const { user } = useAuthStore();

    return (
        <div className={styles.ProfileHeader}>
            <div className={styles.ProfileHeader__leftSide}>
                {user && (
                    <Avatar
                        firstName={user.firstName}
                        lastName={user.lastName}
                        size={'lg'}
                    />
                )}
                <div className={styles.ProfileHeader__informationWrapper}>
                    <p className={styles.ProfileHeader__name}>
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className={styles.ProfileHeader__email}>{user?.email}</p>
                </div>
            </div>
        </div>
    );
};
