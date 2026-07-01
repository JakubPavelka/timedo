import { Card } from '@/components/ui/Card/Card';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, UserRoundX } from 'lucide-react';
import { IconItem } from '@/components/ui/IconItem/IconItem';
import { Button } from '@/components/ui/Button/Button';
import { useDeleteAccount } from '@/hooks/api/useUser';
import { useState, useCallback } from 'react';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { useNavigate } from '@tanstack/react-router';
import styles from './ProfileSecurity.module.scss';

export const ProfileSecurity = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { t } = useTranslation();
    const { mutate: deleteAccount } = useDeleteAccount();
    const navigate = useNavigate();

    const handleOpenModal = useCallback(() => setShowDeleteModal(true), []);
    const handleCloseModal = useCallback(() => setShowDeleteModal(false), []);

    const handleDeleteAccount = useCallback(() => {
        deleteAccount(undefined, {
            onSuccess: () => navigate({ to: '/login' }),
        });
    }, [deleteAccount, navigate]);

    return (
        <Card>
            <SectionHeader
                className={styles.ProfileSecurity__header}
                title={t('Profile.Security.title')}
                icon={
                    <ShieldCheck
                        className={styles.ProfileSecurity__iconAccent}
                        width={16}
                        height={16}
                    />
                }
            />
            <div className={styles.ProfileSecurity__itemsWrapper}>
                <IconItem
                    title={t('Profile.Security.password')}
                    description={t('Profile.Security.passwordDescription')}
                    icon={
                        <Lock
                            className={styles.ProfileSecurity__icon}
                            width={16}
                            height={16}
                        />
                    }
                    rightActions={
                        // TODO Přidat změnit heslo
                        <Button
                            className={styles.ProfileSecurity__button}
                            variant={'outline'}
                        >
                            {t('General.change')}
                        </Button>
                    }
                />
                <IconItem
                    title={t('Profile.Security.deleteAccountTitle')}
                    description={t('Profile.Security.deleteAccountDescription')}
                    icon={
                        <UserRoundX
                            className={styles.ProfileSecurity__iconDanger}
                            width={16}
                            height={16}
                        />
                    }
                    danger
                    rightActions={
                        // TODO Přidat delete účtu
                        <Button
                            className={styles.ProfileSecurity__button}
                            onClick={handleOpenModal}
                            variant={'danger'}
                        >
                            {t('General.delete')}
                        </Button>
                    }
                />
            </div>
            {showDeleteModal && (
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
                    description={t(
                        'Profile.Security.deleteAccountModalDescription'
                    )}
                    confirmText={t('General.delete')}
                    confirmIcon={<UserRoundX width={16} height={16} />}
                />
            )}
        </Card>
    );
};
