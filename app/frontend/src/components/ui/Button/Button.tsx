import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import { Spinner } from "../Spinner/Spinner";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  haveRightArrow?: boolean;
  variant?: ButtonVariant;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = "primary",
  haveRightArrow,
  isLoading,
  children,
  type,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={clsx(styles.Button, styles[`Button--${variant}`])}
      type={type ?? "button"}
      disabled={isLoading}
      {...rest}
    >
      <span className={styles.Button__text}>{children}</span>
      {isLoading ? (
        <Spinner size="sm" className={styles.Button__spinner} />
      ) : (
        haveRightArrow && (
          <ChevronRight
            className={styles.Button__chevronRight}
            width={16}
            height={16}
          />
        )
      )}
    </button>
  );
};
