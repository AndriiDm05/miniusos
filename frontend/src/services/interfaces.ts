import type { UserRoleUppercase, AuthenticatedUser } from '../types/types';

// Interfejs reprezentujący dane wejściowe dla rejestracji użytkownika
export interface RegisterRequest {
    role: UserRoleUppercase; 
    firstName: string;
    lastName: string;
    email: string;
    identifier: string;
    password: string;
}

// Interfejs reprezentujący odpowiedź z serwera po rejestracji użytkownika
export interface RegisterResponse {
    message: string;
    userId: string;
}

// Interfejs reprezentujący dane wejściowe dla logowania użytkownika
export interface LoginRequest {
    email: string;
    password: string;
}

// Interfejs reprezentujący odpowiedź z serwera po zalogowaniu użytkownika
export interface LoginResponse {
    message: string;
    user: AuthenticatedUser;
}

// Interfejs reprezentujący odpowiedź z serwera po pobraniu aktualnie zalogowanego użytkownika
export interface CurrentUserResponse {
    user: AuthenticatedUser;
}