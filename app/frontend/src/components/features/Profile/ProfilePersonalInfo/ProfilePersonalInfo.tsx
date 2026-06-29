import { Card } from '@/components/ui/Card/Card';
import { User, Edit, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProfileForm } from '../../forms/ProfileForm/ProfileForm';
import styles from './ProfilePersonalInfo.module.scss';
import { useState } from 'react';
import type { ProfileData } from '@timedo/shared/src/schemas/profileSchema';

type ProfilePersonalInfoProps = {
    onSubmit: (data: ProfileData) => void;
};

export const ProfilePersonalInfo = (props: ProfilePersonalInfoProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useTranslation();

    const handleClickEditing = () => setIsEditing((prev) => !prev);

    return (
        <Card className={styles.ProfilePersonalInfo}>
            <div className={styles.ProfilePersonalInfo__topWrapper}>
                <div className={styles.ProfilePersonalInfo__flexWrapper}>
                    <div className={styles.ProfilePersonalInfo__iconWrapper}>
                        <User
                            className={styles.ProfilePersonalInfo__icon}
                            width={16}
                            height={16}
                        />
                    </div>
                    <p className={styles.ProfilePersonalInfo__title}>
                        {t('Profile.PersonalInfo.title')}
                    </p>
                </div>

                <button
                    className={styles.ProfilePersonalInfo__button}
                    onClick={handleClickEditing}
                >
                    {isEditing ? (
                        <X width={16} height={16} />
                    ) : (
                        <Edit width={16} height={16} />
                    )}
                    <span className={styles.ProfilePersonalInfo__editText}>
                        {t(isEditing ? 'General.cancel' : 'General.edit')}
                    </span>
                </button>
            </div>
            <ProfileForm onSubmit={props.onSubmit} isEditing={isEditing} />
        </Card>
    );
};
