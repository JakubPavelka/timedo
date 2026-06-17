import { useTranslation } from "react-i18next";
import styles from "./AuthCard.module.scss";
import Google from "@/assets/images/googleLogo.svg?react";

type AuthCardProps = {
  onGoogleSignClick?: () => void;
  isInRegister?: boolean;
};

export const AuthCard = (props: AuthCardProps) => {
  const { t } = useTranslation();
  const isInRegister = props.isInRegister ?? false;

  return (
    <div>
      <p className={styles.AuthCard__welcomeBackText}>
        {isInRegister ? t("AuthCard.tryForFree") : t("AuthCard.welcomeBack")}
      </p>
      <h1 className={styles.AuthCard__title}>
        {isInRegister ? t("AuthCard.createAccount") : t("AuthCard.signIn")}
      </h1>
      <button type={"button"} className={styles.AuthCard__googleCard}>
        <Google />
        <span className={styles.AuthCard__cardText}>
          {t("AuthCard.continueWithGoogle")}
        </span>
      </button>
      <div className={styles.AuthCard__withEmailWrapper}>
        <div className={styles.AuthCard__divider} />
        <p className={styles.AuthCard__withEmailText}>
          {t("AuthCard.orWithEmail")}
        </p>
        <div className={styles.AuthCard__divider} />
      </div>
    </div>
  );
};
