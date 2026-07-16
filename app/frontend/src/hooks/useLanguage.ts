import { useTranslation } from 'react-i18next';

export type Language = 'cs-CZ' | 'en';

export const useLanguage = () => {
    const { i18n } = useTranslation();

    return {
        language: i18n.language as Language,
        setLanguage: (lang: Language) => i18n.changeLanguage(lang),
    };
};
