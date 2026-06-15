import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Input.module.scss";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const ICON_SIZE = 16;

export const Input = (props: InputProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const inputType =
    props.type === "password" && showPassword ? "text" : props.type;

  return (
    <div className={styles.Input}>
      <input className={styles.Input__input} {...props} type={inputType} />
      {props.type === "password" && (
        <button
          onClick={handleShowPassword}
          type="button"
          className={styles.Input__toggle}
          aria-label={
            showPassword ? t("Input.hidePassword") : t("Input.showPassword")
          }
        >
          {showPassword ? (
            <EyeOff
              className={styles.Input__icon}
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          ) : (
            <Eye
              className={styles.Input__icon}
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          )}
        </button>
      )}
    </div>
  );
};
