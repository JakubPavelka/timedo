import { ProgressCard } from '@/components/ui/ProgressCard/ProgressCard';
import {
    useCreateProject,
    useDeleteProject,
    useGetProjectsWithTasks,
    useUpdateProject,
} from '@/hooks/api/useProject';
import { AddCard } from '@/components/ui/AddCard/AddCard';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal/ConfirmModal';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { LabelColorModal } from '@/components/ui/Modal/LabelColorModal/LabelColorModal';
import {
    ProjectSchema,
    type ProjectData,
} from '@timedo/shared/src/schemas/projectSchema';
import type { ProjectWithTasks } from '@/api/project/project.api';
import { PRESET_COLORS } from '@/data/labelColorData';
import styles from './ProjectsView.module.scss';

export const ProjectsView = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    const [editingProject, setEditingProject] = useState<ProjectWithTasks | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { data: projects } = useGetProjectsWithTasks();
    const { mutate: deleteProject } = useDeleteProject();
    const { mutate: updateProject } = useUpdateProject();
    const { mutate: createProject } = useCreateProject();

    const handleShowEditModal = (project: ProjectWithTasks) => setEditingProject(project);
    const handleHideEditModal = () => setEditingProject(null);
    const handleShowDeleteModal = (projectId: string) => setDeletingProjectId(projectId);
    const handleHideDeleteModal = () => setDeletingProjectId(null);
    const handleShowCreateModal = () => setShowCreateModal(true);
    const handleHideCreateModal = () => setShowCreateModal(false);
    const handleProjectClick = (projectId: string) =>
        navigate({ to: '/dashboard/tasks', search: { project: projectId } });

    const handleProjectDelete = () => {
        if (!deletingProjectId) {
            return;
        }

        deleteProject(deletingProjectId, {
            onSuccess: () => {
                toast.success(t('Projects.DeleteModal.success'));
                handleHideDeleteModal();
            },
            onError: (err) =>
                toast.error(getErrorMessage(err, 'Projects.DeleteModal.error', t)),
        });
    };

    const handleProjectUpdate = (data: ProjectData) => {
        if (!editingProject) {
            return;
        }

        updateProject(
            { ...data, id: editingProject.id },
            {
                onSuccess: () => {
                    toast.success(t('Projects.EditModal.success'));
                    handleHideEditModal();
                },
                onError: (err) =>
                    toast.error(getErrorMessage(err, 'Projects.EditModal.error', t)),
            }
        );
    };

    const handleProjectCreate = (data: ProjectData) => {
        createProject(data, {
            onSuccess: () => {
                toast.success(t('Projects.CreateModal.success'));
                handleHideCreateModal();
            },
            onError: (err) =>
                toast.error(getErrorMessage(err, 'Projects.CreateModal.error', t)),
        });
    };

    return (
        <>
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
                            onDelete={() => handleShowDeleteModal(project.id)}
                            onEdit={() => handleShowEditModal(project)}
                            onClick={() => handleProjectClick(project.id)}
                        />
                    ))}
                    <AddCard
                        text={t('Projects.newProject')}
                        onClick={handleShowCreateModal}
                    />
                </div>
            </div>
            {!!deletingProjectId && (
                <ConfirmModal
                    isOpen={!!deletingProjectId}
                    onClose={handleHideDeleteModal}
                    title={t('Projects.DeleteModal.title')}
                    description={t('Projects.DeleteModal.description')}
                    confirmText={t('General.delete')}
                    onConfirm={handleProjectDelete}
                    variant={'danger'}
                    confirmIcon={<Trash width={16} height={16} />}
                    icon={
                        <Trash
                            className={styles.ProjectsView__deleteIcon}
                            width={18}
                            height={18}
                        />
                    }
                />
            )}
            {!!editingProject && (
                <LabelColorModal
                    isOpen={!!editingProject}
                    onClose={handleHideEditModal}
                    onSubmit={handleProjectUpdate}
                    schema={ProjectSchema}
                    title={t('Projects.EditModal.title')}
                    description={t('Projects.EditModal.description')}
                    nameLabel={t('Projects.CreateModal.name')}
                    colorLabel={t('Projects.CreateModal.color')}
                    defaultValues={{
                        label: editingProject.label,
                        color: editingProject.color,
                    }}
                />
            )}
            {showCreateModal && (
                <LabelColorModal
                    isOpen={showCreateModal}
                    onClose={handleHideCreateModal}
                    onSubmit={handleProjectCreate}
                    schema={ProjectSchema}
                    title={t('Projects.CreateModal.title')}
                    description={t('Projects.CreateModal.description')}
                    nameLabel={t('Projects.CreateModal.name')}
                    colorLabel={t('Projects.CreateModal.color')}
                    defaultValues={{ label: '', color: PRESET_COLORS[0] }}
                    creating
                />
            )}
        </>
    );
};
