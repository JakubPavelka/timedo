import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/common.json';
import cs from './locales/cs/common.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: en },
            'cs-CZ': { common: cs },
        },
        fallbackLng: 'en',
        defaultNS: 'common',
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'language',
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
