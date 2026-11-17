// Ten plik definiuje middleware do uwierzytelniania użytkowników w aplikacji backendowej. Middleware ten sprawdza, czy użytkownik jest zalogowany i posiada ważny token dostępu (access token) w ciasteczkach żądania HTTP.
import type { RequestHandler } from 'express'; // Import typu RequestHandler z biblioteki express, który reprezentuje funkcję obsługi żądania HTTP
import { JsonWebTokenError } from 'jsonwebtoken'; // Import klasy JsonWebTokenError z biblioteki jsonwebtoken, która reprezentuje błąd związany z tokenem JWT
import { pool } from '../../config/database.js'; // Import instancji puli połączeń do bazy danych PostgreSQL
import { verifyAccessToken } from './token.service.js'; // Import funkcji weryfikującej token dostępu (access token) z modułu autoryzacji
import type { UserRole, AuthenticatedUser } from '../../types/types.js';

export const authenticate: RequestHandler = async (req, res, next) => { 
    const token = req.cookies['access_token']; // Pobranie tokenu dostępu (access token) z ciasteczek w żądaniu HTTP

    if (!token) {
        res.status(401).json({ message: 'Authentication required' }); // Zwrócenie błędu 401, jeśli token dostępu nie został przesłany
        return;
    }

    try {
        const payload = verifyAccessToken(token); // Weryfikacja tokenu dostępu i pobranie danych zawartych w tokenie

        const result = await pool.query<AuthenticatedUser>(
            `SELECT id, email, role
            FROM users
            WHERE id = $1`,
            [payload.userId]
        ); // Pobranie danych użytkownika z bazy danych na podstawie identyfikatora użytkownika zawartego w tokenie

        const user = result.rows[0]; // Pobranie pierwszego wiersza z wyniku zapytania, który zawiera dane użytkownika

        // Sprawdzenie, czy użytkownik istnieje i czy jego rola zgadza się z rolą zawartą w tokenie
        if (!user || user.role !== payload.role) {
            res.status(401).json({
                message: 'Invalid session',
            });
            return;
        }

        res.locals.user = user; // Przechowywanie danych użytkownika w obiekcie res.locals, aby były dostępne w dalszych middleware'ach i trasach

        next(); // Wywołanie funkcji next(), aby przejść do kolejnego middleware'a lub trasy w łańcuchu obsługi żądania
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                message: 'Invalid or expired session',
            });
            return;
        }

        console.error('Authentication error:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Funkcja middleware do autoryzacji użytkowników na podstawie ich roli. Sprawdza, czy zalogowany użytkownik posiada jedną z dozwolonych ról.
export const authorizeRole = (...allowedRoles: UserRole[]): RequestHandler => { 
    return (req, res, next) => { 
        const user = res.locals.user as AuthenticatedUser | undefined; // Pobranie danych użytkownika z obiektu res.locals

        if (!user) {
            res.status(401).json({ message: 'Authentication required' }); // Zwrócenie błędu 401, jeśli użytkownik nie jest zalogowany
            return;
        }

        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({ message: 'Access denied' }); // Zwrócenie błędu 403, jeśli użytkownik nie ma odpowiednich uprawnień
            return;
        }

        next(); // Wywołanie funkcji next(), aby przejść do kolejnego middleware'a lub trasy w łańcuchu obsługi żądania
    };
};