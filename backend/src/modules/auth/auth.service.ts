import bcrypt from 'bcrypt'; // Import biblioteki bcrypt do hashowania haseł
import type { PoolClient } from 'pg'; // Import typu PoolClient z biblioteki pg do obsługi połączeń z bazą danych PostgreSQL

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

export async function verifyRegistration(
    data: RegisterInput
): Promise<void> {
    await verifyRegistrationWithClient(pool, data);
}

export async function verifyRegistrationWithClient(db: Pick<PoolClient, 'query'>, data: RegisterInput): Promise<void> { 
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
    const registryResult = await db.query(
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
    const profileResult = await db.query(
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

// Rejestracja użytkownika w bazie danych PostgreSQL, zwracająca ID nowo utworzonego użytkownika
export async function registerUser(data: RegisterInput): Promise<string> {
    const client: PoolClient = await pool.connect(); // Pobranie klienta połączenia z puli połączeń do bazy danych PostgreSQL

    try {
        await client.query('BEGIN'); // Rozpoczęcie transakcji w bazie danych

        await verifyRegistrationWithClient(client, data); // Wywołanie funkcji weryfikującej rejestrację użytkownika z danymi wejściowymi i klientem połączenia
    
        const passwordHash = await bcrypt.hash(data.password, 12); // Hashowanie hasła użytkownika z użyciem bcrypt
        
        // Wstawienie nowego użytkownika do tabeli users i pobranie jego ID
        const userResult = await client.query<{ id: string }>(
            `
            INSERT INTO users (email, password_hash, role)
            VALUES ($1, $2, $3)
            RETURNING id
            `,
            [data.email, passwordHash, data.role]
        );

        const userId = userResult.rows[0].id; // Pobranie ID nowo utworzonego użytkownika

        const profileTable = data.role === 'STUDENT'
            ? 'students'
            : 'lecturers'; // Wybór tabeli profilu w zależności od roli użytkownika
        
        const identofoerColumn = data.role === 'STUDENT'
            ? 'student_number'
            : 'employee_number'; // Wybór kolumny identyfikatora w zależności od roli użytkownika
        
        // Utworzenie profilu użytkownika w odpowiedniej tabeli (students lub lecturers)
        await client.query(
            `
            INSERT INTO ${profileTable}
                (user_id, first_name, last_name, ${identofoerColumn})
            VALUES ($1, $2, $3, $4)
            `,
            [userId, data.firstName, data.lastName, data.identifier]
        );

        await client.query('COMMIT'); // Zatwierdzenie transakcji w bazie danych

        return userId; // Zwrócenie ID nowo utworzonego użytkownika
    } catch (error) {
        await client.query('ROLLBACK'); // Wycofanie transakcji w przypadku błędu
        throw error; // Rzucenie błędu dalej
    } finally {
        client.release(); // Zwolnienie klienta połączenia z puli połączeń
    }
}