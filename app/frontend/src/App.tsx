import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import './styles/global.scss';
import { useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useTimerMode } from './hooks/useTimerMode';

const App = () => {
    const theme = useTheme((s) => s.theme);
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    useEffect(() => {
        if (!localStorage.getItem('timerMode')) {
            const { timerMode, setTimerMode } = useTimerMode.getState();
            setTimerMode(timerMode);
        }
    }, []);

    return <RouterProvider router={router} />;
};

export default App;
