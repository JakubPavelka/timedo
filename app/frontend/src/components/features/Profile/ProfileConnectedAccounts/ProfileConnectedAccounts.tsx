import { Card } from '@/components/ui/Card/Card';
import { useTranslation } from 'react-i18next';
import { IconItem } from '@/components/ui/IconItem/IconItem';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { Link } from 'lucide-react';
import Google from '@/assets/images/googleLogo.svg?react';
import styles from './ProfileConnectedAccounts.module.scss';
import { Button } from '@/components/ui/Button/Button';

export const ProfileConnectedAccounts = () => {
    const { t } = useTranslation();

    return (
        <Card>
            <SectionHeader
                className={styles.ProfileConnectedAccounts__header}
                title={t('Profile.ConnectedAccounts.title')}
                icon={
                    <Link
                        className={styles.ProfileConnectedAccounts__icon}
                        width={16}
                        height={16}
                    />
                }
            />
            <IconItem
                title={'Google'}
                description={t('General.notConnected')}
                icon={<Google width={16} height={16} />}
                rightActions={
                    <Button
                        className={styles.ProfileConnectedAccounts__button}
                        variant={'outline'}
                    >
                        {t('General.connect')}
                    </Button>
                }
            />
        </Card>
    );
};
