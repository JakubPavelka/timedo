import { Input } from '@/components/ui/Input/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl';
import { Button } from '@/components/ui/Button/Button';
import { Plus, Search } from 'lucide-react';
import styles from './TaskHeader.module.scss';
import { useTranslation } from 'react-i18next';

type TaskHeader = {
    onNewTaskClick: () => void;
};

export const TaskHeader = (props: TaskHeader) => {
    const { t } = useTranslation();

    const statusSegmentedData = [
        {
            title: t('Task.Status.active'),
            isActive: true,
            onClick: () => {},
        },
        {
            title: t('Task.Status.todo'),
            isActive: false,
            onClick: () => {},
        },
        {
            title: t('Task.Status.all'),
            isActive: false,
            onClick: () => {},
        },
        {
            title: t('Task.Status.done'),
            isActive: false,
            onClick: () => {},
        },
    ];

    return (
        <div className={styles.TaskHeader}>
            <div className={styles.TaskHeader__leftSide}>
                <div className={styles.TaskHeader__searchInput}>
                    <Input
                        id={'task-search'}
                        placeholder={t('Task.searchTasks')}
                        prefixIcon={<Search width={16} height={16} />}
                    />
                </div>
                <SegmentedControl items={statusSegmentedData} />
            </div>
            <Button onClick={props.onNewTaskClick}>
                <span className={styles.TaskHeader__buttonWrapper}>
                    <Plus width={16} height={16} />
                    <span>{t('Task.newTask')}</span>
                </span>
            </Button>
        </div>
    );
};
