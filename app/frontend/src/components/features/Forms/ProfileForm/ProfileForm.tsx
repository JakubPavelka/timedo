import { useEffect } from 'react';
import { Input } from '@/components/ui/Input/Input';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ProfileSchema,
    type ProfileData,
} from '@timedo/shared/src/schemas/profileSchema';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button/Button';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import styles from './ProfileForm.module.scss';

type ProfileFormProps = {
    isEditing: boolean;
    onSubmit: (data: ProfileData) => void;
};

type ProfileFormRowProps = {
    label: string;
    htmlFor?: string;
    children: React.ReactNode;
};

const ProfileFormRow = (props: ProfileFormRowProps) => (
    <div className={styles.ProfileForm__row}>
        <label className={styles.ProfileForm__label} htmlFor={props.htmlFor}>
            {props.label}
        </label>
        <div className={styles.ProfileForm__valueWrapper}>{props.children}</div>
    </div>
);

export const ProfileForm = (props: ProfileFormProps) => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileData>({
        mode: 'onSubmit',
        resolver: zodResolver(ProfileSchema),
        values: {
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
        },
    });

    useEffect(() => {
        if (!props.isEditing) {
            reset();
        }
    }, [props.isEditing, reset]);

    const onSubmitHandler = handleSubmit((data) => props.onSubmit(data));

    const renderValue = (value?: string | null) =>
        value ? (
            <p className={styles.ProfileForm__value}>{value}</p>
        ) : (
            <p className={clsx(styles.ProfileForm__value, styles['--empty'])}>
                {t('Profile.PersonalInfo.notFilled')}
            </p>
        );

    return (
        <form className={styles.ProfileForm} onSubmit={onSubmitHandler}>
            <ProfileFormRow
                label={t('Profile.PersonalInfo.firstName')}
                htmlFor={props.isEditing ? 'firstName' : undefined}
            >
                {props.isEditing ? (
                    <Controller
                        name={'firstName'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                className={styles.ProfileForm__input}
                                id={'firstName'}
                                onChange={onChange}
                                value={value}
                                autoComplete={'given-name'}
                                autoFocus
                            />
                        )}
                    />
                ) : (
                    renderValue(user?.firstName)
                )}
                {props.isEditing && errors.firstName && (
                    <p className={styles.ProfileForm__errorText}>
                        {t(errors.firstName.message!)}
                    </p>
                )}
            </ProfileFormRow>

            <ProfileFormRow
                label={t('Profile.PersonalInfo.lastName')}
                htmlFor={props.isEditing ? 'lastName' : undefined}
            >
                {props.isEditing ? (
                    <Controller
                        name={'lastName'}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                className={styles.ProfileForm__input}
                                id={'lastName'}
                                onChange={onChange}
                                value={value ?? ''}
                                autoComplete={'family-name'}
                            />
                        )}
                    />
                ) : (
                    renderValue(user?.lastName)
                )}
                {props.isEditing && errors.lastName && (
                    <p className={styles.ProfileForm__errorText}>
                        {t(errors.lastName.message!)}
                    </p>
                )}
            </ProfileFormRow>

            <ProfileFormRow label={t('Profile.PersonalInfo.email')}>
                {renderValue(user?.email)}
            </ProfileFormRow>

            {props.isEditing && (
                <motion.div
                    className={styles.ProfileForm__actions}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Button type={'submit'} disabled={!isDirty}>
                        <span className={styles.ProfileForm__submitButtonText}>
                            <Check width={16} height={16} />
                            <span>{t('General.saveChanges')}</span>
                        </span>
                    </Button>
                </motion.div>
            )}
        </form>
    );
};
