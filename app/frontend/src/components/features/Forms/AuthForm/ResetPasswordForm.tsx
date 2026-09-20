import { Input } from '@/components/ui/Input/Input';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ResetPasswordSchema,
    type ResetPasswordData,
} from '@timedo/shared/src/schemas/authSchema';
import { Button } from '@/components/ui/Button/Button';
import { Lock } from 'lucide-react';
import styles from './AuthForm.module.scss';

type ResetPasswordFormProps = {
    onSubmit: (data: ResetPasswordData) => void;
    isLoading?: boolean;
};

const ICON_SIZE = 16;

export const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordData>({
        mode: 'onSubmit',
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            newPassword: '',
            newPasswordAgain: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            {/* PASSWORD INPUT */}
            <div className={styles.AuthForm__inputWrapper}>
                <label htmlFor={'newPassword'} className={styles.AuthForm__inputLabel}>
                    {t('ResetPassword.newPassword')}*
                </label>
                <Controller
                    control={control}
                    name={'newPassword'}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            id={'newPassword'}
                            value={value}
                            onChange={onChange}
                            type={'password'}
                            autoComplete={'new-password'}
                            prefixIcon={<Lock width={ICON_SIZE} height={ICON_SIZE} />}
                        />
                    )}
                />
                {errors.newPassword && (
                    <p className={styles.AuthForm__errorMessage}>
                        {t(errors.newPassword.message!)}
                    </p>
                )}
            </div>

            {/* PASSWORD AGAIN INPUT */}
            <div className={styles.AuthForm__inputWrapper}>
                <label
                    htmlFor={'newPasswordAgain'}
                    className={styles.AuthForm__inputLabel}
                >
                    {t('ResetPassword.newPasswordAgain')}*
                </label>
                <Controller
                    control={control}
                    name={'newPasswordAgain'}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            id={'newPasswordAgain'}
                            value={value}
                            onChange={onChange}
                            type={'password'}
                            autoComplete={'new-password'}
                            prefixIcon={<Lock width={ICON_SIZE} height={ICON_SIZE} />}
                        />
                    )}
                />
                {errors.newPasswordAgain && (
                    <p className={styles.AuthForm__errorMessage}>
                        {t(errors.newPasswordAgain.message!)}
                    </p>
                )}
            </div>

            <div className={styles.AuthForm__submitBtn}>
                <Button type={'submit'} isLoading={props.isLoading} fullWidth>
                    {t('ResetPassword.submit')}
                </Button>
            </div>
        </form>
    );
};
