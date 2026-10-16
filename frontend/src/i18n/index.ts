import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import pl from './locales/pl.json';
import en from './locales/en.json';
import uk from './locales/uk.json';

const savedLanguage = localStorage.getItem('language') || 'pl';

const supportedLanguages = ['pl', 'en', 'uk'];

const initialLanguage = 
    savedLanguage && supportedLanguages.includes(savedLanguage)
        ? savedLanguage
        : 'pl';

i18n.use(initReactI18next).init({
    resources: {
        pl: { translation: pl },
        en: { translation: en },
        uk: { translation: uk },
    },
    lng: initialLanguage,
    fallbackLng: 'pl',
    interpolation: {
        escapeValue: false,
    },
});

i18n.on('languageChanged', (language) => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
});

document.documentElement.lang = i18n.language;