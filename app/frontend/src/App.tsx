import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import './styles/global.scss';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme';
import { useTimerMode } from './hooks/useTimerMode';
import { Toaster } from 'sonner';

const App = () => {
    const theme = useTheme((s) => s.theme);
    const { t, i18n } = useTranslation();
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    useEffect(() => {
        document.title = t('General.pageTitle');
    }, [t, i18n.language]);

    useEffect(() => {
        if (!localStorage.getItem('timerMode')) {
            const { timerMode, setTimerMode } = useTimerMode.getState();
            setTimerMode(timerMode);
        }
    }, []);

    return (
        <>
            <RouterProvider router={router} />
            <Toaster theme={theme} richColors />
        </>
    );
};

export default App;
