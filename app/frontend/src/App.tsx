import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import './styles/global.scss';
import { useEffect } from 'react';
import { useTheme } from './hooks/useTheme';

const App = () => {
    const theme = useTheme((s) => s.theme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    return <RouterProvider router={router} />;
};

export default App;
