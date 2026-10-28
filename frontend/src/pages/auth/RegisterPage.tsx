import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';

import type { UserRole } from '../../types/userRole';

import styles from './RegisterPage.module.css';

// Interfejs definiujący strukturę danych formularza rejestracji
interface RegistrationForm {
    firstName: string;
    lastName: string;
    email: string;
    identifier: string;
    password: string;
    confirmPassword: string;
}

// Początkowe wartości formularza rejestracji
const initialForm: RegistrationForm = {
    firstName: '',
    lastName: '',
    email: '',
    identifier: '',
    password: '',
    confirmPassword: '',
};

// Komponent strony rejestracji umożliwiający użytkownikom tworzenie konta w systemie MiniUSOS.
const RegisterPage = () => { 
    const { t } = useTranslation();

    const [form, setForm] = useState<RegistrationForm>(initialForm); // Zmienna stanu przechowująca dane formularza rejestracji
    const [role, setRole] = useState<UserRole>('student'); // Zmienna stanu przechowująca wybraną rolę użytkownika (student lub wykładowca)
    const [submitted, setSubmitted] = useState(false); // Zmienna stanu określająca, czy formularz został wysłany

    // Funkcja aktualizująca stan formularza po zmianie wartości pola
    const updateField = (
        field: keyof RegistrationForm,
        value: string
    ) => {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: value
        }));
    };

    // Funkcja zwracająca komunikat błędu dla konkretnego pola na podstawie reguł walidacji
    const getError = (field: keyof RegistrationForm): string => { 
        const value = form[field]; // Pobiera wartość pola z formularza

        // Sprawdza, czy pole jest puste i zwraca odpowiedni komunikat błędu
        if (!value.trim()) {
            return t(`auth.fieldRequired`);
        }

        // Walidacja specyficzna dla poszczególnych pól formularza
        switch (field) {
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                    ? ''
                    : t('auth.emailInvalid');

            case 'identifier':
                return /^\d{6}$/.test(value)
                    ? ''
                    : t('auth.identifierInvalid');

            case 'password':
                return value.length >= 8
                    ? ''
                    : t('auth.passwordTooShort');

            case 'confirmPassword':
                return value === form.password
                    ? ''
                    : t('auth.passwordMismatch');

            default:
                return '';
        }
    };

    // Funkcja obsługująca zmianę wybranej roli użytkownika (student lub wykładowca)
    const handleRoleChange = (selectedRole: UserRole) => { 
        setRole(selectedRole); // Aktualizuje stan roli użytkownika na wybraną rolę
        // Resetuje pole identyfikatora przy zmianie roli, aby uniknąć konfliktów danych
        setForm(previous => ({
            ...previous, // Zachowuje pozostałe pola formularza
            identifier: '' // Resetuje pole identyfikatora przy zmianie roli
        }));
        setSubmitted(false); // Resetuje stan submitted przy zmianie roli
    };

    
    // Konstanta przechowująca listę pól formularza rejestracji, które będą renderowane w interfejsie użytkownika
    const fields: (keyof RegistrationForm)[] = [
        'firstName',
        'lastName',
        'email',
        'identifier',
        'password',
        'confirmPassword',
    ];

    // Funkcja obsługująca wysłanie formularza rejestracji
    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => { 
        event.preventDefault(); // Zapobiega domyślnej akcji przeglądarki przy wysyłaniu formularza
        setSubmitted(true); // Ustawia stan submitted na true, co oznacza, że formularz został wysłany

        // Sprawdza, czy istnieją błędy walidacji w formularzu
        const hasErrors = fields.some((field) => getError(field) !== ''); 

        if (hasErrors) {
            return;
        }

        // Będzie dodana logika wysyłania danych rejestracyjnych do backendu
    };

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <span className={styles.brand}>MiniUSOS</span>
                <LanguageSwitcher />
            </header>

            <section className={styles.registerCard}>
                <h1>{t('auth.register')}</h1>
                
                <p className={styles.description}>
                    {t('auth.registerDescription')}
                </p>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <fieldset className={styles.roleFieldset}>
                        <legend>{t('auth.selectRole')}</legend>

                        <div className={styles.roleSelector}>
                            <button
                                type="button"
                                className={
                                    role === 'student'
                                        ? styles.activeRole
                                        : styles.roleButton
                                }
                                onClick={() => handleRoleChange('student')}
                                aria-pressed={role === 'student'}
                            >
                                {t('auth.student')}
                            </button>

                            <button
                                type="button"
                                className={
                                    role === 'lecturer'
                                        ? styles.activeRole
                                        : styles.roleButton
                                }
                                onClick={() => handleRoleChange('lecturer')}
                                aria-pressed={role === 'lecturer'}
                            >
                                {t('auth.lecturer')}
                            </button>
                        </div>
                    </fieldset>

                    <Input
                        label={t('auth.firstName')}
                        value={form.firstName}
                        onChange={event =>
                            updateField('firstName', event.target.value)
                        }
                        placeholder={t('auth.firstNamePlaceholder')}
                        error={submitted ? getError('firstName') : undefined}
                        autoComplete="given-name"
                        required
                    />

                    <Input
                        label={t('auth.lastName')}
                        value={form.lastName}
                        onChange={event =>
                            updateField('lastName', event.target.value)
                        }
                        placeholder={t('auth.lastNamePlaceholder')}
                        error={submitted ? getError('lastName') : undefined}
                        autoComplete="family-name"
                        required
                    />

                    <Input
                        label={t('auth.email')}
                        type="email"
                        value={form.email}
                        onChange={event =>
                            updateField('email', event.target.value)
                        }
                        placeholder={t('auth.emailPlaceholder')}
                        error={submitted ? getError('email') : undefined}
                        autoComplete="email"
                        required
                    />

                    <Input
                        label={
                            role === 'student'
                                ? t('auth.studentId')
                                : t('auth.employeeId')
                        }
                        value={form.identifier}
                        onChange={event =>
                            updateField('identifier', event.target.value)
                        }
                        placeholder={
                            role === 'student'
                                ? t('auth.studentIdPlaceholder')
                                : t('auth.employeeIdPlaceholder')
                        }
                        error={submitted ? getError('identifier') : undefined}
                        inputMode="numeric"
                        maxLength={6}
                        required
                    />

                    <Input
                        label={t('auth.password')}
                        type="password"
                        value={form.password}
                        onChange={event =>
                            updateField('password', event.target.value)
                        }
                        placeholder={t('auth.passwordPlaceholder')}
                        error={submitted ? getError('password') : undefined}
                        autoComplete="new-password"
                        required
                    />

                    <Input
                        label={t('auth.confirmPassword')}
                        type="password"
                        autoComplete="new-password"
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        value={form.confirmPassword}
                        onChange={event =>
                            updateField('confirmPassword', event.target.value)
                        }
                        error={
                            submitted
                                ? getError('confirmPassword')
                                : undefined
                        }
                        required
                    />

                    <Button type="submit">
                        {t('auth.register')}
                    </Button>
                </form>

                <p className={styles.loginLink}>
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link to="/login">
                        {t('auth.signIn')}
                    </Link>
                </p>
            </section>
        </main>
    );
};

export default RegisterPage;