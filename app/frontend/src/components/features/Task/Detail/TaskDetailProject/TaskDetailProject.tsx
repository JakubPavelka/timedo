import { Popover, type PopoverHandle } from '@/components/ui/Popover/Popover';
import { Pill } from '@/components/ui/Pill/Pill';
import { Plus } from 'lucide-react';
import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateTask } from '@/hooks/api/useTask';
import { useProjectStore } from '@/store/projectStore';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { LabelColorForm } from '@/components/features/Forms/LabelColorForm/LabelColorForm';
import {
    ProjectSchema,
    type ProjectData,
} from '@timedo/shared/src/schemas/projectSchema';
import { useCreateProject } from '@/hooks/api/useProject';
import clsx from 'clsx';
import styles from './TaskDetailProject.module.scss';

type TaskDetailProjectProps = {
    project: {
        id: string;
        label: string;
        color: string;
    } | null;
    taskId: string;
};

export const TaskDetailProject = (props: TaskDetailProjectProps) => {
    const { t } = useTranslation();
    const { mutate: updateTask } = useUpdateTask(props.taskId);
    const { mutate: createProject } = useCreateProject();
    const projects = useProjectStore((s) => s.projects);
    const popoverRef = useRef<PopoverHandle>(null);
    const [showCreateProject, setShowCreateProject] = useState(false);

    const handleShowCreateProject = () => setShowCreateProject(true);
    const handleHideCreateProject = () => setShowCreateProject(false);
    const handlePopoverOpenChange = useCallback((isOpen: boolean) => {
        if (!isOpen) {
            setShowCreateProject(false);
        }
    }, []);
    const handleCreateProjectKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleShowCreateProject();
        }
    };

    const handleSelect = (projectId: string) => {
        popoverRef.current?.close();

        if (projectId === props.project?.id) {
            return;
        }

        updateTask(
            { projectId },
            {
                onSuccess: () => {
                    toast.success(t('TaskDetail.updateProjectSuccess'));
                },
                onError: (err) => {
                    toast.error(getErrorMessage(err, 'TaskDetail.updateProjectError', t));
                },
            }
        );
    };

    const handleCreateProject = (data: ProjectData) => {
        return createProject(data, {
            onSuccess: () => {
                toast.success(t('Task.Modal.createProjectSuccess'));
                setShowCreateProject(false);
            },
            onError: (err) => {
                toast.error(getErrorMessage(err, 'Task.Modal.createProjectError', t));
            },
        });
    };

    return (
        <Popover
            ref={popoverRef}
            onOpenChange={handlePopoverOpenChange}
            trigger={
                props.project ? (
                    <Pill
                        className={styles.TaskDetailProject}
                        color={props.project.color}
                        dot
                    >
                        {props.project.label}
                    </Pill>
                ) : (
                    <div className={styles.TaskDetailProject__noProjectWrapper}>
                        <p>{t('Task.Modal.project')}</p>
                        <Plus width={16} height={16} />
                    </div>
                )
            }
        >
            <div
                className={clsx(
                    styles.TaskDetailProject__list,
                    showCreateProject && styles['TaskDetailProject__list--createActive']
                )}
            >
                {showCreateProject ? (
                    <LabelColorForm
                        schema={ProjectSchema}
                        namePlaceholder={t('Task.Modal.projectName')}
                        onSubmit={handleCreateProject}
                        onClose={handleHideCreateProject}
                    />
                ) : projects.length > 0 ? (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            className={styles.TaskDetailProject__item}
                            onClick={() => handleSelect(project.id)}
                        >
                            <span
                                className={styles.TaskDetailProject__dot}
                                style={{ backgroundColor: project.color }}
                            />
                            <span>{project.label}</span>
                        </div>
                    ))
                ) : (
                    <p className={styles.TaskDetailProject__noProjectsText}>
                        {t('Task.Modal.noProjects')}
                    </p>
                )}
                {!showCreateProject && (
                    <div
                        onClick={handleShowCreateProject}
                        onKeyDown={handleCreateProjectKeyDown}
                        role={'button'}
                        tabIndex={0}
                        className={styles.TaskDetailProject__createProjectWrapper}
                    >
                        <p className={styles.TaskDetailProject__createProjectText}>
                            {t('Task.Modal.createProject')}
                        </p>
                        <Plus width={16} height={16} />
                    </div>
                )}
            </div>
        </Popover>
    );
};
