import { AuthCard } from '@/components/features/Auth/AuthCard/AuthCard';
import { useTranslation, Trans } from 'react-i18next';
import { Link, useNavigate } from '@tanstack/react-router';
import { useLogin } from '@/hooks/api/useAuth';
import type { LoginData } from '@timedo/shared/src/schemas/authSchema';
import { ApiError } from '@/api/ApiError';
import { AuthRightSide } from '@/components/features/Auth/AuthRightSide/AuthRightSide';
import { AuthHeaderLogo } from '@/components/features/Auth/AuthHeaderLogo/AuthHeaderLogo';
import { LoginForm } from '@/components/features/Forms/AuthForm/LoginForm';
import styles from './AuthStyles.module.scss';

export const LoginView = () => {
    const { t } = useTranslation();
    const { mutate: login, error, isPending } = useLogin();
    const navigate = useNavigate();

    const loginHandler = (data: LoginData) => {
        login(
            {
                email: data.email,
                password: data.password,
            },
            { onSuccess: () => navigate({ to: '/dashboard', replace: true }) }
        );
    };

    return (
        <div className={styles.AuthView}>
            {/* LEFT SIDE */}
            <div className={styles.AuthView__leftSide}>
                <AuthHeaderLogo />
                <div className={styles.AuthView__alignCenter}>
                    <div className={styles.AuthView__leftContent}>
                        <AuthCard />
                        <LoginForm
                            onSubmit={loginHandler}
                            isLoading={isPending}
                        />
                        {error && (
                            <p className={styles.AuthView__errorMessage}>
                                {error instanceof ApiError
                                    ? t(`BackendErrors.${error.code}`)
                                    : error.message}
                            </p>
                        )}
                        <p className={styles.AuthView__alreadyHaveAccount}>
                            <Trans
                                i18nKey="LoginForm.dontHaveAccount"
                                components={{
                                    link1: <Link to="/register" />,
                                }}
                            />
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className={styles.AuthView__rightSide}>
                <AuthRightSide />
            </div>
        </div>
    );
};
