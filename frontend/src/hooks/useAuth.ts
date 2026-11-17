// Hook umożliwiający korzystanie z kontekstu uwierzytelnienia w aplikacji React
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() { 
    const context = useContext(AuthContext); // Pobranie kontekstu uwierzytelnienia z React Context

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider'); // Rzucenie błędu, jeśli hook jest używany poza kontekstem AuthProvider
    }

    return context; // Zwrócenie kontekstu uwierzytelnienia
}