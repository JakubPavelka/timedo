import { RegisterForm } from "@/components/features/forms/AuthForm/RegisterForm";
import { AuthCard } from "@/components/features/Auth/AuthCard/AuthCard";
import { useTranslation, Trans } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import styles from "./AuthStyles.module.scss";
import { useRegister } from "@/hooks/api/useAuth";
import type { RegisterData } from "@timedo/shared/src/schemas/authSchema";
import { ApiAuthError } from "@/api/auth/auth.api";
import { AuthRightSide } from "@/components/features/Auth/AuthRightSide/AuthRightSide";
import { AuthHeaderLogo } from "@/components/features/Auth/AuthHeaderLogo/AuthHeaderLogo";

export const RegisterView = () => {
  const { t } = useTranslation();
  const { mutate: register, error, isPending } = useRegister();
  const navigate = useNavigate();

  const registerHandler = (data: RegisterData) => {
    register(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
      { onSuccess: () => navigate({ to: "/dashboard", replace: true }) },
    );
  };

  return (
    <div className={styles.AuthView}>
      {/* LEFT SIDE */}
      <div className={styles.AuthView__leftSide}>
        <AuthHeaderLogo />
        <div className={styles.AuthView__alignCenter}>
          <div className={styles.AuthView__leftContent}>
            <AuthCard isInRegister />
            <RegisterForm onSubmit={registerHandler} isLoading={isPending} />
            {error && (
              <p className={styles.AuthView__errorMessage}>
                {error instanceof ApiAuthError
                  ? t(`BackendErrors.${error.code}`)
                  : error.message}
              </p>
            )}
            <p className={styles.AuthView__alreadyHaveAccount}>
              <Trans
                i18nKey="RegisterForm.alreadyHaveAccount"
                components={{
                  link1: <Link to="/login" />,
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
