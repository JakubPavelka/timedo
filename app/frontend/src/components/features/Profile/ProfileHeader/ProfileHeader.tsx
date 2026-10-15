import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card/Card';
import styles from './ProfileHeader.module.scss';

export const ProfileHeader = () => {
    const { user } = useAuthStore();
    const initialFirstName = user?.firstName?.slice(0, 1);
    const initialLastName = user?.lastName?.slice(0, 1);

    return (
        <Card className={styles.ProfileHeader}>
            <div className={styles.ProfileHeader__leftSide}>
                <div className={styles.ProfileHeader__initials}>
                    <p className={styles.ProfileHeader__initialText}>
                        {initialFirstName} {user?.lastName && initialLastName}
                    </p>
                </div>
                <div className={styles.ProfileHeader__informationWrapper}>
                    <p className={styles.ProfileHeader__name}>
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className={styles.ProfileHeader__email}>{user?.email}</p>
                </div>
            </div>
        </Card>
    );
};
