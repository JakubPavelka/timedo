import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LogoutModal } from '@/components/ui/Modal/LogoutModal/LogoutModal';
import { useLogout } from '@/hooks/api/useAuth';
import styles from './ProfileHeader.module.scss';

export const ProfileHeader = () => {
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const { mutate: logout } = useLogout();

    const { t } = useTranslation();
    const { user } = useAuthStore();
    const initialFirstName = user?.firstName?.slice(0, 1);
    const initialLastName = user?.lastName?.slice(0, 1);

    const handleOpenModal = () => setLogoutModalOpen(true);
    const handleCloseModal = () => setLogoutModalOpen(false);

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
            <Button variant={'outline-danger'} onClick={handleOpenModal}>
                <span className={styles.ProfileHeader__buttonText}>
                    <LogOut width={16} height={16} />
                    <span>{t('Profile.logout')}</span>
                </span>
            </Button>
            <LogoutModal
                isOpen={logoutModalOpen}
                onClose={handleCloseModal}
                onConfirm={logout}
            />
        </Card>
    );
};
