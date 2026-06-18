import { Input } from "@/components/ui/Input/Input";
import { useTranslation, Trans } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@timedo/shared/src/schemas/authSchema";
import type { RegisterData } from "@timedo/shared/src/schemas/authSchema";
import styles from "./AuthForm.module.scss";
import { Button } from "@/components/ui/Button/Button";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Link } from "@tanstack/react-router";
import { Lock, Mail, User } from "lucide-react";

type RegisterFormProps = {
  onSubmit: (data: RegisterData) => void;
  isLoading?: boolean;
};

const ICON_SIZE = 16;

export const RegisterForm = (props: RegisterFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    mode: "onSubmit",
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordAgain: "",
      firstName: "",
      lastName: "",
      termsAccepted: false,
    },
  });

  const onSubmitHandler = (data: RegisterData) => {
    props.onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      {/* FIRSTNAME AND LASTNAME INPUT */}
      <div className={styles["AuthForm__inputWrapper--row"]}>
        <div className={styles.AuthForm__columnWrapper}>
          <label htmlFor={"firstName"} className={styles.AuthForm__inputLabel}>
            {t("RegisterForm.firstName")}*
          </label>
          <Controller
            control={control}
            name={"firstName"}
            render={({ field: { onChange, value } }) => (
              <Input
                id={"firstName"}
                value={value}
                onChange={onChange}
                type={"text"}
                prefixIcon={<User width={ICON_SIZE} height={ICON_SIZE} />}
              />
            )}
          />
          {errors.firstName && (
            <p className={styles.AuthForm__errorMessage}>
              {t(errors.firstName.message!)}
            </p>
          )}
        </div>

        <div className={styles.AuthForm__columnWrapper}>
          <label htmlFor={"lastName"} className={styles.AuthForm__inputLabel}>
            {t("RegisterForm.lastName")}
          </label>
          <Controller
            control={control}
            name={"lastName"}
            render={({ field: { onChange, value } }) => (
              <Input
                id={"lastName"}
                value={value}
                onChange={onChange}
                type={"text"}
                prefixIcon={<User width={ICON_SIZE} height={ICON_SIZE} />}
              />
            )}
          />
          {errors.lastName && (
            <p className={styles.AuthForm__errorMessage}>
              {t(errors.lastName.message!)}
            </p>
          )}
        </div>
      </div>

      {/* EMAIL INPUT */}
      <div className={styles.AuthForm__inputWrapper}>
        <label htmlFor={"email"} className={styles.AuthForm__inputLabel}>
          {t("RegisterForm.email")}*
        </label>
        <Controller
          control={control}
          name={"email"}
          render={({ field: { onChange, value } }) => (
            <Input
              id={"email"}
              value={value}
              onChange={onChange}
              type={"email"}
              prefixIcon={<Mail width={ICON_SIZE} height={ICON_SIZE} />}
            />
          )}
        />
        {errors.email && (
          <p className={styles.AuthForm__errorMessage}>
            {t(errors.email.message!)}
          </p>
        )}
      </div>

      {/* PASSWORD INPUT */}
      <div className={styles.AuthForm__inputWrapper}>
        <label htmlFor={"password"} className={styles.AuthForm__inputLabel}>
          {t("RegisterForm.password")}*
        </label>
        <Controller
          control={control}
          name={"password"}
          render={({ field: { onChange, value } }) => (
            <Input
              id={"password"}
              value={value}
              onChange={onChange}
              type={"password"}
              prefixIcon={<Lock width={ICON_SIZE} height={ICON_SIZE} />}
            />
          )}
        />
        {errors.password && (
          <p className={styles.AuthForm__errorMessage}>
            {t(errors.password.message!)}
          </p>
        )}
      </div>

      {/* PASSWORD AGAIN INPUT */}
      <div className={styles.AuthForm__inputWrapper}>
        <label
          htmlFor={"passwordAgain"}
          className={styles.AuthForm__inputLabel}
        >
          {t("RegisterForm.passwordAgain")}*
        </label>
        <Controller
          control={control}
          name={"passwordAgain"}
          render={({ field: { onChange, value } }) => (
            <Input
              id={"passwordAgain"}
              value={value}
              onChange={onChange}
              type={"password"}
              prefixIcon={<Lock width={ICON_SIZE} height={ICON_SIZE} />}
            />
          )}
        />
        {errors.passwordAgain && (
          <p className={styles.AuthForm__errorMessage}>
            {t(errors.passwordAgain.message!)}
          </p>
        )}
      </div>

      {/* TERMS OF SERVICE CHECKBOX  */}
      <div className={styles.AuthForm__checkboxWrapper}>
        <Controller
          control={control}
          name={"termsAccepted"}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              id={"terms-of-service"}
              checked={value}
              onChange={onChange}
              label={
                <Trans
                  i18nKey="RegisterForm.termsOfService"
                  components={{
                    link1: <Link to="/terms-of-service" />,
                    link2: <Link to="/privacy-policy" />,
                  }}
                />
              }
            />
          )}
        />
        {errors.termsAccepted && (
          <p className={styles.AuthForm__errorMessage}>
            {t(errors.termsAccepted.message!)}
          </p>
        )}
      </div>

      <div className={styles.AuthForm__submitBtn}>
        <Button type={"submit"} haveRightArrow isLoading={props.isLoading}>
          {t("RegisterForm.createAccount")}
        </Button>
      </div>
    </form>
  );
};
