import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Controller, useForm } from 'react-hook-form';
import {
    TaskSchema,
    type TaskData,
} from '@timedo/shared/src/schemas/taskSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { Select } from '@/components/ui/Select/Select';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { PriorityIcon } from '@/components/ui/PriorityIcon/PriorityIcon';
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

    const onSubmitHandler = handleSubmit((data) => props.onSubmit(data));

    return (
        <form className={styles.NewTaskModal} onSubmit={onSubmitHandler}>
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
                                    placeholder={t(
                                        'Task.Modal.taskNamePlaceholder'
                                    )}
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
                                    placeholder={t(
                                        'Task.Modal.descriptionPlaceholder'
                                    )}
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
                                    options={[]}
                                    value={value}
                                    onChange={onChange}
                                    placeholder={t(
                                        'Task.Modal.projectPlaceholder'
                                    )}
                                    emptyOptions={
                                        <div
                                            className={
                                                styles.NewTaskModal__emptyOptionWrapper
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.NewTaskModal__emptyOption
                                                }
                                            >
                                                {t('Task.Modal.noProjects')}
                                            </span>
                                            <Plus width={16} height={16} />
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
                                    placeholder={t(
                                        'Task.Modal.priorityPlaceholder'
                                    )}
                                    translatedLabel
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
                <Button onClick={onSubmitHandler}>
                    <span className={styles.NewTaskModal__buttonText}>
                        <Plus width={16} height={16} />
                        <span>{t('Task.Modal.createTask')}</span>
                    </span>
                </Button>
            </div>
        </form>
    );
};
