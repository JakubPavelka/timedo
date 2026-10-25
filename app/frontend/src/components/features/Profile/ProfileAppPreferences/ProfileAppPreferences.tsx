import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { Card } from '@/components/ui/Card/Card';
import { useTranslation } from 'react-i18next';
import { OptionItem } from '@/components/ui/OptionItem/OptionItem';
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
//import { useTimerMode } from '@/hooks/useTimerMode';
//import { useActiveTimeEntry } from '@/hooks/api/useTimeEntry';
import styles from './ProfileAppPreferences.module.scss';

export const ProfileAppPreferences = () => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    //const { timerMode, setTimerMode } = useTimerMode();
    //const { data: activeEntry } = useActiveTimeEntry();
    //const isRunning = !!activeEntry;

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

    {
        /* const timerSegmentedData = [
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
    */
    }

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
        <section className={styles.ProfileAppPreferences}>
            <SectionHeader
                title={t('Profile.AppPreferences.title')}
                description={t('Profile.AppPreferences.description')}
            />
            <Card flush>
                <OptionItem
                    stackOnMobile
                    title={t('Profile.AppPreferences.Theme.title')}
                    description={t('Profile.AppPreferences.Theme.description')}
                    rightActions={<SegmentedControl items={themeSegmentedData} />}
                />
                {/*
                <OptionItem
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
                */}
                <OptionItem
                    stackOnMobile
                    title={t('Profile.AppPreferences.Language.title')}
                    description={t('Profile.AppPreferences.Language.description')}
                    rightActions={<SegmentedControl items={languageSegmentedData} />}
                />
            </Card>
        </section>
    );
};
