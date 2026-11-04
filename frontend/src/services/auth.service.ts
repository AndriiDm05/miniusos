// Ten plik definiuje interfejsy i funkcje związane z rejestracją użytkownika w aplikacji frontendowej.

// Interfejs reprezentujący dane wejściowe dla rejestracji użytkownika
export interface RegisterRequest {
    role: 'STUDENT' | 'LECTURER';
    firstName: string;
    lastName: string;
    email: string;
    identifier: string;
    password: string;
}

// Interfejs reprezentujący odpowiedź z serwera po rejestracji użytkownika
interface RegisterResponse {
    message: string;
    userId: string;
}

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