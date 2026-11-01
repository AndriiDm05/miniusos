import dotenv from 'dotenv'; // Import biblioteki dotenv dla obsługi zmiennych środowiskowych
import { Pool } from 'pg'; // Import biblioteki pg dla obsługi bazy danych PostgreSQL

dotenv.config(); // Wczytanie zmiennych środowiskowych z pliku .env

const connectionString = process.env.DATABASE_URL; // Pobranie adresu bazy danych z zmiennej środowiskowej

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined'); // Rzucenie błędu, jeśli zmienna środowiskowa nie jest zdefiniowana
}

// Tworzenie instancji puli połączeń do bazy danych PostgreSQL
export const pool = new Pool({
    connectionString, // Ustawienie adresu bazy danych
});

// Obsługa błędów puli połączeń do bazy danych PostgreSQL
pool.on('error', (error) => { 
    console.error('Unexpected PostgreSQL pool error:', error);
});