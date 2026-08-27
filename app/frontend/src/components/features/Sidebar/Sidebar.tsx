import LogoBlue from '@/assets/images/logoBlue.svg?react';
import LogoBlueDarkTheme from '@/assets/images/logoBlueDarkTheme.svg?react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { SidebarProfileButton } from './SidebarProfileButton/SidebarProfileButton';
import { Link } from '@tanstack/react-router';
import { useProjectStore } from '@/store/projectStore';
import sidebarButtonsData from '@/data/sidebarButtonsData';
import { ChevronRight } from 'lucide-react';
import { useTagStore } from '@/store/tagStore';
import styles from './Sidebar.module.scss';

type SidebarProps = {
    onTimerClick?: () => void;
};

export const Sidebar = (props: SidebarProps) => {
    const { t } = useTranslation();
    const theme = useTheme((s) => s.theme);
    const projects = useProjectStore((s) => s.projects);
    const tags = useTagStore((s) => s.tags);

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
                            <span className={styles.Sidebar__buttonIcon}>
                                {item.icon}
                            </span>
                            {t(item.text)}
                        </Link>
                    );
                })}
            </nav>
            <div className={styles.Sidebar__scrollableWrapper}>
                {projects.length !== 0 && (
                    <div>
                        <Link
                            to={'/dashboard/projects'}
                            className={styles.Sidebar__subTitleWrapper}
                        >
                            <span className={styles.Sidebar__subTitle}>
                                {t('Sidebar.projects')}
                            </span>
                            <ChevronRight width={16} height={16} />
                        </Link>
                        <ul className={styles.Sidebar__itemList}>
                            {projects.map((project) => {
                                return (
                                    <li key={project.id}>
                                        <button
                                            className={styles.Sidebar__itemButton}
                                            type={'button'}
                                        >
                                            <span
                                                className={
                                                    styles.Sidebar__itemColorWrapper
                                                }
                                            >
                                                <span
                                                    className={styles.Sidebar__itemDot}
                                                    style={{
                                                        backgroundColor: project.color,
                                                    }}
                                                />
                                                <span
                                                    className={styles.Sidebar__itemText}
                                                >
                                                    {project.label}
                                                </span>
                                            </span>
                                            <span className={styles.Sidebar__itemCount}>
                                                {project._count.tasks}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                <div>
                    <Link
                        to={'/dashboard/tags'}
                        className={styles.Sidebar__subTitleWrapper}
                    >
                        <span className={styles.Sidebar__subTitle}>
                            {t('Sidebar.tags')}
                        </span>
                        <ChevronRight width={16} height={16} />
                    </Link>
                    <ul className={styles.Sidebar__itemList}>
                        {tags.map((tag) => {
                            return (
                                <li key={tag.id}>
                                    <button
                                        className={styles.Sidebar__itemButton}
                                        type={'button'}
                                    >
                                        <span
                                            className={styles.Sidebar__itemColorWrapper}
                                        >
                                            <span
                                                className={styles.Sidebar__itemDot}
                                                style={{
                                                    backgroundColor: tag.color,
                                                }}
                                            />
                                            <span className={styles.Sidebar__itemText}>
                                                {tag.label}
                                            </span>
                                        </span>
                                        <span className={styles.Sidebar__itemCount}>
                                            {tag._count.tasks}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className={styles.Sidebar__profileWrapper}>
                <SidebarProfileButton />
            </div>
        </div>
    );
};
