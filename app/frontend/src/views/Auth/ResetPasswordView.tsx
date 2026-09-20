import { AuthCard } from '@/components/features/Auth/AuthCard/AuthCard';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Link, useNavigate, getRouteApi } from '@tanstack/react-router';
import { useResetPassword } from '@/hooks/api/useAuth';
import type { ResetPasswordData } from '@timedo/shared/src/schemas/authSchema';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { AuthHeaderLogo } from '@/components/features/Auth/AuthHeaderLogo/AuthHeaderLogo';
import { ResetPasswordForm } from '@/components/features/Forms/AuthForm/ResetPasswordForm';
import styles from './AuthStyles.module.scss';

const routeApi = getRouteApi('/reset-password');

export const ResetPasswordView = () => {
    const { t } = useTranslation();
    const { mutate: resetPassword, error, isPending } = useResetPassword();
    const navigate = useNavigate();
    const { token } = routeApi.useSearch();

    const resetSuccessHandler = () => {
        toast.success(t('ResetPassword.success'));
        navigate({ to: '/login', replace: true });
    };

    const resetPasswordHandler = (data: ResetPasswordData) => {
        if (!token) return;

        resetPassword(
            {
                newPassword: data.newPassword,
                token,
            },
            { onSuccess: resetSuccessHandler }
        );
    };

    return (
        <div className={styles.AuthView}>
            <AuthHeaderLogo />
            <div className={styles.AuthView__alignCenter}>
                <div className={styles.AuthView__content}>
                    <AuthCard
                        title={t('ResetPassword.title')}
                        description={t('ResetPassword.description')}
                    />
                    {token ? (
                        <ResetPasswordForm
                            onSubmit={resetPasswordHandler}
                            isLoading={isPending}
                        />
                    ) : (
                        <p className={styles.AuthView__errorMessage}>
                            {t('Validation.tokenRequired')}
                        </p>
                    )}
                    {error && (
                        <p className={styles.AuthView__errorMessage}>
                            {getErrorMessage(error, 'BackendErrors.UNKNOWN_ERROR', t)}
                        </p>
                    )}
                    <Link className={styles.AuthView__link} to={'/login'}>
                        {t('ForgottenPassword.backToLogin')}
                    </Link>
                </div>
            </div>
        </div>
    );
};
