import { AuthCard } from '@/components/features/Auth/AuthCard/AuthCard';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { useForgottenPassword } from '@/hooks/api/useAuth';
import type { ForgotPasswordData } from '@timedo/shared/src/schemas/authSchema';
import { ApiError } from '@/api/ApiError';
import { AuthHeaderLogo } from '@/components/features/Auth/AuthHeaderLogo/AuthHeaderLogo';
import { ForgottenPasswordForm } from '@/components/features/Forms/AuthForm/ForgottenPasswordForm';
import { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { useRouter } from '@tanstack/react-router';
import styles from './AuthStyles.module.scss';

export const ForgottenPasswordView = () => {
    const { t, i18n } = useTranslation();
    const [showSuccessView, setShowSuccessView] = useState(false);
    const { mutate: forgottenPassword, error, isPending } = useForgottenPassword();
    const router = useRouter();

    const forgottenPasswordHandler = (data: ForgotPasswordData) => {
        forgottenPassword(
            {
                email: data.email,
                lang: i18n.language as ForgotPasswordData['lang'],
            },
            {
                onSuccess: () => setShowSuccessView(true),
            }
        );
    };

    const resendTextClickHandler = () => setShowSuccessView(false);
    const handleGoToLogin = () => router.navigate({ to: '/login', replace: true });

    return (
        <div className={styles.AuthView}>
            <AuthHeaderLogo />
            <div className={styles.AuthView__alignCenter}>
                <div className={styles.AuthView__content}>
                    {!showSuccessView ? (
                        <>
                            <AuthCard
                                title={t('ForgottenPassword.title')}
                                description={t('ForgottenPassword.description')}
                            />
                            <ForgottenPasswordForm
                                onSubmit={forgottenPasswordHandler}
                                isLoading={isPending}
                            />
                            {error && (
                                <p className={styles.AuthView__errorMessage}>
                                    {error instanceof ApiError
                                        ? t(`BackendErrors.${error.code}`)
                                        : error.message}
                                </p>
                            )}
                            <Link className={styles.AuthView__link} to={'/login'}>
                                {t('ForgottenPassword.backToLogin')}
                            </Link>
                        </>
                    ) : (
                        <>
                            <h1 className={styles.AuthView__forgottenPasswordTitle}>
                                {t('ForgottenPassword.checkEmailTitle')}
                            </h1>
                            <p className={styles.AuthView__forgottenPasswordText}>
                                {t('ForgottenPassword.checkEmailDescription')}
                            </p>
                            <Button
                                variant={'primary'}
                                onClick={handleGoToLogin}
                                fullWidth
                            >
                                {t('ForgottenPassword.backToLogin')}
                            </Button>
                            <p className={styles.AuthView__alreadyHaveAccount}>
                                <Trans
                                    i18nKey={'ForgottenPassword.noEmailReceived'}
                                    components={{
                                        resend: (
                                            <span
                                                className={styles.AuthView__resendText}
                                                onClick={resendTextClickHandler}
                                            />
                                        ),
                                    }}
                                />
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
