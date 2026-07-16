import { Input } from '@/components/ui/Input/Input';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ProfileSchema,
    type ProfileData,
} from '@/../../packages/shared/src/schemas/profileSchema';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button/Button';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import styles from './ProfileForm.module.scss';

type ProfileForm = {
    isEditing: boolean;
    onSubmit: (data: ProfileData) => void;
};

export const ProfileForm = (props: ProfileForm) => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<ProfileData>({
        mode: 'onSubmit',
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName ?? '',
        },
        values: {
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
        },
    });

    const onSubmitHandler = handleSubmit((data) => props.onSubmit(data));

    return (
        <form className={styles.ProfileForm} onSubmit={onSubmitHandler}>
            <div className={styles.ProfileForm__inputsWrapper}>
                <div className={styles.ProfileForm__nameWrapper}>
                    <div
                        className={clsx(
                            styles.ProfileForm__labelWrapper,
                            styles['--half']
                        )}
                    >
                        <label htmlFor={'firstName'}>
                            {t('Profile.PersonalInfo.firstName')}
                        </label>
                        <Controller
                            name={'firstName'}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    id={'firstName'}
                                    onChange={onChange}
                                    value={value}
                                    disabled={!props.isEditing}
                                />
                            )}
                        />
                        {errors.firstName && (
                            <p className={styles.ProfileForm__errorText}>
                                {t(errors.firstName.message!)}
                            </p>
                        )}
                    </div>
                    <div
                        className={clsx(
                            styles.ProfileForm__labelWrapper,
                            styles['--half']
                        )}
                    >
                        <label htmlFor={'lastName'}>
                            {t('Profile.PersonalInfo.lastName')}
                        </label>
                        <Controller
                            name={'lastName'}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    id={'lastName'}
                                    onChange={onChange}
                                    value={value}
                                    disabled={!props.isEditing}
                                />
                            )}
                        />
                        {errors.lastName && (
                            <p className={styles.ProfileForm__errorText}>
                                {t(errors.lastName.message!)}
                            </p>
                        )}
                    </div>
                </div>
                <div className={styles.ProfileForm__labelWrapper}>
                    <label htmlFor={'email'}>
                        {t('Profile.PersonalInfo.email')}
                    </label>
                    <Input
                        id={'email'}
                        value={user?.email}
                        type={'email'}
                        autoComplete={'email'}
                        disabled
                    />
                </div>
            </div>
            {props.isEditing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Button
                        className={styles.ProfileForm__submitButton}
                        type={'submit'}
                        disabled={!isDirty}
                    >
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
