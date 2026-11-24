// Plik służy do ochrony przed atakami CSRF (Cross-Site Request Forgery).
import type { RequestHandler } from 'express';

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

// Funkcja middleware do ochrony przed atakami CSRF. Sprawdza, czy żądanie pochodzi z zaufanego źródła i czy metoda HTTP jest bezpieczna.
export const csrfProtection = (
    allowedOrigin: string
): RequestHandler => {
    return (req, res, next) => {
        // Jeśli metoda HTTP jest bezpieczna (GET, HEAD, OPTIONS), przechodzimy do kolejnego middleware'a lub trasy.
        if (SAFE_METHODS.includes(req.method)) {
            next();
            return;
        }

        const origin = req.headers.origin;

        // Sprawdzamy, czy żądanie pochodzi z zaufanego źródła.
        if (!origin || origin !== allowedOrigin) {
            res.status(403).json({
                message: 'CSRF validation failed',
            });
            return;
        }

        next();
    };
};
