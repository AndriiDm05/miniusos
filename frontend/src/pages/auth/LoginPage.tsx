import { useState } from 'react';
import { Link } from 'react-router';
import type { SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';

import styles from './LoginPage.module.css';

const LoginPage = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState(''); // Zmienna stanu przechowująca wartość pola adresu e-mail
    const [password, setPassword] = useState(''); // Zmienna stanu przechowująca wartość pola hasła
    const [submitted, setSubmitted] = useState(false); // Zmienna stanu określająca, czy formularz został wysłany

    // Funkcja walidująca adres e-mail i hasło oraz zwracająca odpowiednie komunikaty błędów
    const emailError = !email.trim()
        ? t('auth.emailRequired')
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
            ? t('auth.emailInvalid')
            : '';

    const passwordError = !password
        ? t('auth.passwordRequired')
        : '';

    // Funkcja obsługująca wysłanie formularza logowania
    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);

        if (emailError || passwordError) {
            return;
        }

        // Będzie dodana logika logowania użytkownika
    };

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <span className={styles.brand}>MiniUSOS</span>
                <LanguageSwitcher />
            </header>

            <section className={styles.loginCard}>
                <h1>{t('auth.login')}</h1>
                <p className={styles.description}>
                    {t('auth.description')}
                </p>

                <form onSubmit={handleSubmit} noValidate className={styles.form}>
                    <Input
                        label={t('auth.email')}
                        type="email"
                        autoComplete="username"
                        placeholder={t('auth.emailPlaceholder')}
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        error={submitted ? emailError : undefined}
                        required
                    />

                    <Input
                        label={t('auth.password')}
                        type="password"
                        autoComplete="current-password"
                        placeholder={t('auth.passwordPlaceholder')}
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        error={submitted ? passwordError : undefined}
                        required
                    />

                    <Button type="submit">
                        {t('auth.submit')}
                    </Button>

                    <p className={styles.registerLink}>
                        {t('auth.noAccount')}{' '}
                        <Link to="/register">
                            {t('auth.register')}
                        </Link>
                    </p>

                </form>
            </section>
        </main>
    );
};

export default LoginPage;