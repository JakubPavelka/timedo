import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  haveRightArrow?: boolean;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = "primary",
  haveRightArrow,
  children,
  type,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={clsx(styles.Button, styles[`Button--${variant}`])}
      type={type ?? "button"}
      {...rest}
    >
      <span className={styles.Button__text}>{children}</span>
      {haveRightArrow && (
        <ChevronRight
          className={styles.Button__chevronRight}
          width={16}
          height={16}
        />
      )}
    </button>
  );
};
