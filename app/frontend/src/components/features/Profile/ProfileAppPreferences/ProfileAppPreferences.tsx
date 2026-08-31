import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { SlidersHorizontal, Sun, Timer, Globe } from 'lucide-react';
import { Card } from '@/components/ui/Card/Card';
import { useTranslation } from 'react-i18next';
import { IconItem } from '@/components/ui/IconItem/IconItem';
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useTimerMode } from '@/hooks/useTimerMode';
import { useActiveTimeEntry } from '@/hooks/api/useTimeEntry';
import styles from './ProfileAppPreferences.module.scss';

export const ProfileAppPreferences = () => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const { timerMode, setTimerMode } = useTimerMode();
    const { data: activeEntry } = useActiveTimeEntry();
    const isRunning = !!activeEntry;

    const themeSegmentedData = [
        {
            title: t('Profile.AppPreferences.Theme.light'),
            isActive: theme === 'light',
            onClick: () => setTheme('light'),
        },
        {
            title: t('Profile.AppPreferences.Theme.dark'),
            isActive: theme === 'dark',
            onClick: () => setTheme('dark'),
        },
    ];

    const timerSegmentedData = [
        {
            title: t('Profile.AppPreferences.Timer.stopwatch'),
            isActive: timerMode === 'STOPWATCH',
            onClick: () => setTimerMode('STOPWATCH'),
        },
        {
            title: t('Profile.AppPreferences.Timer.pomodoro'),
            isActive: timerMode === 'POMODORO',
            onClick: () => setTimerMode('POMODORO'),
        },
    ];

    const languageSegmentedData = [
        {
            title: t('Profile.AppPreferences.Language.czech'),
            isActive: language === 'cs-CZ',
            onClick: () => setLanguage('cs-CZ'),
        },
        {
            title: t('Profile.AppPreferences.Language.english'),
            isActive: language.startsWith('en'),
            onClick: () => setLanguage('en'),
        },
    ];

    return (
        <Card>
            <SectionHeader
                className={styles.ProfileAppPreferences__header}
                title={t('Profile.AppPreferences.title')}
                icon={
                    <SlidersHorizontal
                        className={styles.ProfileAppPreferences__iconAccent}
                        width={16}
                        height={16}
                    />
                }
            />
            <div className={styles.ProfileAppPreferences__itemsWrapper}>
                <IconItem
                    stackOnMobile
                    title={t('Profile.AppPreferences.Theme.title')}
                    description={t('Profile.AppPreferences.Theme.description')}
                    icon={
                        <Sun
                            className={styles.ProfileAppPreferences__icon}
                            width={16}
                            height={16}
                        />
                    }
                    rightActions={<SegmentedControl items={themeSegmentedData} />}
                />
                <IconItem
                    stackOnMobile
                    title={t('Profile.AppPreferences.Timer.title')}
                    description={t('Profile.AppPreferences.Timer.description')}
                    icon={
                        <Timer
                            className={styles.ProfileAppPreferences__icon}
                            width={16}
                            height={16}
                        />
                    }
                    rightActions={
                        <SegmentedControl
                            disabled={isRunning}
                            items={timerSegmentedData}
                        />
                    }
                />
                <IconItem
                    stackOnMobile
                    title={t('Profile.AppPreferences.Language.title')}
                    description={t('Profile.AppPreferences.Language.description')}
                    icon={
                        <Globe
                            className={styles.ProfileAppPreferences__icon}
                            width={16}
                            height={16}
                        />
                    }
                    rightActions={<SegmentedControl items={languageSegmentedData} />}
                />
            </div>
        </Card>
    );
};
