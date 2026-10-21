import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

// Reusable input element that can be customized with labels, error messages, and additional properties.
export const Input = ({
    label,
    error,
    id,
    className = '',
    required,
    ...props
}: InputProps) => { 
    const generatedId = useId(); // Generate a unique ID for the input element if no ID is provided.
    const inputId = id ?? generatedId; // Use the provided ID or the generated ID for the input element.
    const errorId = `${inputId}-error`; // Generate a unique ID for the error message element based on the input ID.

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