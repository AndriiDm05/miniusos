import 'dotenv/config'; // Import konfiguracji zmiennych środowiskowych z pliku .env
import jwt from 'jsonwebtoken'; // Import biblioteki jsonwebtoken do generowania i weryfikacji tokenów JWT

import type { UserRole } from '../../types/types';

// Interfejs reprezentujący dane zawarte w tokenie JWT
export interface TokenPayload { 
    userId: string;
    role: UserRole; 
}

const jwtSecret = process.env.JWT_SECRET; // Pobranie sekretu JWT z zmiennej środowiskowej

// Sprawdzenie, czy sekret JWT jest ustawiony i ma co najmniej 32 znaki
if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
}

const secret: string = jwtSecret; // Przypisanie sekretu JWT do stałej secret

// Funkcja generująca token dostępu (access token) na podstawie danych użytkownika
export function generateAccessToken(payload: TokenPayload): string { 
    return jwt.sign({
        userId: payload.userId,
        role: payload.role,
    }, secret, {
        expiresIn: '1h', // Token wygasa po 1 godzinie,
        algorithm: 'HS256', // Algorytm podpisu HMAC SHA-256
    });
}

// Funkcja weryfikująca token dostępu (access token) i zwracająca dane zawarte w tokenie
export function verifyAccessToken(token: string): TokenPayload { 
    const decoded = jwt.verify(token, secret, {
        algorithms: ['HS256'], // Algorytm podpisu HMAC SHA-256
    }); // Weryfikacja tokenu JWT i zwrócenie zdekodowanych danych

    
    if (
        typeof decoded === 'string' ||
        typeof decoded.userId !== 'string' ||
        (decoded.role !== 'STUDENT' && decoded.role !== 'LECTURER')
    ) {
        throw new Error('Invalid token payload'); // Rzucenie błędu, jeśli dane w tokenie są nieprawidłowe
    }

    return {
        userId: decoded.userId,
        role: decoded.role,
    }; // Zwrócenie danych zawartych w tokenie
}
