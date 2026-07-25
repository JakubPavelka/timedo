import { useState } from 'react';
import { Palette } from 'lucide-react';
import clsx from 'clsx';
import { Input } from '@/components/ui/Input/Input';
import { HexColorPicker } from 'react-colorful';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import { Button } from '@/components/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import styles from './LabelColorForm.module.scss';

type LabelColorData = {
    label: string;
    color: string;
};

type LabelColorFormProps = {
    schema: ZodType<LabelColorData, LabelColorData>;
    namePlaceholder: string;
    onSubmit: (data: LabelColorData) => void;
    onClose: () => void;
};

type ColorFieldProps = {
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

const ColorField = (props: ColorFieldProps) => {
    const { t } = useTranslation();
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const handleSelectPreset = (presetColor: string) => {
        setShowCustomPicker(false);
        props.onChange(presetColor);
    };

    const handleShowCustomPicker = () => setShowCustomPicker(true);

    return (
        <div>
            <span className={styles.LabelColorForm__colorLabel}>
                {t('Task.Modal.selectColor')}
            </span>
            <div className={styles.LabelColorForm__colorRow}>
                {PRESET_COLORS.map((presetColor) => (
                    <button
                        key={presetColor}
                        type={'button'}
                        aria-label={presetColor}
                        aria-pressed={!showCustomPicker && props.value === presetColor}
                        className={clsx(
                            styles.LabelColorForm__colorSwatch,
                            !showCustomPicker &&
                                props.value === presetColor &&
                                styles['LabelColorForm__colorSwatch--selected']
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
                        styles.LabelColorForm__colorSwatch,
                        styles.LabelColorForm__customColorButton,
                        showCustomPicker &&
                            styles['LabelColorForm__colorSwatch--selected']
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
                    className={styles.LabelColorForm__colorPicker}
                />
            )}
        </div>
    );
};

export const LabelColorForm = (props: LabelColorFormProps) => {
    const { t } = useTranslation();

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<LabelColorData>({
        resolver: zodResolver(props.schema),
        defaultValues: { color: PRESET_COLORS[0], label: '' },
        mode: 'onSubmit',
    });

    const onSubmitHandler = handleSubmit((data) => props.onSubmit(data));

    return (
        <div className={styles.LabelColorForm}>
            <div>
                <Controller
                    name={'label'}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            id={'label-color-form-input'}
                            className={styles.LabelColorForm__input}
                            value={value}
                            onChange={onChange}
                            placeholder={props.namePlaceholder}
                        />
                    )}
                />
                {errors.label && (
                    <span className={styles.LabelColorForm__errorText}>
                        {t(errors.label.message!)}
                    </span>
                )}
            </div>

            <Controller
                name={'color'}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <ColorField value={value} onChange={onChange} />
                )}
            />

            <div className={styles.LabelColorForm__buttonsWrapper}>
                <Button
                    className={styles.LabelColorForm__button}
                    variant={'outline'}
                    onClick={props.onClose}
                >
                    {t('General.cancel')}
                </Button>
                <Button
                    className={styles.LabelColorForm__button}
                    onClick={onSubmitHandler}
                >
                    {t('General.create')}
                </Button>
            </div>
        </div>
    );
};
