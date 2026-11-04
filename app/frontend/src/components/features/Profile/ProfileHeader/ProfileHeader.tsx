import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import styles from './ProfileHeader.module.scss';

export const ProfileHeader = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuthStore();

    const memberSince = user?.createdAt
        ? new Intl.DateTimeFormat(i18n.language, {
              month: 'long',
              year: 'numeric',
          }).format(new Date(user.createdAt))
        : null;

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
                    <p className={styles.ProfileHeader__meta}>
                        <span className={styles.ProfileHeader__email}>{user?.email}</span>
                        {memberSince && (
                            <>
                                <span className={styles.ProfileHeader__separator}>
                                    {' · '}
                                </span>
                                <span className={styles.ProfileHeader__memberSince}>
                                    {t('Profile.memberSince', { date: memberSince })}
                                </span>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
