import { ProfileHeader } from '@/components/features/Profile/ProfileHeader/ProfileHeader';
import { ProfilePersonalInfo } from '@/components/features/Profile/ProfilePersonalInfo/ProfilePersonalInfo';
import { ProfileAppPreferences } from '@/components/features/Profile/ProfileAppPreferences/ProfileAppPreferences';
import { ProfileConnectedAccounts } from '@/components/features/Profile/ProfileConnectedAccounts/ProfileConnectedAccounts';
import { ProfileSecurity } from '@/components/features/Profile/ProfileSecurity/ProfileSecurity';
import { useUpdateMe } from '@/hooks/api/useAuth';
import type { ProfileData } from '@timedo/shared/src/schemas/profileSchema';
import styles from './ProfileView.module.scss';

export const ProfileView = () => {
    const { mutateAsync: changeProfileData, error } = useUpdateMe();

    const handleChangeProfileData = (data: ProfileData) => {
        return changeProfileData(data);
    };

    return (
        <div className={styles.ProfileView}>
            <ProfileHeader />
            <div className={styles.ProfileView__flexWrapper}>
                <div className={styles.ProfileView__leftSide}>
                    <ProfilePersonalInfo onSubmit={handleChangeProfileData} />
                    <p>{error?.message}</p>
                    <ProfileAppPreferences />
                </div>
                <div className={styles.ProfileView__rightSide}>
                    <ProfileConnectedAccounts />
                    <ProfileSecurity />
                </div>
            </div>
        </div>
    );
};
