import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';

import styles from './RegisterPage.module.css';

// Komponent SuccessPage wyświetlający komunikat o pomyślnej rejestracji użytkownika
const SuccessPage = () => {
    const { t } = useTranslation(); // Hook useTranslation z biblioteki react-i18next do obsługi tłumaczeń w aplikacji

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <span className={styles.brand}>MiniUSOS</span>
                <LanguageSwitcher />
            </header>

            <section className={styles.registerCard}>
                <svg className={styles.successIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                </svg>

                <p className={styles.description}>{t('auth.registrationSuccess')}</p>

                <p className={styles.loginLink}>
                    <Link to="/login">
                        {t('auth.goToLogin')}
                    </Link>
                </p>
            </section>
        </main>
    );
};

export default SuccessPage;