import LogoBlue from '@/assets/images/logoBlue.svg?react';
import LogoBlueDarkTheme from '@/assets/images/logoBlueDarkTheme.svg?react';
import { useTheme } from '@/hooks/useTheme';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { SidebarProfileButton } from './SidebarProfileButton/SidebarProfileButton';
import { Link } from '@tanstack/react-router';
import { useProjectStore } from '@/store/projectStore';
import sidebarButtonsData from '@/data/sidebarButtonsData';
import { ChevronRight, Folder, Tag as TagIcon, PanelLeft, Plus, X } from 'lucide-react';
import { useTagStore } from '@/store/tagStore';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import styles from './Sidebar.module.scss';

type SidebarProps = {
    onTimerClick?: () => void;
};

export const Sidebar = (props: SidebarProps) => {
    const { t } = useTranslation();
    const theme = useTheme((s) => s.theme);
    const projects = useProjectStore((s) => s.projects);
    const tags = useTagStore((s) => s.tags);
    const navigateGlobal = useNavigate();
    const isCollapsible = useMediaQuery('(max-width: 1280px)');
    const [isExpanded, setIsExpanded] = useState(false);

    const closeSidebar = () => setIsExpanded(false);
    const toggleSidebar = () => setIsExpanded((prev) => !prev);

    const handleFilterTag = (tagId: string) => {
        closeSidebar();
        navigateGlobal({
            to: '/dashboard/tasks',
            search: { tag: tagId },
        });
    };

    const handleFilterProject = (projectId: string) => {
        closeSidebar();
        navigateGlobal({
            to: '/dashboard/tasks',
            search: { project: projectId },
        });
    };

    const renderContent = (isRailVariant: boolean) => (
        <>
            <div
                className={clsx(
                    styles.Sidebar__header,
                    isRailVariant && styles['Sidebar__header--rail']
                )}
            >
                <Link
                    to={'/dashboard'}
                    className={styles.Sidebar__logoLink}
                    onClick={closeSidebar}
                >
                    {isRailVariant ? (
                        theme === 'light' ? (
                            <LogoBlue viewBox="0 0 56 56" height={36} width={36} />
                        ) : (
                            <LogoBlueDarkTheme
                                viewBox="0 0 56 56"
                                height={36}
                                width={36}
                            />
                        )
                    ) : theme === 'light' ? (
                        <LogoBlue height={40} width={110} />
                    ) : (
                        <LogoBlueDarkTheme height={40} width={110} />
                    )}
                </Link>
                {isCollapsible && (
                    <button
                        type={'button'}
                        className={styles.Sidebar__toggle}
                        onClick={toggleSidebar}
                        aria-label={t(isExpanded ? 'Sidebar.collapse' : 'Sidebar.expand')}
                    >
                        {isExpanded ? (
                            <X width={18} height={18} />
                        ) : (
                            <PanelLeft width={18} height={18} />
                        )}
                    </button>
                )}
            </div>

            <Button
                className={clsx(
                    styles.Sidebar__buttonTimer,
                    isRailVariant && styles['Sidebar__buttonTimer--rail']
                )}
                onClick={props.onTimerClick}
                havePlayIcon
                fullWidth
            >
                {!isRailVariant && <p>{t('Sidebar.startFocus')}</p>}
            </Button>

            <nav className={styles.Sidebar__buttonsWrapper}>
                {sidebarButtonsData.map((item) => {
                    return (
                        <Link
                            to={item.view}
                            key={item.view}
                            className={clsx(
                                styles.Sidebar__button,
                                isRailVariant && styles['Sidebar__button--rail']
                            )}
                            activeProps={{
                                className: styles['Sidebar__button--active'],
                            }}
                            onClick={closeSidebar}
                        >
                            <span className={styles.Sidebar__buttonIcon}>
                                {item.icon}
                            </span>
                            {!isRailVariant && t(item.text)}
                        </Link>
                    );
                })}
            </nav>
            <div className={styles.Sidebar__scrollableWrapper}>
                <div>
                    {isRailVariant ? (
                        <button
                            type={'button'}
                            className={styles.Sidebar__railSectionButton}
                            onClick={toggleSidebar}
                            aria-label={t('Sidebar.projects')}
                        >
                            <Folder width={18} height={18} />
                        </button>
                    ) : (
                        <>
                            <Link
                                to={'/dashboard/projects'}
                                className={styles.Sidebar__subTitleWrapper}
                                onClick={closeSidebar}
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
                                                onClick={() =>
                                                    handleFilterProject(project.id)
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.Sidebar__itemColorWrapper
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.Sidebar__itemDot
                                                        }
                                                        style={{
                                                            backgroundColor:
                                                                project.color,
                                                        }}
                                                    />
                                                    <span
                                                        className={
                                                            styles.Sidebar__itemText
                                                        }
                                                    >
                                                        {project.label}
                                                    </span>
                                                </span>
                                                <span
                                                    className={styles.Sidebar__itemCount}
                                                >
                                                    {project._count.tasks}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            {projects.length === 0 && (
                                <Link
                                    to={'/dashboard/projects'}
                                    className={styles.Sidebar__emptyListLink}
                                    onClick={closeSidebar}
                                >
                                    <span>{t('Sidebar.addProject')}</span>
                                    <Plus width={16} height={16} />
                                </Link>
                            )}
                        </>
                    )}
                </div>
                <div>
                    {isRailVariant ? (
                        <button
                            type={'button'}
                            className={styles.Sidebar__railSectionButton}
                            onClick={toggleSidebar}
                            aria-label={t('Sidebar.tags')}
                        >
                            <TagIcon width={18} height={18} />
                        </button>
                    ) : (
                        <>
                            <Link
                                to={'/dashboard/tags'}
                                className={styles.Sidebar__subTitleWrapper}
                                onClick={closeSidebar}
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
                                                onClick={() => handleFilterTag(tag.id)}
                                            >
                                                <span
                                                    className={
                                                        styles.Sidebar__itemColorWrapper
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.Sidebar__itemDot
                                                        }
                                                        style={{
                                                            backgroundColor: tag.color,
                                                        }}
                                                    />
                                                    <span
                                                        className={
                                                            styles.Sidebar__itemText
                                                        }
                                                    >
                                                        {tag.label}
                                                    </span>
                                                </span>
                                                <span
                                                    className={styles.Sidebar__itemCount}
                                                >
                                                    {tag._count.tasks}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            {tags.length === 0 && (
                                <Link
                                    to={'/dashboard/tags'}
                                    className={styles.Sidebar__emptyListLink}
                                    onClick={closeSidebar}
                                >
                                    <span>{t('Sidebar.addTag')}</span>
                                    <Plus width={16} height={16} />
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div
                className={clsx(
                    styles.Sidebar__profileWrapper,
                    isRailVariant && styles['Sidebar__profileWrapper--rail']
                )}
            >
                <SidebarProfileButton isCollapsed={isRailVariant} />
            </div>
        </>
    );

    return (
        <>
            {isCollapsible && <div className={styles.Sidebar__spacer} />}

            {!isCollapsible && (
                <div className={styles.Sidebar}>{renderContent(false)}</div>
            )}

            {isCollapsible && !isExpanded && (
                <div className={styles.Sidebar__rail}>{renderContent(true)}</div>
            )}

            <AnimatePresence>
                {isCollapsible && isExpanded && (
                    <>
                        <motion.div
                            key={'backdrop'}
                            className={styles.Sidebar__backdrop}
                            onClick={closeSidebar}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.div
                            key={'panel'}
                            className={styles.Sidebar__panel}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            {renderContent(false)}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
