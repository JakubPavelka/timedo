import LogoBlue from '@/assets/images/logoBlue.svg?react';
import LogoBlueDarkTheme from '@/assets/images/logoBlueDarkTheme.svg?react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button/Button';
import styles from './Sidebar.module.scss';
import { Link } from '@tanstack/react-router';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAuthStore } from '@/store/authStore';

type SidebarProps = {
    projects?: any[];
    buttons: any[];
    onTimerClick?: () => void;
};

export const Sidebar = (props: SidebarProps) => {
    const { t } = useTranslation();
    const theme = useTheme((s) => s.theme);
    const { user } = useAuthStore();

    return (
        <div className={styles.Sidebar}>
            {/* LOGO */}
            {theme === 'light' ? (
                <LogoBlue height={40} width={110} />
            ) : (
                <LogoBlueDarkTheme height={40} width={110} />
            )}

            {/* START TIMER BUTTON */}
            <Button
                className={styles.Sidebar__buttonTimer}
                onClick={props.onTimerClick}
                havePlayIcon
            >
                <p>{t('Sidebar.startFocus')}</p>
            </Button>

            {/* BUTTONS */}
            <div className={styles.Sidebar__buttonsWrapper}>
                {props.buttons?.map((item, index) => {
                    return (
                        <div
                            key={`${item.text}-${index}`}
                            className={clsx(
                                styles.Sidebar__button,
                                item.isActive && styles['--active']
                            )}
                        >
                            <span>{item.icon}</span>
                            {item.text} {item.view}
                        </div>
                    );
                })}
            </div>

            {/* PROFILE BUTTON */}
            <div className={styles.Sidebar__profileWrapper}>
                <Link to={'/profile'}>
                    <div>
                        <p>{user?.firstName}</p>
                        <p>{user?.lastName}</p>
                    </div>
                    <Settings />
                </Link>
            </div>
        </div>
    );
};
