import { Card } from '@/components/ui/Card/Card';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { useTranslation } from 'react-i18next';
import { UserRoundX } from 'lucide-react';
import { OptionItem } from '@/components/ui/OptionItem/OptionItem';
import { Button } from '@/components/ui/Button/Button';
import { useDeleteAccount } from '@/hooks/api/useUser';
import { useState, useCallback } from 'react';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { ChangePasswordModal } from '@/components/features/Profile/ChangePasswordModal/ChangePasswordModal';
import { useNavigate } from '@tanstack/react-router';
import styles from './ProfileSecurity.module.scss';

export const ProfileSecurity = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const { t } = useTranslation();
    const { mutate: deleteAccount } = useDeleteAccount();
    const navigate = useNavigate();

    const handleOpenModal = useCallback(() => setShowDeleteModal(true), []);
    const handleCloseModal = useCallback(() => setShowDeleteModal(false), []);

    const handleOpenChangePasswordModal = useCallback(
        () => setShowChangePasswordModal(true),
        []
    );
    const handleCloseChangePasswordModal = useCallback(
        () => setShowChangePasswordModal(false),
        []
    );

    const handleDeleteAccount = useCallback(() => {
        deleteAccount(undefined, {
            onSuccess: () => navigate({ to: '/login' }),
        });
    }, [deleteAccount, navigate]);

    const deleteConfirmationWord = t('Profile.Security.deleteAccountConfirmWord');

    return (
        <section className={styles.ProfileSecurity}>
            <SectionHeader title={t('Profile.Security.title')} />
            <Card flush>
                <OptionItem
                    title={t('Profile.Security.password')}
                    description={t('Profile.Security.passwordDescription')}
                    rightActions={
                        <Button
                            className={styles.ProfileSecurity__button}
                            onClick={handleOpenChangePasswordModal}
                            variant={'outline'}
                        >
                            {t('General.change')}
                        </Button>
                    }
                />
                <OptionItem
                    title={t('Profile.Security.deleteAccountTitle')}
                    description={t('Profile.Security.deleteAccountDescription')}
                    rightActions={
                        <Button
                            className={styles.ProfileSecurity__button}
                            onClick={handleOpenModal}
                            variant={'outline-danger'}
                        >
                            {t('General.delete')}
                        </Button>
                    }
                />
            </Card>
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={handleCloseModal}
                onConfirm={handleDeleteAccount}
                variant={'danger'}
                title={`${t('Profile.Security.deleteAccountTitle')}?`}
                icon={
                    <UserRoundX
                        className={styles.ProfileSecurity__iconDanger}
                        width={18}
                        height={18}
                    />
                }
                description={t('Profile.Security.deleteAccountModalDescription')}
                confirmText={t('General.delete')}
                confirmIcon={<UserRoundX width={16} height={16} />}
                confirmationWord={deleteConfirmationWord}
                confirmationLabel={t('Profile.Security.deleteAccountConfirmLabel', {
                    word: deleteConfirmationWord,
                })}
            />
            <ChangePasswordModal
                isOpen={showChangePasswordModal}
                onClose={handleCloseChangePasswordModal}
            />
        </section>
    );
};
