import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
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
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebouncedValue(searchText, 500);

    useEffect(() => {
        props.onSearchChange?.(debouncedSearchText);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchText]);

    const handleDeleteClick = (id: string) => () => {
        return props.onDeleteClick?.(id) ?? Promise.resolve();
    };

    const handleClearSearch = () => setSearchText('');

    return (
        <div className={styles.FocusTimeEntryHistory}>
            <div className={styles.FocusTimeEntryHistory__headerWrapper}>
                <p className={styles.FocusTimeEntryHistory__title}>
                    {t('Focus.History.historyTracking')}
                </p>
                <div className={styles.FocusTimeEntryHistory__searchInput}>
                    <Input
                        id={'task-search'}
                        placeholder={t('Focus.History.searchPlaceholder')}
                        prefixIcon={<Search width={16} height={16} />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        suffixIcon={
                            searchText.length > 0 && (
                                <X width={12} height={12} onClick={handleClearSearch} />
                            )
                        }
                    />
                </div>
            </div>
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
        </div>
    );
};
