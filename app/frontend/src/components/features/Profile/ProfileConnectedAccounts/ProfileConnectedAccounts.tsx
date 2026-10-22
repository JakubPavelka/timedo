import { Card } from '@/components/ui/Card/Card';
import { useTranslation } from 'react-i18next';
import { OptionItem } from '@/components/ui/OptionItem/OptionItem';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import styles from './ProfileConnectedAccounts.module.scss';
import { Button } from '@/components/ui/Button/Button';

export const ProfileConnectedAccounts = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.ProfileConnectedAccounts}>
            <SectionHeader
                title={t('Profile.ConnectedAccounts.title')}
                description={t('Profile.ConnectedAccounts.description')}
            />
            <Card flush>
                <OptionItem
                    title={'Google'}
                    description={t('General.notConnected')}
                    rightActions={
                        // TODO Přidat propojení s Googlem
                        <Button
                            className={styles.ProfileConnectedAccounts__button}
                            variant={'outline'}
                        >
                            {t('General.connect')}
                        </Button>
                    }
                />
            </Card>
        </section>
    );
};
