import { Header } from '../Header/Header';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { Sidebar } from '../Sidebar/Sidebar';
import { useTranslation } from 'react-i18next';
import { useGetProjects } from '@/hooks/api/useProject';
import styles from './DashboardLayout.module.scss';

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
    useGetProjects();

    return (
        <div className={styles.DashboardLayout}>
            <Sidebar />
            <div className={styles.DashboardLayout__rightSide}>
                <Header title={t(title)} />
                <div className={styles.DashboardLayout__content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
