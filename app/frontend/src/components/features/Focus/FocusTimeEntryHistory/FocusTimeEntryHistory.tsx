import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { History, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
    FocusTimeEntryHistoryItem,
    type FocusTimeEntryHistoryItemProps,
} from './FocusTimeEntryHistoryItem';
import styles from './FocusTimeEntryHistory.module.scss';

type FocusTimeEntryHistoryProps = {
    timeEntries: FocusTimeEntryHistoryItemProps[];
    hasMore?: boolean;
    onSearchChange?: (search: string) => void;
    onLoadMoreClick?: () => void;
    onDeleteClick?: (id: string) => Promise<void>;
    onItemClick?: (id: string) => void;
};

export const FocusTimeEntryHistory = (props: FocusTimeEntryHistoryProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebouncedValue(searchText, 500);
    const isEmpty = (props.timeEntries?.length ?? 0) === 0 && !searchText;

    useEffect(() => {
        props.onSearchChange?.(debouncedSearchText);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchText]);

    const handleDeleteClick = (id: string) => () => {
        return props.onDeleteClick?.(id) ?? Promise.resolve();
    };

    const handleClearSearch = () => setSearchText('');

    const handleGoToTasksClick = () => navigate({ to: '/dashboard/tasks' });

    return (
        <div className={styles.FocusTimeEntryHistory}>
            <div className={styles.FocusTimeEntryHistory__headerWrapper}>
                <p className={styles.FocusTimeEntryHistory__title}>
                    {t('Focus.History.historyTracking')}
                </p>
                {!isEmpty && (
                    <div className={styles.FocusTimeEntryHistory__searchInput}>
                        <Input
                            id={'task-search'}
                            placeholder={t('Focus.History.searchPlaceholder')}
                            prefixIcon={<Search width={16} height={16} />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            suffixIcon={
                                searchText.length > 0 && (
                                    <X
                                        width={12}
                                        height={12}
                                        onClick={handleClearSearch}
                                    />
                                )
                            }
                        />
                    </div>
                )}
            </div>
            {isEmpty ? (
                <div className={styles.FocusTimeEntryHistory__emptyWrapper}>
                    <div className={styles.FocusTimeEntryHistory__emptyIcon}>
                        <History width={24} height={24} />
                    </div>
                    <p className={styles.FocusTimeEntryHistory__emptyTitle}>
                        {t('Focus.History.emptyTitle')}
                    </p>
                    <p className={styles.FocusTimeEntryHistory__emptyDescription}>
                        {t('Focus.History.emptyDescription')}
                    </p>
                    <Button onClick={handleGoToTasksClick}>
                        {t('Focus.History.goToTasks')}
                    </Button>
                </div>
            ) : (
                <>
                    {props.timeEntries?.map((entry) => (
                        <FocusTimeEntryHistoryItem
                            key={entry.id}
                            {...entry}
                            onDeleteClick={handleDeleteClick(entry.id)}
                            onItemClick={() => props.onItemClick?.(entry.id)}
                        />
                    ))}
                    {props.hasMore && (
                        <Button
                            variant={'outline'}
                            fullWidth
                            onClick={props.onLoadMoreClick}
                            className={styles.FocusTimeEntryHistory__loadMoreButton}
                        >
                            <p>{t('Focus.History.loadMore')}</p>
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};
