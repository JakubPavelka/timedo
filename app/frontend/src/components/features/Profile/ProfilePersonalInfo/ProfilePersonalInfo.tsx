import { Card } from '@/components/ui/Card/Card';
import { Edit, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProfileForm } from '../../Forms/ProfileForm/ProfileForm';
import styles from './ProfilePersonalInfo.module.scss';
import { useState } from 'react';
import type { ProfileData } from '@timedo/shared/src/schemas/profileSchema';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';

type ProfilePersonalInfoProps = {
    onSubmit: (data: ProfileData) => Promise<unknown>;
};

export const ProfilePersonalInfo = (props: ProfilePersonalInfoProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useTranslation();

    const handleClickEditing = () => setIsEditing((prev) => !prev);

    const handleSubmit = async (data: ProfileData) => {
        try {
            await props.onSubmit(data);
            setIsEditing(false);
        } catch {
            //
        }
    };

    return (
        <section className={styles.ProfilePersonalInfo}>
            <div className={styles.ProfilePersonalInfo__topWrapper}>
                <SectionHeader title={t('Profile.PersonalInfo.title')} />
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
            <Card>
                <ProfileForm onSubmit={handleSubmit} isEditing={isEditing} />
            </Card>
        </section>
    );
};
