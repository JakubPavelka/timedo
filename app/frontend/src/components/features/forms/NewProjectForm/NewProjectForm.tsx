import { Input } from '@/components/ui/Input/Input';
import { HexColorPicker } from 'react-colorful';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ProjectSchema,
    type ProjectData,
} from '@timedo/shared/src/schemas/projectSchema';
import { Button } from '@/components/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import styles from './NewProjectForm.module.scss';

type NewProjectFormProps = {
    onSubmit: (data: ProjectData) => void;
    onClose: () => void;
};

export const NewProjectForm = (props: NewProjectFormProps) => {
    const { t } = useTranslation();

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<ProjectData>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: { color: '#aabbcc', label: '' },
        mode: 'onSubmit',
    });

    const onSubmitHandler = handleSubmit((data) => props.onSubmit(data));

    return (
        <div className={styles.NewProjectForm}>
            <div>
                <Controller
                    name={'label'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            id={'project-input'}
                            className={styles.NewProjectForm__input}
                            value={value}
                            onChange={onChange}
                            placeholder={t('Task.Modal.projectName')}
                        />
                    )}
                />
                {errors.label && (
                    <span className={styles.NewProjectForm__errorText}>
                        {t(errors.label.message!)}
                    </span>
                )}
            </div>

            <Controller
                name={'color'}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <HexColorPicker
                        color={value}
                        onChange={onChange}
                        className={styles.NewProjectForm__colorPicker}
                    />
                )}
            />

            <div className={styles.NewProjectForm__buttonsWrapper}>
                <Button
                    className={styles.NewProjectForm__button}
                    variant={'outline'}
                    onClick={props.onClose}
                >
                    {t('General.cancel')}
                </Button>
                <Button
                    className={styles.NewProjectForm__button}
                    onClick={onSubmitHandler}
                >
                    {t('General.create')}
                </Button>
            </div>
        </div>
    );
};
