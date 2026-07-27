import { ProfileHeader } from '@/components/features/Profile/ProfileHeader/ProfileHeader';
import { ProfilePersonalInfo } from '@/components/features/Profile/ProfilePersonalInfo/ProfilePersonalInfo';
import { ProfileAppPreferences } from '@/components/features/Profile/ProfileAppPreferences/ProfileAppPreferences';
import { ProfileConnectedAccounts } from '@/components/features/Profile/ProfileConnectedAccounts/ProfileConnectedAccounts';
import { ProfileSecurity } from '@/components/features/Profile/ProfileSecurity/ProfileSecurity';
import { useUpdateMe } from '@/hooks/api/useAuth';
import { ApiError } from '@/api/ApiError';
import type { ProfileData } from '@timedo/shared/src/schemas/profileSchema';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styles from './ProfileView.module.scss';

export const ProfileView = () => {
    const { t } = useTranslation();
    const { mutateAsync: changeProfileData } = useUpdateMe();

    const handleChangeProfileData = (data: ProfileData) => {
        return changeProfileData(data, {
            onSuccess: () => toast.success(t('General.changesSaved')),
            onError: (err) =>
                toast.error(
                    err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                        ? t(`BackendErrors.${err.code}`)
                        : t('Profile.PersonalInfo.updateError')
                ),
        });
    };

    return (
        <div className={styles.ProfileView}>
            <ProfileHeader />
            <div className={styles.ProfileView__flexWrapper}>
                <div className={styles.ProfileView__leftSide}>
                    <ProfilePersonalInfo onSubmit={handleChangeProfileData} />
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
