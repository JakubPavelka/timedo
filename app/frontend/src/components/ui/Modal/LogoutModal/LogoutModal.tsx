import { LogOut } from 'lucide-react';
import { Modal } from '../Modal';
import styles from './LogoutModal.module.scss';
import { Button } from '../../Button/Button';
import { useTranslation } from 'react-i18next';

type LogoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export const LogoutModal = (props: LogoutModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <div className={styles.LogoutModal}>
                <div className={styles.LogoutModal__iconWrapper}>
                    <LogOut
                        className={styles.LogoutModal__icon}
                        width={18}
                        height={18}
                    />
                </div>
                <p className={styles.LogoutModal__title}>
                    {t('Profile.logout')}?
                </p>
                <p className={styles.LogoutModal__text}>
                    {t('Profile.logoutModalText')}
                </p>
                <div className={styles.LogoutModal__buttonsWrapper}>
                    <Button onClick={props.onClose} variant={'outline'}>
                        <p>{t('General.cancel')}</p>
                    </Button>
                    <Button onClick={props.onConfirm} variant={'danger'}>
                        <span className={styles.LogoutModal__buttonText}>
                            <LogOut width={16} height={16} />
                            <span>{t('Profile.logout')}</span>
                        </span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
