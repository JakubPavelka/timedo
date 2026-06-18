import { RegisterForm } from "@/components/features/forms/AuthForm/RegisterForm";
import { ThemeSwitch } from "../../components/ui/ThemeSwitch/ThemeSwitch";
import { useTheme } from "@/hooks/useTheme";
import { AuthCard } from "@/components/features/Auth/AuthCard/AuthCard";
import { useTranslation, Trans } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import LogoBlue from "@/assets/images/logoBlue.svg?react";
import LogoBlueDarkTheme from "@/assets/images/logoBlueDarkTheme.svg?react";
import styles from "./AuthStyles.module.scss";
import TimerCard from "@/assets/images/timerCard.png";
import { useRegister } from "@/hooks/api/useAuth";
import type { RegisterData } from "@timedo/shared/src/schemas/authSchema";
import axios from "axios";

export const RegisterView = () => {
  const { t } = useTranslation();
  const { mutate: register, error, isPending } = useRegister();
  const theme = useTheme((s) => s.theme);
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
        <div className={styles.AuthView__logoWrapper}>
          {theme === "light" ? (
            <LogoBlue height={40} width={110} />
          ) : (
            <LogoBlueDarkTheme height={40} width={110} />
          )}
          <ThemeSwitch />
        </div>
        <div className={styles.AuthView__alignCenter}>
          <div className={styles.AuthView__leftContent}>
            <AuthCard />
            <RegisterForm onSubmit={registerHandler} isLoading={isPending} />
            {error && (
              <p className={styles.AuthView__errorMessage}>
                {axios.isAxiosError(error)
                  ? t(`BackendErrors.${error.response?.data?.code}`)
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
        <img src={TimerCard} />
        <div className={styles.AuthView__rightContent}>
          <p>
            <Trans
              i18nKey={"AuthRightSide.title"}
              components={{
                colored: <span className={styles["--colored"]} />,
                break: <br />,
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
};
