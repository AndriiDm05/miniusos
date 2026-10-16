import { useTranslation } from 'react-i18next'
import styles from './LanguageSwitcher.module.css'

const languages = [
    { code: 'pl', label: 'Polski' },
    { code: 'en', label: 'English' },
    { code: 'uk', label: 'Українська' },
];

export const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => { 
        void i18n.changeLanguage(event.target.value);
    };

    return (
        <select
            className={styles.languageSwitcher}
            value={i18n.resolvedLanguage ?? 'pl'}
            onChange={handleLanguageChange}
            aria-label={t('language')} >
            
            {languages.map((language) => (
                <option key={language.code} value={language.code}>
                    {language.label}
                </option>
            ))}

        </select>
    );
};