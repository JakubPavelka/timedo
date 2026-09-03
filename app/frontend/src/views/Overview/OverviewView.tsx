import { useTranslation } from 'react-i18next';
import { ComingSoon } from '@/components/ui/ComingSoon/ComingSoon';

export const OverviewView = () => {
    const { t } = useTranslation();

    return (
        <ComingSoon title={t('Overview.title')} description={t('Overview.description')} />
    );
};
