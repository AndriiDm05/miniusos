import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { loginUser } from '../../services/auth.service';

import { useAuth } from '../../hooks/useAuth';

import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';

import styles from './LoginPage.module.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const { t } = useTranslation();

    const [email, setEmail] = useState(''); // Zmienna stanu przechowująca wartość pola adresu e-mail
    const [password, setPassword] = useState(''); // Zmienna stanu przechowująca wartość pola hasła
    const [submitted, setSubmitted] = useState(false); // Zmienna stanu określająca, czy formularz został wysłany
    const [isSubmitting, setIsSubmitting] = useState(false); // Zmienna stanu określająca, czy formularz jest w trakcie wysyłania
    const [serverError, setServerError] = useState(''); // Zmienna stanu przechowująca komunikat błędu zwrócony przez serwer

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
    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Sprawdza, czy formularz jest już w trakcie wysyłania, aby uniknąć wielokrotnego wysyłania
        if (isSubmitting) {
            return;
        }

        setSubmitted(true); // Ustawia stan submitted na true, aby wyświetlić komunikaty błędów walidacji dla wszystkich pól formularza
        setServerError(''); // Resetuje komunikat błędu serwera przed wysłaniem formularza

        if (emailError || passwordError) {
            return;
        }

        try {
            const result = await loginUser({
                email: email.trim(),
                password,
            }); // Wywołanie funkcji logowania użytkownika z danymi wejściowymi

            await refreshUser(); // Odświeżenie danych aktualnie zalogowanego użytkownika po pomyślnym logowaniu

            // Przekierowanie użytkownika na odpowiednią stronę w zależności od jego roli
            if (result.user.role === 'STUDENT') {
                console.log('Redirecting to student dashboard');
                navigate('/student/dashboard', { replace: true });
            } else if (result.user.role === 'LECTURER') {
                console.log('Redirecting to lecturer dashboard');
                navigate('/lecturer/dashboard', { replace: true });
            }
        } catch (error) {
            console.error('Login failed:', error);
            setServerError(t('auth.loginFailed')); // Ustawia komunikat błędu serwera, jeśli logowanie nie powiodło się
        } finally {
            setIsSubmitting(false);
        }
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

                    {serverError && (
                        <p role="alert" className={styles.serverError}>
                            {serverError}
                        </p>
                    )}

                    <Button type="submit">
                        {isSubmitting ? t('auth.loggingIn') : t('auth.submit')}
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