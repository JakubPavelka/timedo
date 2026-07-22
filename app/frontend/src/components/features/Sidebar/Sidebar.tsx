import LogoBlue from '@/assets/images/logoBlue.svg?react';
import LogoBlueDarkTheme from '@/assets/images/logoBlueDarkTheme.svg?react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { SidebarProfileButton } from './SidebarProfileButton/SidebarProfileButton';
import { Link } from '@tanstack/react-router';
import { useProjectStore } from '@/store/projectStore';
import sidebarButtonsData from '@/data/sidebarButtonsData';
import styles from './Sidebar.module.scss';

type SidebarProps = {
    onTimerClick?: () => void;
};

export const Sidebar = (props: SidebarProps) => {
    const { t } = useTranslation();
    const theme = useTheme((s) => s.theme);
    const projects = useProjectStore((s) => s.projects);

    return (
        <div className={styles.Sidebar}>
            <Link to={'/dashboard'}>
                {theme === 'light' ? (
                    <LogoBlue height={40} width={110} />
                ) : (
                    <LogoBlueDarkTheme height={40} width={110} />
                )}
            </Link>

            <Button
                className={styles.Sidebar__buttonTimer}
                onClick={props.onTimerClick}
                havePlayIcon
                fullWidth
            >
                <p>{t('Sidebar.startFocus')}</p>
            </Button>

            <nav className={styles.Sidebar__buttonsWrapper}>
                {sidebarButtonsData.map((item) => {
                    return (
                        <Link
                            to={item.view}
                            key={item.view}
                            className={styles.Sidebar__button}
                            activeProps={{
                                className: styles['Sidebar__button--active'],
                            }}
                        >
                            <span className={styles.Sidebar__buttonIcon}>{item.icon}</span>
                            {t(item.text)}
                        </Link>
                    );
                })}
            </nav>

            {projects.length !== 0 && (
                <div>
                    <p className={styles.Sidebar__projectsTitle}>{t('Sidebar.projects')}</p>
                    <ul className={styles.Sidebar__projectsList}>
                        {projects.map((project) => {
                            return (
                                <li key={project.id}>
                                    <button
                                        className={styles.Sidebar__projectsButton}
                                        type={'button'}
                                    >
                                        <span className={styles.Sidebar__projectsColorWrapper}>
                                            <span
                                                className={styles.Sidebar__projectsDot}
                                                style={{
                                                    backgroundColor: project.color,
                                                }}
                                            />
                                            <span className={styles.Sidebar__projectsText}>
                                                {project.label}
                                            </span>
                                        </span>
                                        <span className={styles.Sidebar__projectsCount}>
                                            {project._count.tasks}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <div className={styles.Sidebar__profileWrapper}>
                <SidebarProfileButton />
            </div>
        </div>
    );
};
