import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Controller, useForm } from 'react-hook-form';
import { TaskSchema, type TaskData } from '@timedo/shared/src/schemas/taskSchema';
import type { ProjectData } from '@timedo/shared/src/schemas/projectSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { Select, type SelectOption } from '@/components/ui/Select/Select';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
import { useState } from 'react';
import { LabelColorForm } from '../../Forms/LabelColorForm/LabelColorForm';
import { ProjectSchema } from '@timedo/shared/src/schemas/projectSchema';
import { TagSchema, type TagData } from '@timedo/shared/src/schemas/tagsSchema';
import { useCreateProject } from '@/hooks/api/useProject';
import { useCreateTag } from '@/hooks/api/useTag';
import { toast } from 'sonner';
import { ApiError } from '@/api/ApiError';
import { useProjectStore } from '@/store/projectStore';
import { useTagStore } from '@/store/tagStore';
import clsx from 'clsx';
import styles from './NewTaskModal.module.scss';

type NewTaskModalProps = {
    onSubmit: (data: TaskData) => void;
    onClose: () => void;
};

const PRIORITY = [
    {
        label: 'Task.Priority.lowPriority',
        value: 'LOW',
        icon: <PriorityIcon level={'LOW'} />,
    },
    {
        label: 'Task.Priority.mediumPriority',
        value: 'MEDIUM',
        icon: <PriorityIcon level={'MEDIUM'} />,
    },
    {
        label: 'Task.Priority.highPriority',
        value: 'HIGH',
        icon: <PriorityIcon level={'HIGH'} />,
    },
];

export const NewTaskModal = (props: NewTaskModalProps) => {
    const { t } = useTranslation();
    const { mutate: createProject } = useCreateProject();
    const { mutate: createTag } = useCreateTag();
    const [showProjectCreateForm, setShowProjectCreateForm] = useState(false);
    const [showTagCreateForm, setShowTagCreateForm] = useState(false);
    const projects = useProjectStore((s) => s.projects);
    const tags = useTagStore((s) => s.tags);
    const projectOptions: SelectOption[] = projects.map((project) => ({
        value: project.id,
        label: project.label,
        color: project.color,
    }));
    const tagOptions: SelectOption[] = tags.map((tag) => ({
        value: tag.id,
        label: tag.label,
        color: tag.color,
    }));
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskData>({
        resolver: zodResolver(TaskSchema),
        reValidateMode: 'onSubmit',
        defaultValues: {
            title: '',
            description: '',
            priority: 'LOW',
        },
    });

    const handleShowProjectCreateForm = () => setShowProjectCreateForm(true);
    const handleHideProjectCreateForm = () => setShowProjectCreateForm(false);
    const handleShowTagCreateForm = () => setShowTagCreateForm(true);
    const handleHideTagCreateForm = () => setShowTagCreateForm(false);

    const handleOnSubmit = handleSubmit((data) => props.onSubmit(data));
    const handleCreateProject = (data: ProjectData) => {
        return createProject(data, {
            onSuccess: () => {
                toast.success(t('Task.Modal.createSuccess'));
                setShowProjectCreateForm(false);
            },
            onError: (err) => {
                toast.error(
                    err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                        ? t(`BackendErrors.${err.code}`)
                        : t('Task.Modal.createProjectError')
                );
            },
        });
    };

    const handleCreateTag = (data: TagData) => {
        return createTag(data, {
            onSuccess: () => {
                toast.success(t('Task.Modal.createSuccess'));
                setShowTagCreateForm(false);
            },
            onError: (err) => {
                toast.error(
                    err instanceof ApiError && err.code !== 'UNKNOWN_ERROR'
                        ? t(`BackendErrors.${err.code}`)
                        : t('Task.Modal.createTagError')
                );
            },
        });
    };

    return (
        <form className={styles.NewTaskModal} onSubmit={handleOnSubmit}>
            <p className={styles.NewTaskModal__title}>{t('Task.newTask')}</p>
            <div className={styles.NewTaskModal__inputsWrapper}>
                {/* TITLE */}
                <div>
                    <Controller
                        name={'title'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <div className={styles.NewTaskModal__labelWrapper}>
                                <label
                                    className={styles.NewTaskModal__labelText}
                                    htmlFor={'task-name'}
                                >
                                    {t('Task.Modal.taskName')}
                                </label>
                                <Input
                                    id={'task-name'}
                                    value={value}
                                    onChange={onChange}
                                    variant={'filled'}
                                    placeholder={t('Task.Modal.taskNamePlaceholder')}
                                />
                            </div>
                        )}
                    />
                    {errors.title && (
                        <p className={styles.NewTaskModal__errorText}>
                            {t(errors.title.message!)}
                        </p>
                    )}
                </div>

                {/* DESCRIPTION */}
                <div>
                    <Controller
                        name={'description'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <div className={styles.NewTaskModal__labelWrapper}>
                                <label
                                    className={styles.NewTaskModal__labelText}
                                    htmlFor={'task-description'}
                                >
                                    {t('Task.Modal.description')}
                                </label>
                                <Textarea
                                    id={'task-description'}
                                    value={value}
                                    onChange={onChange}
                                    variant={'filled'}
                                    placeholder={t('Task.Modal.descriptionPlaceholder')}
                                />
                            </div>
                        )}
                    />
                    {errors.description && (
                        <p className={styles.NewTaskModal__errorText}>
                            {t(errors.description.message!)}
                        </p>
                    )}
                </div>

                {/* PROJECT */}
                <div className={styles.NewTaskModal__halfInputWrapper}>
                    <Controller
                        name={'projectId'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <div
                                className={clsx(
                                    styles.NewTaskModal__labelWrapper,
                                    styles.NewTaskModal__halfInput
                                )}
                            >
                                <label
                                    className={styles.NewTaskModal__labelText}
                                    htmlFor={'project-select'}
                                >
                                    {t('Task.Modal.project')}
                                </label>
                                <Select
                                    id={'project-select'}
                                    options={projectOptions}
                                    value={value ?? undefined}
                                    onChange={onChange}
                                    onClear={() => onChange(null)}
                                    placeholder={t('Task.Modal.projectPlaceholder')}
                                    footer={
                                        <div
                                            className={
                                                styles.NewTaskModal__emptyOptionWrapper
                                            }
                                        >
                                            {showProjectCreateForm ? (
                                                <LabelColorForm
                                                    schema={ProjectSchema}
                                                    namePlaceholder={t(
                                                        'Task.Modal.projectName'
                                                    )}
                                                    onSubmit={handleCreateProject}
                                                    onClose={handleHideProjectCreateForm}
                                                />
                                            ) : (
                                                <>
                                                    <span
                                                        className={
                                                            styles.NewTaskModal__emptyOption
                                                        }
                                                    >
                                                        {t(
                                                            projects.length === 0
                                                                ? 'Task.Modal.noProjects'
                                                                : 'Task.Modal.createProject'
                                                        )}
                                                    </span>
                                                    <Plus
                                                        width={16}
                                                        height={16}
                                                        onClick={
                                                            handleShowProjectCreateForm
                                                        }
                                                    />
                                                </>
                                            )}
                                        </div>
                                    }
                                />
                            </div>
                        )}
                    />

                    {/* PRIORITY */}
                    <Controller
                        name={'priority'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <div
                                className={clsx(
                                    styles.NewTaskModal__labelWrapper,
                                    styles.NewTaskModal__halfInput
                                )}
                            >
                                <label
                                    className={styles.NewTaskModal__labelText}
                                    htmlFor={'priority-select'}
                                >
                                    {t('Task.Modal.priority')}
                                </label>
                                <Select
                                    id={'priority-select'}
                                    options={PRIORITY}
                                    value={value}
                                    onChange={onChange}
                                    placeholder={t('Task.Modal.priorityPlaceholder')}
                                    translatedLabel
                                />
                            </div>
                        )}
                    />
                </div>

                {/* TAGS */}
                <div>
                    <Controller
                        name={'tags'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <div className={styles.NewTaskModal__labelWrapper}>
                                <label
                                    className={styles.NewTaskModal__labelText}
                                    htmlFor={'tag-select'}
                                >
                                    {t('Task.Modal.tags')}
                                </label>
                                <Select
                                    multiple
                                    id={'tag-select'}
                                    options={tagOptions}
                                    value={value}
                                    onChange={onChange}
                                    placeholder={t('Task.Modal.tagsPlaceholder')}
                                    footer={
                                        <div
                                            className={
                                                styles.NewTaskModal__emptyOptionWrapper
                                            }
                                        >
                                            {showTagCreateForm ? (
                                                <LabelColorForm
                                                    schema={TagSchema}
                                                    namePlaceholder={t(
                                                        'Task.Modal.tagName'
                                                    )}
                                                    onSubmit={handleCreateTag}
                                                    onClose={handleHideTagCreateForm}
                                                />
                                            ) : (
                                                <>
                                                    <span
                                                        className={
                                                            styles.NewTaskModal__emptyOption
                                                        }
                                                    >
                                                        {t(
                                                            tags.length === 0
                                                                ? 'Task.Modal.noTags'
                                                                : 'Task.Modal.createTag'
                                                        )}
                                                    </span>
                                                    <Plus
                                                        width={16}
                                                        height={16}
                                                        onClick={handleShowTagCreateForm}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    }
                                />
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* BUTTONS */}
            <div className={styles.NewTaskModal__buttonsWrapper}>
                <Button onClick={props.onClose} variant={'outline'}>
                    <span>{t('General.cancel')}</span>
                </Button>
                <Button type={'submit'}>
                    <span className={styles.NewTaskModal__buttonText}>
                        <Plus width={16} height={16} />
                        <span>{t('Task.Modal.createTask')}</span>
                    </span>
                </Button>
            </div>
        </form>
    );
};
