import { Input } from '@/components/ui/Input/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl';
import { Button } from '@/components/ui/Button/Button';
import { Plus, Search } from 'lucide-react';
import styles from './TaskHeader.module.scss';
import { useTranslation } from 'react-i18next';
import { Filter } from '@/components/ui/Filter/Filter';
import { useProjectStore } from '@/store/projectStore';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';

type TaskHeader = {
    onNewTaskClick: () => void;
};

export const TaskHeader = (props: TaskHeader) => {
    const { t } = useTranslation();
    const projects = useProjectStore((s) => s.projects);

    const statusSegmentedData = [
        {
            title: t('Task.Status.all'),
            isActive: true,
            onClick: () => {},
        },
        {
            title: t('Task.Status.active'),
            isActive: false,
            onClick: () => {},
        },
        {
            title: t('Task.Status.todo'),
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

                <Filter>
                    <div className={styles.TaskHeader__filterMenu}>
                        <p className={styles.TaskHeader__filterTitle}>
                            {t('Task.Modal.priority')}
                        </p>

                        <div className={styles.TaskHeader__filterPriorityWrapper}>
                            <Checkbox
                                size={'sm'}
                                label={
                                    <div
                                        className={styles.TaskHeader__filterPriorityItem}
                                    >
                                        <PriorityIcon level={'LOW'} />
                                        <p>{t('Task.Priority.low')}</p>
                                    </div>
                                }
                            />
                            <Checkbox
                                size={'sm'}
                                label={
                                    <div
                                        className={styles.TaskHeader__filterPriorityItem}
                                    >
                                        <PriorityIcon level={'MEDIUM'} />
                                        <p>{t('Task.Priority.medium')}</p>
                                    </div>
                                }
                            />
                            <Checkbox
                                size={'sm'}
                                label={
                                    <div
                                        className={styles.TaskHeader__filterPriorityItem}
                                    >
                                        <PriorityIcon level={'HIGH'} />
                                        <p>{t('Task.Priority.high')}</p>
                                    </div>
                                }
                            />
                        </div>

                        <div className={styles.TaskHeader__filterDivider} />

                        <p className={styles.TaskHeader__filterTitle}>
                            {t('Task.Modal.project')}
                        </p>
                        <div className={styles.TaskHeader__filterProjectWrapper}>
                            {projects.map((project) => (
                                <Checkbox
                                    key={project.id}
                                    label={
                                        <span
                                            className={
                                                styles.TaskHeader__filterProjectItem
                                            }
                                        >
                                            <span
                                                style={{ background: project.color }}
                                                className={
                                                    styles.TaskHeader__filterProjectDot
                                                }
                                            />
                                            {project.label}
                                        </span>
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </Filter>
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
