import { Input } from '@/components/ui/Input/Input';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@timedo/shared/src/schemas/authSchema';
import type { LoginData } from '@timedo/shared/src/schemas/authSchema';
import { Button } from '@/components/ui/Button/Button';
import { Lock, Mail } from 'lucide-react';
import styles from './AuthForm.module.scss';

type LoginFormProps = {
    onSubmit: (data: LoginData) => void;
    isLoading?: boolean;
};

const ICON_SIZE = 16;

export const LoginForm = (props: LoginFormProps) => {
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        mode: 'onSubmit',
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            {/* EMAIL INPUT */}
            <div className={styles.AuthForm__inputWrapper}>
                <label
                    htmlFor={'email'}
                    className={styles.AuthForm__inputLabel}
                >
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
                            prefixIcon={
                                <Mail width={ICON_SIZE} height={ICON_SIZE} />
                            }
                        />
                    )}
                />
                {errors.email && (
                    <p className={styles.AuthForm__errorMessage}>
                        {t(errors.email.message!)}
                    </p>
                )}
            </div>

            {/* PASSWORD INPUT */}
            <div className={styles.AuthForm__inputWrapper}>
                <label
                    htmlFor={'password'}
                    className={styles.AuthForm__inputLabel}
                >
                    {t('RegisterForm.password')}*
                </label>
                <Controller
                    control={control}
                    name={'password'}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            id={'password'}
                            value={value}
                            onChange={onChange}
                            type={'password'}
                            prefixIcon={
                                <Lock width={ICON_SIZE} height={ICON_SIZE} />
                            }
                        />
                    )}
                />
                {errors.password && (
                    <p className={styles.AuthForm__errorMessage}>
                        {t(errors.password.message!)}
                    </p>
                )}
            </div>

            <div className={styles.AuthForm__submitBtn}>
                <Button
                    type={'submit'}
                    haveRightArrow
                    isLoading={props.isLoading}
                >
                    {t('LoginForm.login')}
                </Button>
            </div>
        </form>
    );
};
