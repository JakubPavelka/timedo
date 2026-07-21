import { useState } from 'react';
import { Palette } from 'lucide-react';
import clsx from 'clsx';
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

type ProjectColorFieldProps = {
    value: string;
    onChange: (color: string) => void;
};

const PRESET_COLORS = [
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#84CC16',
    '#10B981',
    '#06B6D4',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#6B7280',
];

const ProjectColorField = (props: ProjectColorFieldProps) => {
    const { t } = useTranslation();
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const handleSelectPreset = (presetColor: string) => {
        setShowCustomPicker(false);
        props.onChange(presetColor);
    };

    const handleShowCustomPicker = () => setShowCustomPicker(true);

    return (
        <div>
            <span className={styles.NewProjectForm__colorLabel}>
                {t('Task.Modal.selectColor')}
            </span>
            <div className={styles.NewProjectForm__colorRow}>
                {PRESET_COLORS.map((presetColor) => (
                    <button
                        key={presetColor}
                        type={'button'}
                        aria-label={presetColor}
                        aria-pressed={
                            !showCustomPicker && props.value === presetColor
                        }
                        className={clsx(
                            styles.NewProjectForm__colorSwatch,
                            !showCustomPicker &&
                                props.value === presetColor &&
                                styles['NewProjectForm__colorSwatch--selected']
                        )}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => handleSelectPreset(presetColor)}
                    />
                ))}
                <button
                    type={'button'}
                    aria-label={t('Task.Modal.customColor')}
                    aria-pressed={showCustomPicker}
                    className={clsx(
                        styles.NewProjectForm__colorSwatch,
                        styles.NewProjectForm__customColorButton,
                        showCustomPicker &&
                            styles['NewProjectForm__colorSwatch--selected']
                    )}
                    onClick={handleShowCustomPicker}
                >
                    <Palette width={14} height={14} />
                </button>
            </div>
            {showCustomPicker && (
                <HexColorPicker
                    color={props.value}
                    onChange={props.onChange}
                    className={styles.NewProjectForm__colorPicker}
                />
            )}
        </div>
    );
};

export const NewProjectForm = (props: NewProjectFormProps) => {
    const { t } = useTranslation();

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<ProjectData>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: { color: PRESET_COLORS[0], label: '' },
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
                    <ProjectColorField value={value} onChange={onChange} />
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
