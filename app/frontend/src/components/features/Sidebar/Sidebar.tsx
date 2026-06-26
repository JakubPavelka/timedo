import LogoBlue from '@/assets/images/logoBlue.svg?react';
import LogoBlueDarkTheme from '@/assets/images/logoBlueDarkTheme.svg?react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { SidebarProfileButton } from './SidebarProfileButton/SidebarProfileButton';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import styles from './Sidebar.module.scss';

type SidebarProps = {
    projects?: any[];
    buttons: any[];
    onTimerClick?: () => void;
};

export const Sidebar = (props: SidebarProps) => {
    const { t } = useTranslation();
    const theme = useTheme((s) => s.theme);

    return (
        <div className={styles.Sidebar}>
            {theme === 'light' ? (
                <LogoBlue height={40} width={110} />
            ) : (
                <LogoBlueDarkTheme height={40} width={110} />
            )}

            <Button
                className={styles.Sidebar__buttonTimer}
                onClick={props.onTimerClick}
                havePlayIcon
            >
                <p>{t('Sidebar.startFocus')}</p>
            </Button>

            <div className={styles.Sidebar__buttonsWrapper}>
                {props.buttons?.map((item, index) => {
                    return (
                        <Link
                            to={item.view}
                            key={`${item.text}-${index}`}
                            className={clsx(styles.Sidebar__button)}
                            activeProps={{ className: styles['--active'] }}
                        >
                            <span className={styles.Sidebar__buttonIcon}>
                                {item.icon}
                            </span>
                            {t(item.text)}
                        </Link>
                    );
                })}
            </div>

            <div className={styles.Sidebar__profileWrapper}>
                <SidebarProfileButton />
            </div>
        </div>
    );
};
