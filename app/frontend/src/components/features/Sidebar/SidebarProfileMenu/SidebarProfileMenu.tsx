import { useTranslation } from 'react-i18next';
import {
    LogOut,
    User,
    Contrast,
    Globe,
    Sun,
    Moon,
    ChevronRight,
    ArrowLeft,
    Check,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { useLogout } from '@/hooks/api/useAuth';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import {
    SegmentedControl,
    type SegmentedControlItem,
} from '@/components/ui/SegmentedControl/SegmentedControl';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import styles from './SidebarProfileMenu.module.scss';

type SidebarProfileMenuProps = {
    firstName: string;
    lastName?: string;
    email: string;
    onClick?: () => void;
};

export const SidebarProfileMenu = (props: SidebarProfileMenuProps) => {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [languageView, setLanguageView] = useState(false);
    const { mutate: logout } = useLogout();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const czLang = language === 'cs-CZ';

    const handleOpenModal = useCallback(() => setModalOpen(true), []);
    const handleCloseModal = useCallback(() => setModalOpen(false), []);
    const handleShowLanguageView = () => setLanguageView(true);
    const handleHideLanguageView = () => setLanguageView(false);

    const themeSegmentedData: SegmentedControlItem[] = [
        {
            title: <Sun width={16} height={16} />,
            label: t('Profile.AppPreferences.Theme.light'),
            isActive: theme === 'light',
            onClick: () => setTheme('light'),
        },
        {
            title: <Moon width={16} height={16} />,
            label: t('Profile.AppPreferences.Theme.dark'),
            isActive: theme === 'dark',
            onClick: () => setTheme('dark'),
        },
    ];

    return (
        <div className={styles.SidebarProfileMenu}>
            {!languageView ? (
                <>
                    <div className={styles.SidebarProfileMenu__nameWrapper}>
                        <p className={styles.SidebarProfileMenu__name}>
                            {props.firstName} {props?.lastName}
                        </p>
                        <p className={styles.SidebarProfileMenu__email}>{props.email}</p>
                    </div>

                    <span className={styles.SidebarProfileMenu__divider} />

                    <div className={styles.SidebarProfileMenu__itemsWrapper}>
                        <Link
                            to={'/dashboard/profile'}
                            className={clsx(
                                styles.SidebarProfileMenu__item,
                                styles['SidebarProfileMenu__item--clickable']
                            )}
                            onClick={props.onClick}
                        >
                            <User width={16} height={16} />
                            <span>{t('Sidebar.profile')}</span>
                        </Link>
                        <div className={styles.SidebarProfileMenu__item}>
                            <Contrast width={16} height={16} />
                            <span>{t('Profile.AppPreferences.Theme.title')}</span>
                            <div className={styles.SidebarProfileMenu__itemAction}>
                                <SegmentedControl
                                    variant={'compact'}
                                    items={themeSegmentedData}
                                />
                            </div>
                        </div>
                        <div
                            className={clsx(
                                styles.SidebarProfileMenu__item,
                                styles['SidebarProfileMenu__item--clickable']
                            )}
                            onClick={handleShowLanguageView}
                        >
                            <Globe width={16} height={16} />
                            <span>{t('Profile.AppPreferences.Language.title')}</span>
                            <div className={styles.SidebarProfileMenu__itemAction}>
                                {czLang ? 'Čeština' : 'English'}
                                <ChevronRight width={16} height={16} />
                            </div>
                        </div>
                    </div>

                    <span className={styles.SidebarProfileMenu__divider} />

                    <div
                        className={clsx(
                            styles.SidebarProfileMenu__item,
                            styles['SidebarProfileMenu__item--clickable'],
                            styles['SidebarProfileMenu__item--danger']
                        )}
                        onClick={handleOpenModal}
                    >
                        <LogOut width={16} height={16} />
                        <span>{t('Profile.logout')}</span>
                    </div>

                    <ConfirmModal
                        isOpen={modalOpen}
                        onClose={handleCloseModal}
                        onConfirm={logout}
                        title={`${t('Profile.logout')}?`}
                        description={t('Profile.logoutModalText')}
                        variant={'danger'}
                        icon={<LogOut width={18} height={18} />}
                        confirmText={t('Profile.logout')}
                        confirmIcon={<LogOut width={16} height={16} />}
                    />
                </>
            ) : (
                <div className={styles.SidebarProfileMenu__lngView}>
                    <span
                        className={styles.SidebarProfileMenu__lngViewWrapper}
                        onClick={handleHideLanguageView}
                    >
                        <ArrowLeft width={16} height={16} />
                        {t('General.back')}
                    </span>

                    <span className={styles.SidebarProfileMenu__divider} />

                    <div className={styles.SidebarProfileMenu__itemsWrapper}>
                        <span
                            className={clsx(
                                styles.SidebarProfileMenu__item,
                                styles['SidebarProfileMenu__item--clickable']
                            )}
                            onClick={() => setLanguage('cs-CZ')}
                        >
                            {t('Profile.AppPreferences.Language.czech')}
                            {czLang && (
                                <span className={styles.SidebarProfileMenu__itemAction}>
                                    <Check width={16} height={16} />
                                </span>
                            )}
                        </span>
                        <span
                            className={clsx(
                                styles.SidebarProfileMenu__item,
                                styles['SidebarProfileMenu__item--clickable']
                            )}
                            onClick={() => setLanguage('en')}
                        >
                            {t('Profile.AppPreferences.Language.english')}
                            {!czLang && (
                                <span className={styles.SidebarProfileMenu__itemAction}>
                                    <Check width={16} height={16} />
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
