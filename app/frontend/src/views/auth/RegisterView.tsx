import { RegisterForm } from "@/components/features/forms/AuthForm/RegisterForm";
import { ThemeSwitch } from "../../components/ui/ThemeSwitch/ThemeSwitch";
import { useTheme } from "@/hooks/useTheme";
import { AuthCard } from "@/components/features/Auth/AuthCard/AuthCard";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "@tanstack/react-router";
import LogoBlue from "@/assets/images/logoBlue.svg?react";
import LogoBlueDarkTheme from "@/assets/images/logoBlueDarkTheme.svg?react";
import styles from "./AuthStyles.module.scss";
import TimerCard from "@/assets/images/timerCard.png";

export const RegisterView = () => {
  const { t } = useTranslation();

  const theme = useTheme((s) => s.theme);
  console.log("theme", theme);

  return (
    <div className={styles.AuthView}>
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
            <RegisterForm />
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
