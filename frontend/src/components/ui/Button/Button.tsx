import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { 
    variant?: ButtonVariant;
    children: ReactNode;
    isLoading?: boolean;
}

// Wielokrotnego użytku element przycisku, który można dostosować za pomocą wariantów, stanów ładowania i dodatkowych właściwości.
export const Button = ({
    variant = 'primary',
    children,
    isLoading = false,
    className = '',
    disabled,
    type = 'button',
    ...props
}: ButtonProps) => { 
    return (
        <button
            {...props}
            type={type}
            className={`${styles.button} ${styles[variant]} ${className}`}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
        >
            {isLoading ? '...' : children}
        </button>
    );
};