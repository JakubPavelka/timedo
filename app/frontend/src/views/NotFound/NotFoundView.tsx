import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button/Button';
import { SearchX } from 'lucide-react';
import LogoBlue from '@/assets/images/logoBlue.svg?react';
import LogoBlueDarkTheme from '@/assets/images/logoBlueDarkTheme.svg?react';
import styles from './NotFoundView.module.scss';

export const NotFoundView = () => {
    const { t } = useTranslation();
    const theme = useTheme((s) => s.theme);
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isAuthenticated = !!user;

    const handleBackClick = () =>
        navigate({ to: isAuthenticated ? '/dashboard/focus' : '/login' });

    return (
        <div className={styles.NotFoundView}>
            <div className={styles.NotFoundView__logo}>
                {theme === 'light' ? (
                    <LogoBlue height={40} width={110} />
                ) : (
                    <LogoBlueDarkTheme height={40} width={110} />
                )}
            </div>
            <div className={styles.NotFoundView__content}>
                <div className={styles.NotFoundView__icon}>
                    <SearchX width={24} height={24} />
                </div>
                <p className={styles.NotFoundView__code}>404</p>
                <h1 className={styles.NotFoundView__title}>{t('NotFound.title')}</h1>
                <p className={styles.NotFoundView__description}>
                    {t('NotFound.description')}
                </p>
                <Button onClick={handleBackClick}>
                    {t(
                        isAuthenticated ? 'NotFound.backButtonApp' : 'NotFound.backButton'
                    )}
                </Button>
            </div>
        </div>
    );
};
