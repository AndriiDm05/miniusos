import { pool } from '../../config/database.js'; // Import instancji puli połączeń do bazy danych PostgreSQL
import type { RegisterInput } from './auth.schema.js'; // Import typu danych wejściowych dla rejestracji użytkownika

export type RegistrationErrorCode = 
    | 'PERSON_NOT_FOUND' // Kod błędu, gdy osoba nie została znaleziona w bazie danych
    | 'EMAIL_TAKEN' // Kod błędu, gdy adres email jest już zajęty
    | 'ALREADY_REGISTERED'; // Kod błędu, gdy osoba jest już zarejestrowana w systemie

// Klasa reprezentująca błąd rejestracji użytkownika, dziedzicząca po klasie Error
export class RegistrationError extends Error { 
    constructor(public readonly code: RegistrationErrorCode) {
        super(code); // Wywołanie konstruktora klasy bazowej Error z kodem błędu
        this.name = 'RegistrationError'; // Ustawienie nazwy błędu na 'RegistrationError'
    }
}

export async function verifyRegistration(data: RegisterInput): Promise<void> { 
    const isStudent = data.role === 'STUDENT'; // Sprawdzenie, czy rola użytkownika to STUDENT

    const registryTable = isStudent
        ? 'student_registry' // Jeśli rola to STUDENT, to używamy tabelę students_registry
        : 'lecturer_registry'; // Jeśli rola to LECTURER, to używamy tabelę lecturers_registry
    
    const profileTable = isStudent
        ? 'students' // Jeśli rola to STUDENT, to używamy tabelę students
        : 'lecturers'; // Jeśli rola to LECTURER, to używamy tabelę lecturers
    
    const identofoerColumn = isStudent 
        ? 'student_number' // Jeśli rola to STUDENT, to używamy kolumnę student_number
        : 'employee_number'; // Jeśli rola to LECTURER, to używamy kolumnę lecturer_number
    
    // Sprawdzenie, czy osoba istnieje w rejestrze (students_registry lub lecturers_registry)
    const registryResult = await pool.query(
        `
        SELECT id
        FROM ${registryTable}
        WHERE ${identofoerColumn} = $1
            AND LOWER(first_name) = LOWER($2)
            AND LOWER(last_name) = LOWER($3)
        `,
        [data.identifier, data.firstName, data.lastName]
    );

    if (registryResult.rowCount === 0) {
        throw new RegistrationError('PERSON_NOT_FOUND'); // Rzucenie błędu, jeśli osoba nie została znaleziona w rejestrze
    }

    // Sprawdzenie, czy użytkownik już istnieje w bazie danych (tabela users)
    const emailResult = await pool.query(
        `
        SELECT id
        FROM users
        WHERE LOWER(email) = LOWER($1)
        `,
        [data.email]
    );

    if (emailResult.rowCount !== 0) { 
        throw new RegistrationError('EMAIL_TAKEN');
    }

    // Sprawdzenie, czy użytkownik już istnieje w bazie danych (tabela students lub lecturers)
    const profileResult = await pool.query(
        `
        SELECT id
        FROM ${profileTable}
        WHERE ${identofoerColumn} = $1
        `,
        [data.identifier]
    );

    if (profileResult.rowCount !== 0) {
        throw new RegistrationError('ALREADY_REGISTERED');
    }
};