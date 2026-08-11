import { Popover, type PopoverHandle } from '@/components/ui/Popover/Popover';
import { Pill } from '@/components/ui/Pill/Pill';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateTask } from '@/hooks/api/useTask';
import { useProjectStore } from '@/store/projectStore';
import { toast } from 'sonner';
import { ApiError } from '@/api/ApiError';
import styles from './TaskDetailProject.module.scss';

type TaskDetailProjectProps = {
    project: {
        id: string;
        label: string;
        color: string;
    };
    taskId: string;
};

export const TaskDetailProject = (props: TaskDetailProjectProps) => {
    const { t } = useTranslation();
    const { mutate: updateTask } = useUpdateTask(props.taskId);
    const projects = useProjectStore((s) => s.projects);
    const popoverRef = useRef<PopoverHandle>(null);

    const handleSelect = (projectId: string) => {
        popoverRef.current?.close();

        if (projectId === props.project.id) {
            return;
        }

        updateTask(
            { projectId },
            {
                onSuccess: () => {
                    toast.success(t('TaskDetail.updateProjectSuccess'));
                },
                onError: (err) => {
                    toast.error(
                        err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                            ? t(`BackendErrors.${err.code}`)
                            : t('TaskDetail.updateProjectError')
                    );
                },
            }
        );
    };

    return (
        <Popover
            ref={popoverRef}
            trigger={
                <Pill
                    className={styles.TaskDetailProject}
                    color={props.project.color}
                    dot
                >
                    {props.project.label}
                </Pill>
            }
        >
            <div className={styles.TaskDetailProject__list}>
                {projects.map((project) => (
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
                ))}
            </div>
        </Popover>
    );
};
