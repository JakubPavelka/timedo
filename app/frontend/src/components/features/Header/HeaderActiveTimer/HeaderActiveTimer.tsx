import { Link, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Pill } from '@/components/ui/Pill/Pill';
import { useActiveTimeEntry } from '@/hooks/api/useTimeEntry';
import { useElapsedSeconds } from '@/hooks/useElapsedSeconds';
import { formatDuration } from '@/utils/formatDuration';
import styles from './HeaderActiveTimer.module.scss';

export const HeaderActiveTimer = () => {
    const { t } = useTranslation();
    const { data: activeEntry } = useActiveTimeEntry();
    const elapsedSeconds = useElapsedSeconds(activeEntry?.startedAt, !!activeEntry);
    const routeId = useRouterState({ select: (s) => s.matches.at(-1)?.routeId });
    const isOnFocusPage = routeId === '/dashboard/focus';

    if (!activeEntry || isOnFocusPage) {
        return null;
    }

    return (
        <Link
            to={'/dashboard/focus'}
            className={styles.HeaderActiveTimer}
            aria-label={t('Header.activeTimer')}
        >
            <Pill variant={'colored'} tone={'accent'} dot>
                {formatDuration(elapsedSeconds)}
            </Pill>
        </Link>
    );
};
