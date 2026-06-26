import { Header } from '../Header/Header';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { Sidebar } from '../Sidebar/Sidebar';
import sidebarButtonsData from '@/data/sidebarButtonsData';
import styles from './DashboardLayout.module.scss';
import { useTranslation } from 'react-i18next';

const titlePaths: Record<string, string> = {
    '/dashboard': 'Sidebar.dashboard',
    '/dashboard/focus': 'Sidebar.focus',
    '/dashboard/tasks': 'Sidebar.tasks',
    '/dashboard/calendar': 'Sidebar.calendar',
    '/dashboard/overview': 'Sidebar.overview',
    '/dashboard/profile': 'Sidebar.profile',
};

export const DashboardLayout = () => {
    const { t } = useTranslation();
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const title = titlePaths[pathname];

    return (
        <div className={styles.DashboardLayout}>
            <Sidebar buttons={sidebarButtonsData} projects={[]} />
            <div className={styles.DashboardLayout__rightSide}>
                <Header title={t(title)} />
                <Outlet />
            </div>
        </div>
    );
};
