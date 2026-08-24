import { Input } from '@/components/ui/Input/Input';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
    FocusTimeEntryHistoryItem,
    type FocusTimeEntryHistoryItemProps,
} from './FocusTimeEntryHistoryItem';
import styles from './FocusTimeEntryHistory.module.scss';

type FocusTimeEntryHistoryProps = {
    timeEntries: FocusTimeEntryHistoryItemProps[];
    onDeleteClick?: (id: string) => Promise<void>;
};

export const FocusTimeEntryHistory = (props: FocusTimeEntryHistoryProps) => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');

    const handleDeleteClick = (id: string) => () => {
        return props.onDeleteClick?.(id) ?? Promise.resolve();
    };

    return (
        <div className={styles.FocusTimeEntryHistory}>
            <div className={styles.FocusTimeEntryHistory__headerWrapper}>
                <p className={styles.FocusTimeEntryHistory__title}>
                    {t('Focus.History.historyTracking')}
                </p>
                <div className={styles.FocusTimeEntryHistory__searchInput}>
                    <Input
                        id={'task-search'}
                        placeholder={t('Task.searchTasks')}
                        prefixIcon={<Search width={16} height={16} />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>
            {props.timeEntries?.map((entry) => (
                <FocusTimeEntryHistoryItem
                    key={entry.id}
                    {...entry}
                    onDeleteClick={handleDeleteClick(entry.id)}
                />
            ))}
        </div>
    );
};
