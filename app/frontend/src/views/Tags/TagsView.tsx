import { ProgressCard } from '@/components/ui/ProgressCard/ProgressCard';
import { useGetTagsWithTasks } from '@/hooks/api/useTag';
import styles from './TagsView.module.scss';
import { AddCard } from '@/components/ui/AddCard/AddCard';
import { useTranslation } from 'react-i18next';

export const TagsView = () => {
    const { t } = useTranslation();
    const { data: tags } = useGetTagsWithTasks();

    return (
        <div className={styles.TagsView}>
            <div className={styles.TagsView__grid}>
                {tags?.map((tag) => (
                    <ProgressCard
                        key={tag.id}
                        title={tag.label}
                        color={tag.color}
                        tasksDone={tag.tasksDone}
                        totalTasks={tag.totalTasks}
                        duration={tag.duration}
                    />
                ))}
                <AddCard text={t('Tags.newTag')} onClick={() => console.log('xd')} />
            </div>
        </div>
    );
};
