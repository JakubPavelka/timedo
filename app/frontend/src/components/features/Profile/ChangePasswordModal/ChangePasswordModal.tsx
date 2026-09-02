import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal/Modal';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import {
    ChangePasswordSchema,
    type ChangePasswordData,
} from '@timedo/shared/src/schemas/authSchema';
import { useChangePassword } from '@/hooks/api/useAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { ApiError } from '@/api/ApiError';
import styles from './ChangePasswordModal.module.scss';

type ChangePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const ICON_SIZE = 16;

export const ChangePasswordModal = (props: ChangePasswordModalProps) => {
    const { t } = useTranslation();
    const { mutate: changePassword, isPending } = useChangePassword();

    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<ChangePasswordData>({
        mode: 'onSubmit',
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            newPasswordAgain: '',
        },
    });

    useEffect(() => {
        if (!props.isOpen) {
            reset();
        }
    }, [props.isOpen, reset]);

    const onSubmitHandler = handleSubmit((data) => {
        changePassword(data, {
            onSuccess: () => {
                toast.success(t('Profile.Security.changePasswordSuccess'));
                props.onClose();
            },
            onError: (err) => {
                if (err instanceof ApiError && err.code === 'INCORRECT_PASSWORD') {
                    setError('currentPassword', {
                        message: 'BackendErrors.INCORRECT_PASSWORD',
                    });
                    return;
                }
                toast.error(
                    getErrorMessage(err, 'Profile.Security.changePasswordError', t)
                );
            },
        });
    });

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <form className={styles.ChangePasswordModal} onSubmit={onSubmitHandler}>
                <p className={styles.ChangePasswordModal__title}>
                    {t('Profile.Security.changePasswordModalTitle')}
                </p>
                <p className={styles.ChangePasswordModal__description}>
                    {t('Profile.Security.changePasswordModalDescription')}
                </p>

                <div className={styles.ChangePasswordModal__field}>
                    <label
                        className={styles.ChangePasswordModal__label}
                        htmlFor={'currentPassword'}
                    >
                        {t('Profile.Security.currentPassword')}
                    </label>
                    <Controller
                        name={'currentPassword'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                id={'currentPassword'}
                                type={'password'}
                                value={value}
                                onChange={onChange}
                                autoComplete={'current-password'}
                                prefixIcon={<Lock width={ICON_SIZE} height={ICON_SIZE} />}
                            />
                        )}
                    />
                    {errors.currentPassword && (
                        <span className={styles.ChangePasswordModal__errorText}>
                            {t(errors.currentPassword.message!)}
                        </span>
                    )}
                </div>

                <div className={styles.ChangePasswordModal__field}>
                    <label
                        className={styles.ChangePasswordModal__label}
                        htmlFor={'newPassword'}
                    >
                        {t('Profile.Security.newPassword')}
                    </label>
                    <Controller
                        name={'newPassword'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                id={'newPassword'}
                                type={'password'}
                                value={value}
                                onChange={onChange}
                                autoComplete={'new-password'}
                                prefixIcon={<Lock width={ICON_SIZE} height={ICON_SIZE} />}
                            />
                        )}
                    />
                    {errors.newPassword && (
                        <span className={styles.ChangePasswordModal__errorText}>
                            {t(errors.newPassword.message!)}
                        </span>
                    )}
                </div>

                <div className={styles.ChangePasswordModal__field}>
                    <label
                        className={styles.ChangePasswordModal__label}
                        htmlFor={'newPasswordAgain'}
                    >
                        {t('Profile.Security.newPasswordAgain')}
                    </label>
                    <Controller
                        name={'newPasswordAgain'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                id={'newPasswordAgain'}
                                type={'password'}
                                value={value}
                                onChange={onChange}
                                autoComplete={'new-password'}
                                prefixIcon={<Lock width={ICON_SIZE} height={ICON_SIZE} />}
                            />
                        )}
                    />
                    {errors.newPasswordAgain && (
                        <span className={styles.ChangePasswordModal__errorText}>
                            {t(errors.newPasswordAgain.message!)}
                        </span>
                    )}
                </div>

                <div className={styles.ChangePasswordModal__divider} />

                <div className={styles.ChangePasswordModal__buttonsWrapper}>
                    <Button variant={'outline'} onClick={props.onClose} type={'button'}>
                        {t('General.cancel')}
                    </Button>
                    <Button type={'submit'} isLoading={isPending}>
                        {t('General.change')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
