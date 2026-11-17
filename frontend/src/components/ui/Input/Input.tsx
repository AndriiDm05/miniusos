import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

// Wielokrotnego użytku element pola wejściowego, który można dostosować za pomocą etykiet, komunikatów błędów i dodatkowych właściwości.
export const Input = ({
    label,
    error,
    id,
    className = '',
    required,
    type = 'text',
    ...props
}: InputProps) => { 
    const generatedId = useId(); // Wygeneruj unikalny identyfikator pola, jeśli nie podano identyfikatora.
    const inputId = id ?? generatedId; // Użyj podanego lub wygenerowanego identyfikatora pola.
    const errorId = `${inputId}-error`; // Wygeneruj unikalny identyfikator komunikatu błędu na podstawie identyfikatora pola.

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';

    const inputType = isPassword
        ? (showPassword ? 'text' : 'password')
        : type;

    return (
        <div className={styles.inputWrapper}> 
            <label htmlFor={inputId} className={styles.label}>
                {label}
                {required && (
                    <span className={styles.required}>*</span>
                )}
            </label>
            <input
                {...props}
                id={inputId}
                required={required} 
                type={inputType}
                className={`${styles.input} ${error ? styles.invalid : ''} ${isPassword ? styles.passwordInput : ''} ${className}`}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
            />

            {isPassword && (
                <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(prev => !prev)}
                    disabled={props.disabled}
                    aria-label={
                        showPassword
                            ? 'Ukryj hasło'
                            : 'Pokaż hasło'
                    }
                    aria-pressed={showPassword}
                    title={
                        showPassword
                            ? 'Ukryj hasło'
                            : 'Pokaż hasło'
                    }
                >
                    {showPassword ? (
                        <EyeOff size={20} aria-hidden="true" />
                    ) : (
                        <Eye size={20} aria-hidden="true" />
                    )}
                </button>
            )}

            {error && (
                <p id={errorId} className={styles.error}>
                    {error}
                </p>
            )}
        </div>
    );
};