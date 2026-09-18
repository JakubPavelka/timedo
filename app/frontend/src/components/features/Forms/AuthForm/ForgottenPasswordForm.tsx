import { Input } from '@/components/ui/Input/Input';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordSchema } from '@timedo/shared/src/schemas/authSchema';
import type { ForgotPasswordData } from '@timedo/shared/src/schemas/authSchema';
import { Button } from '@/components/ui/Button/Button';
import { Mail } from 'lucide-react';
import styles from './AuthForm.module.scss';

type ForgottenPasswordFormProps = {
    onSubmit: (data: ForgotPasswordData) => void;
    isLoading?: boolean;
};

const ICON_SIZE = 16;

export const ForgottenPasswordForm = (props: ForgottenPasswordFormProps) => {
    const { t, i18n } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordData>({
        mode: 'onSubmit',
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: '',
            lang: i18n.language as ForgotPasswordData['lang'],
        },
    });

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <div className={styles.AuthForm__inputWrapper}>
                <label htmlFor={'email'} className={styles.AuthForm__inputLabel}>
                    {t('RegisterForm.email')}*
                </label>
                <Controller
                    control={control}
                    name={'email'}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            id={'email'}
                            value={value}
                            onChange={onChange}
                            type={'email'}
                            prefixIcon={<Mail width={ICON_SIZE} height={ICON_SIZE} />}
                        />
                    )}
                />
                {errors.email && (
                    <p className={styles.AuthForm__errorMessage}>
                        {t(errors.email.message!)}
                    </p>
                )}
            </div>

            <div className={styles.AuthForm__submitBtn}>
                <Button type={'submit'} isLoading={props.isLoading} fullWidth>
                    {t('ForgottenPassword.sendLink')}
                </Button>
            </div>
        </form>
    );
};
