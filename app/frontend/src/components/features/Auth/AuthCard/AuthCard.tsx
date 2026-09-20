import { useTranslation } from 'react-i18next';
import styles from './AuthCard.module.scss';
//import Google from '@/assets/images/googleLogo.svg?react';

type AuthCardProps = {
    onGoogleSignClick?: () => void;
    isInRegister?: boolean;
    title?: string;
    description?: string;
};

export const AuthCard = (props: AuthCardProps) => {
    const { t } = useTranslation();

    const title =
        props.title ??
        (props.isInRegister ? t('AuthCard.createAccount') : t('AuthCard.signIn'));
    const description =
        props.description ??
        (props.isInRegister ? t('AuthCard.tryForFree') : t('AuthCard.continue'));

    return (
        <div>
            <h1 className={styles.AuthCard__title}>{title}</h1>
            <p className={styles.AuthCard__welcomeBackText}>{description}</p>
            {/* 
            <button type={'button'} className={styles.AuthCard__googleCard}>
                <Google />
                <span className={styles.AuthCard__cardText}>
                    {t('AuthCard.continueWithGoogle')}
                </span>
            </button>
            <div className={styles.AuthCard__withEmailWrapper}>
                <div className={styles.AuthCard__divider} />
                <p className={styles.AuthCard__withEmailText}>
                    {t('AuthCard.orWithEmail')}
                </p>
                <div className={styles.AuthCard__divider} />
            </div>
            */}
        </div>
    );
};
