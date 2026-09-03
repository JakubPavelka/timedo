import { useTranslation } from 'react-i18next';
import { ComingSoon } from '@/components/ui/ComingSoon/ComingSoon';

export const CalendarView = () => {
    const { t } = useTranslation();

    return (
        <ComingSoon title={t('Calendar.title')} description={t('Calendar.description')} />
    );
};
