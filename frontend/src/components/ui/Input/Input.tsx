import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = ({
    label,
    error,
    id,
    className = '',
    required,
    ...props
}: InputProps) => { 
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className={styles.field}>
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
                className={`${styles.input} ${error ? styles.invalid : ''} ${className}`}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
            />
            {error && (
                <p id={errorId} className={styles.error}>
                    {error}
                </p>
            )}
        </div>
    );
};