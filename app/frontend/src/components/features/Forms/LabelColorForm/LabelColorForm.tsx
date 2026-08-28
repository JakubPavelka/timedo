import { Input } from '@/components/ui/Input/Input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import { Button } from '@/components/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { PRESET_COLORS } from '@/data/labelColorData';
import { ColorField } from '@/components/ui/ColorField/ColorField';
import styles from './LabelColorForm.module.scss';

export type LabelColorData = {
    label: string;
    color: string;
};

type LabelColorFormProps = {
    schema: ZodType<LabelColorData, LabelColorData>;
    namePlaceholder: string;
    onSubmit: (data: LabelColorData) => void;
    onClose: () => void;
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
                    <div>
                        <span className={styles.LabelColorForm__colorLabel}>
                            {t('Task.Modal.selectColor')}
                        </span>
                        <ColorField value={value} onChange={onChange} />
                    </div>
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
