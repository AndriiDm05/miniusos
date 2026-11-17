// Ten plik definiuje interfejsy i funkcje związane z rejestracją i logowaniem użytkownika w aplikacji frontendowej.
import type { AuthenticatedUser } from '../types/types';
import type {
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    CurrentUserResponse
} from './interfaces'; // Import interfejsów z pliku interfaces.ts


// Stała przechowująca adres URL API, pobierany z zmiennych środowiskowych lub ustawiany na domyślny localhost
const API_URL = import.meta.env.VITE_API_URL
    ?? 'http://localhost:3000';

// Funkcja rejestrująca użytkownika
export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
    // Wysłanie żądania POST do endpointu rejestracji użytkownika na serwerze backendowym
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // Sprawdzenie, czy odpowiedź jest niepoprawna
    if (!response.ok) {
        throw new Error('Registration failed');
    }

    // Zwrócenie odpowiedzi z serwera jako obiekt RegisterResponse
    return response.json() as Promise<RegisterResponse>;
}

// Funkcja logowania użytkownika
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
    // Wysłanie żądania POST do endpointu logowania użytkownika na serwerze backendowym
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Ustawienie opcji credentials na 'include', aby przesyłać ciasteczka z żądaniem
        body: JSON.stringify(data),
    });

    // Sprawdzenie, czy odpowiedź jest niepoprawna
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid email or password');
        }

        throw new Error('Login failed');
    }

    // Zwrócenie odpowiedzi z serwera jako obiekt LoginResponse
    return response.json() as Promise<LoginResponse>;
}

// Funkcja pobierająca aktualnie zalogowanego użytkownika
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
    }); // Wysłanie żądania GET do endpointu pobierania aktualnie zalogowanego użytkownika na serwerze backendowym

    if (response.status === 401) {
        return null; // Zwrócenie null, jeśli użytkownik nie jest zalogowany (brak ważnego tokenu dostępu)
    }

    if (!response.ok) {
        throw new Error('Failed to fetch current user'); // Rzucenie błędu, jeśli odpowiedź z serwera jest niepoprawna
    }

    const data: CurrentUserResponse = await response.json(); // Parsowanie odpowiedzi z serwera jako obiekt CurrentUserResponse

    return data.user; // Zwrócenie obiektu reprezentującego aktualnie zalogowanego użytkownika
}

// Funkcja wylogowująca użytkownika
export async function logoutUser(): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Logout failed'); 
    }
}

