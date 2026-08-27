import { ProgressCard } from '@/components/ui/ProgressCard/ProgressCard';
import { useGetProjectsWithTasks } from '@/hooks/api/useProject';
import { AddCard } from '@/components/ui/AddCard/AddCard';
import { useTranslation } from 'react-i18next';
import styles from './ProjectsView.module.scss';

export const ProjectsView = () => {
    const { t } = useTranslation();
    const { data: projects } = useGetProjectsWithTasks();

    return (
        <div className={styles.ProjectsView}>
            <div className={styles.ProjectsView__grid}>
                {projects?.map((project) => (
                    <ProgressCard
                        key={project.id}
                        title={project.label}
                        color={project.color}
                        tasksDone={project.tasksDone}
                        totalTasks={project.totalTasks}
                        duration={project.duration}
                    />
                ))}
                <AddCard
                    text={t('Projects.newProject')}
                    onClick={() => console.log('xd')}
                />
            </div>
        </div>
    );
};
