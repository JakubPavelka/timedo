import { ProfileHeader } from '@/components/features/Profile/ProfileHeader/ProfileHeader';
import { ProfilePersonalInfo } from '@/components/features/Profile/ProfilePersonalInfo/ProfilePersonalInfo';
import { ProfileAppPreferences } from '@/components/features/Profile/ProfileAppPreferences/ProfileAppPreferences';
import { ProfileConnectedAccounts } from '@/components/features/Profile/ProfileConnectedAccounts/ProfileConnectedAccounts';
import { ProfileSecurity } from '@/components/features/Profile/ProfileSecurity/ProfileSecurity';
import styles from './ProfileView.module.scss';

export const ProfileView = () => (
    <div className={styles.ProfileView}>
        <ProfileHeader />
        <div className={styles.ProfileView__flexWrapper}>
            <div className={styles.ProfileView__leftSide}>
                <ProfilePersonalInfo />
                <ProfileAppPreferences />
            </div>
            <div className={styles.ProfileView__rightSide}>
                <ProfileConnectedAccounts />
                <ProfileSecurity />
            </div>
        </div>
    </div>
);
