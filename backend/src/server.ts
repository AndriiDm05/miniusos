import express from 'express'; // Import express biblioteki dla tworzenia REST API
import cors from 'cors'; // Import biblioteki cors dla obsługi żądań z różnych domen
import dotenv from 'dotenv'; // Import biblioteki dotenv dla obsługi zmiennych środowiskowych

dotenv.config(); // Inicjalizacja konfiguracji zmiennych środowiskowych

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

// Uruchomienie serwera na określonym porcie
app.listen(PORT, () => {
    console.log(`MiniUSOS API running on http://localhost:${PORT}`);
});