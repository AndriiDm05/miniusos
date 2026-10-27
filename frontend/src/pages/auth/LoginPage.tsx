import { useState } from 'react';
import { Link } from 'react-router';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';

import styles from './LoginPage.module.css';

const LoginPage = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState(''); // State variable to hold the email input value
    const [password, setPassword] = useState(''); // State variable to hold the password input value
    const [submitted, setSubmitted] = useState(false); // State variable to track whether the form has been submitted
    const [showNotice, setShowNotice] = useState(false); // State variable to control the visibility of the notice message

    const emailError = !email.trim()
        ? t('auth.emailRequired')
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
            ? t('auth.emailInvalid')
            : '';

    const passwordError = !password
        ? t('auth.passwordRequired')
        : '';

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
        setShowNotice(false);

        if (emailError || passwordError) {
            return;
        }

        // Backend authentication will be added later.
        setShowNotice(true);
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
                            setShowNotice(false);
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
                            setShowNotice(false);
                        }}
                        error={submitted ? passwordError : undefined}
                        required
                    />

                    <Button type="submit">
                        {t('auth.submit')}
                    </Button>

                    {showNotice && (
                        <p className={styles.notice} role="status">
                            {t('auth.demoNotice')}
                        </p>
                    )}

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