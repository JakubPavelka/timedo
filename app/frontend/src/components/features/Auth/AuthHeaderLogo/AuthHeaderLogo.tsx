import { useTheme } from '@/hooks/useTheme';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch/ThemeSwitch';
import LogoBlue from '@/assets/images/logo-dark-square.svg?react';
import LogoBlueDarkTheme from '@/assets/images/logo-white-square.svg?react';
import styles from './AuthHeaderLogo.module.scss';

export const AuthHeaderLogo = () => {
    const theme = useTheme((s) => s.theme);

    return (
        <div className={styles.AuthHeaderLogo__wrapper}>
            {theme === 'light' ? (
                <LogoBlue height={40} width={110} />
            ) : (
                <LogoBlueDarkTheme height={40} width={110} />
            )}
            <ThemeSwitch />
        </div>
    );
};
