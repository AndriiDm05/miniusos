// Ograniczenie liczby nieudanych prób logowania (Rate Limiting) w celu ochrony przed atakami typu brute-force.
import { rateLimit } from 'express-rate-limit';

// Ograniczenie liczby nieudanych prób logowania.
export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minut
    limit: 10, // Maksymalnie 10 nieudanych prób logowania w ciągu 15 minut
    standardHeaders: 'draft-8', // Zwracanie nagłówków limitu w standardzie draft-8
    legacyHeaders: false, // Nie zwracanie starszych nagłówków
    skipSuccessfulRequests: true, // Pomijanie udanych żądań (nie liczymy ich do limitu)
    statusCode: 429, // Kod statusu HTTP dla przekroczenia limitu
    message: {
        message: 'Too many login attempts. Please try again later.',
    },
});
