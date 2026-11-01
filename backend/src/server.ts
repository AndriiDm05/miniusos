import express from 'express'; // Import express biblioteki dla tworzenia REST API
import cors from 'cors'; // Import biblioteki cors dla obsługi żądań z różnych domen
import dotenv from 'dotenv'; // Import biblioteki dotenv dla obsługi zmiennych środowiskowych

import { pool } from './config/database'; // Import instancji puli połączeń do bazy danych PostgreSQL

import { authRouter } from './modules/auth/auth.routes.js';

dotenv.config(); // Wczytanie zmiennych środowiskowych z pliku .env

const app = express(); // Tworzenie instancji aplikacji express

const PORT = Number(process.env.PORT) || 3000; // Ustawienie portu z zmiennej środowiskowej lub domyślnie na 3000

// Ustawienie adresu frontendu z zmiennej środowiskowej lub domyślnie na localhost:5173
const FRONTEND_URL =
    process.env.FRONTEND_URL || 'http://localhost:5173'; 

// Konfiguracja CORS dla aplikacji express
app.use(cors({
    origin: FRONTEND_URL, // Zezwolenie na żądania z określonego adresu frontendu
}));

app.use(express.json()); // Middleware do parsowania JSON w żądaniach

// Endpoint zdrowotności API, zwracający status aplikacji
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'MiniUSOS API is running',
    });
});

// Endpoint zdrowotności bazy danych, sprawdzający połączenie z bazą danych PostgreSQL
app.get('/api/health/db', async (_req, res) => {
    try {
        const result = await pool.query<{
            database: string;
            server_time: Date;
        }>(`
            SELECT
                current_database() AS database,
                NOW() AS server_time 
        `);

        res.status(200).json({
            status: 'ok',
            message: result.rows[0].database,
            server_time: result.rows[0].server_time,
        });
    } catch (error) {
        console.error('Database health check failed:', error);

        res.status(503).json({
            status: 'error',
            message: 'Database connection failed',
        });
    }
});

// Rejestracja routera dla modułu autoryzacji pod ścieżką /api/auth
app.use('/api/auth', authRouter);

// Uruchomienie serwera na określonym porcie
app.listen(PORT, () => {
    console.log(`MiniUSOS API running on http://localhost:${PORT}`);
});