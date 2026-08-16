import { Input } from '@/components/ui/Input/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl';
import { Button } from '@/components/ui/Button/Button';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Filter } from '@/components/ui/Filter/Filter';
import { useProjectStore } from '@/store/projectStore';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { Checkbox } from '@/components/ui/Checkbox/Checkbox';
import { Popover } from '@/components/ui/Popover/Popover';
import { Route } from '@/routes/dashboard/tasks/index';
import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import styles from './TaskHeader.module.scss';

type TaskHeader = {
    onNewTaskClick: () => void;
    selectedCount: number;
};

export const TaskHeader = (props: TaskHeader) => {
    const { t } = useTranslation();
    const projects = useProjectStore((s) => s.projects);
    const {
        status,
        priority: priorityParam,
        project: projectParam,
        search,
    } = Route.useSearch();
    const navigate = Route.useNavigate();
    const priority = priorityParam ? priorityParam.split(',') : [];
    const project = projectParam ? projectParam.split(',') : [];
    const [searchInput, setSearchInput] = useState(search ?? '');
    const [prevSearch, setPrevSearch] = useState(search);
    if (search !== prevSearch) {
        setPrevSearch(search);
        setSearchInput(search ?? '');
    }
    const debouncedSearch = useDebouncedValue(searchInput, 500);

    const handlePriorityToggle = (level: 'LOW' | 'MEDIUM' | 'HIGH') => {
        const nextPriority = priority.includes(level)
            ? priority.filter((p) => p !== level)
            : [...priority, level];

        navigate({
            search: (prev) => ({
                ...prev,
                priority: nextPriority.join(',') || undefined,
            }),
        });
    };

    const handleProjectToggle = (proj: string) => {
        const nextProject = project.includes(proj)
            ? project.filter((p) => p !== proj)
            : [...project, proj];

        navigate({
            search: (prev) => ({
                ...prev,
                project: nextProject.join(',') || undefined,
            }),
        });
    };

    const handleStatusChange = (nextStatus: string | undefined) => {
        navigate({ search: (prev) => ({ ...prev, status: nextStatus }) });
    };

    useEffect(() => {
        navigate({
            search: (prev) => ({ ...prev, search: debouncedSearch || undefined }),
            replace: true,
        });
    }, [debouncedSearch, navigate]);

    const statusSegmentedData = [
        {
            title: t('Task.Status.all'),
            isActive: status === undefined,
            onClick: () => handleStatusChange(undefined),
        },
        {
            title: t('Task.Status.active'),
            isActive: status === 'ACTIVE',
            onClick: () => handleStatusChange('ACTIVE'),
        },
        {
            title: t('Task.Status.todo'),
            isActive: status === 'TODO',
            onClick: () => handleStatusChange('TODO'),
        },
        {
            title: t('Task.Status.done'),
            isActive: status === 'DONE',
            onClick: () => handleStatusChange('DONE'),
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
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
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
                                checked={priority.includes('LOW')}
                                onChange={() => handlePriorityToggle('LOW')}
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
                                checked={priority.includes('MEDIUM')}
                                onChange={() => handlePriorityToggle('MEDIUM')}
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
                                checked={priority.includes('HIGH')}
                                onChange={() => handlePriorityToggle('HIGH')}
                            />
                        </div>

                        <div className={styles.TaskHeader__filterDivider} />

                        <p className={styles.TaskHeader__filterTitle}>
                            {t('Task.Modal.project')}
                        </p>
                        <div className={styles.TaskHeader__filterProjectWrapper}>
                            {projects.map((proj) => (
                                <Checkbox
                                    key={proj.id}
                                    label={
                                        <span
                                            className={
                                                styles.TaskHeader__filterProjectItem
                                            }
                                        >
                                            <span
                                                style={{ background: proj.color }}
                                                className={
                                                    styles.TaskHeader__filterProjectDot
                                                }
                                            />
                                            {proj.label}
                                        </span>
                                    }
                                    onChange={() => handleProjectToggle(proj.id)}
                                    checked={project.includes(proj.id)}
                                />
                            ))}
                        </div>
                    </div>
                </Filter>
            </div>

            <div className={styles.TaskHeader__rightSide}>
                {props.selectedCount > 0 && (
                    <Popover
                        align={'right'}
                        trigger={
                            <Button variant={'outline'}>
                                <span className={styles.TaskHeader__buttonWrapper}>
                                    {t('Task.actions', { count: props.selectedCount })}
                                </span>
                            </Button>
                        }
                    >
                        <div className={styles.TaskHeader__actionsMenu}>ahoj</div>
                    </Popover>
                )}
                <Button onClick={props.onNewTaskClick}>
                    <span className={styles.TaskHeader__buttonWrapper}>
                        <Plus width={16} height={16} />
                        <span>{t('Task.newTask')}</span>
                    </span>
                </Button>
            </div>
        </div>
    );
};
