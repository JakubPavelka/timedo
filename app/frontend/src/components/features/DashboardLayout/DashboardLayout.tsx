import { Header } from '../Header/Header';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Sidebar } from '../Sidebar/Sidebar';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useGetProjects } from '@/hooks/api/useProject';
import { useGetTags } from '@/hooks/api/useTag';
import { useActiveTimeEntry, useCreateTimeEntry } from '@/hooks/api/useTimeEntry';
import { useTimerMode } from '@/hooks/useTimerMode';
import { EntryType } from '@timedo/shared/src/schemas/timeEntrySchema';
import { getErrorMessage } from '@/utils/getErrorMessage';
import styles from './DashboardLayout.module.scss';

const titlePaths: Record<string, string> = {
    '/dashboard': 'Sidebar.dashboard',
    '/dashboard/focus': 'Sidebar.focus',
    '/dashboard/tasks/': 'Sidebar.tasks',
    '/dashboard/tasks/$taskId': 'Task.detail',
    '/dashboard/calendar': 'Sidebar.calendar',
    '/dashboard/overview': 'Sidebar.overview',
    '/dashboard/profile': 'Sidebar.profile',
    '/dashboard/projects': 'Projects.projects',
    '/dashboard/tags': 'Tags.tags',
};

export const DashboardLayout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const routeId = useRouterState({
        select: (s) => s.matches.at(-1)?.routeId,
    });
    const title = titlePaths[routeId ?? ''];
    useGetProjects();
    useGetTags();
    const { data: activeEntry } = useActiveTimeEntry();
    const { mutate: createTimeEntry } = useCreateTimeEntry();
    const setTimerMode = useTimerMode((s) => s.setTimerMode);

    const handleTimerClick = () => {
        if (activeEntry) {
            navigate({ to: '/dashboard/focus' });
            return;
        }
        setTimerMode(EntryType.STOPWATCH);
        createTimeEntry(
            { type: EntryType.STOPWATCH },
            {
                onSuccess: () => navigate({ to: '/dashboard/focus' }),
                onError: (err) =>
                    toast.error(getErrorMessage(err, 'Focus.startError', t)),
            }
        );
    };

    return (
        <div className={styles.DashboardLayout}>
            <Sidebar onTimerClick={handleTimerClick} />
            <div className={styles.DashboardLayout__rightSide}>
                <Header title={t(title)} />
                <div className={styles.DashboardLayout__content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
