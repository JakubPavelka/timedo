import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import type { LabelColorData } from '@/components/features/Forms/LabelColorForm/LabelColorForm';
import { ColorField } from '@/components/ui/ColorField/ColorField';
import styles from './EditLabelColorModal.module.scss';

type EditLabelColorModalProps = {
    isOpen: boolean;
    schema: ZodType<LabelColorData, LabelColorData>;
    title: string;
    description: string;
    nameLabel: string;
    colorLabel: string;
    defaultValues: LabelColorData;
    onSubmit: (data: LabelColorData) => void;
    onClose: () => void;
};

export const EditLabelColorModal = (props: EditLabelColorModalProps) => {
    const { t } = useTranslation();

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<LabelColorData>({
        resolver: zodResolver(props.schema),
        defaultValues: props.defaultValues,
        mode: 'onSubmit',
    });

    const onSubmitHandler = handleSubmit((data) => props.onSubmit(data));

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <form className={styles.EditLabelColorModal} onSubmit={onSubmitHandler}>
                <p className={styles.EditLabelColorModal__title}>{props.title}</p>
                <p className={styles.EditLabelColorModal__description}>
                    {props.description}
                </p>

                <div className={styles.EditLabelColorModal__field}>
                    <label
                        className={styles.EditLabelColorModal__label}
                        htmlFor={'edit-label-color-modal-input'}
                    >
                        {props.nameLabel}
                    </label>
                    <Controller
                        name={'label'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                id={'edit-label-color-modal-input'}
                                variant={'filled'}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    {errors.label && (
                        <span className={styles.EditLabelColorModal__errorText}>
                            {t(errors.label.message!)}
                        </span>
                    )}
                </div>

                <div className={styles.EditLabelColorModal__field}>
                    <span className={styles.EditLabelColorModal__label}>
                        {props.colorLabel}
                    </span>
                    <Controller
                        name={'color'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <ColorField value={value} onChange={onChange} size={'md'} />
                        )}
                    />
                </div>

                <div className={styles.EditLabelColorModal__divider} />

                <div className={styles.EditLabelColorModal__buttonsWrapper}>
                    <Button variant={'outline'} onClick={props.onClose}>
                        {t('General.cancel')}
                    </Button>
                    <Button type={'submit'}>{t('General.saveChanges')}</Button>
                </div>
            </form>
        </Modal>
    );
};
