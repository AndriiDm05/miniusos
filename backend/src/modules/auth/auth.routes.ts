import { Router } from 'express'; // Import klasy Router z biblioteki express do tworzenia tras
import { registerSchema, loginSchema } from './auth.schema.js'; // Import schematu walidacji danych rejestracji/logowania użytkownika
import {
    registerUser,
    RegistrationError,
    verifyLogin,
    InvalidCredentialsError
} from './auth.service.js'; // Import funkcji rejestracji/logowania użytkownika oraz klasy błędu rejestracji/logowania
import { generateAccessToken } from './token.service.js'; // Import funkcji generowania tokenu dostępu (access token)
import { authenticate, authorizeRole } from '../../middleware/auth.middleware.js'; // Import middleware do uwierzytelniania użytkowników
import { loginRateLimiter } from '../../middleware/rateLimit.middleware.js'; // Import middleware do ograniczenia liczby nieudanych prób logowania (Rate Limiting)

export const authRouter = Router(); // Utworzenie instancji routera dla modułu autoryzacji

// Endpoint rejestracji użytkownika
authRouter.post('/register', async (req, res) => {
    const result = registerSchema.safeParse(req.body); // Walidacja danych wejściowych przy użyciu schematu registerSchema

    if (!result.success) { 
        res.status(400).json({
            message: 'Invalid registration data',
            errors: result.error.flatten().fieldErrors
        }); // Zwrócenie błędu walidacji, jeśli dane wejściowe są niepoprawne
        return;
    }

    try {
        const userId = await registerUser(result.data); // Wywołanie funkcji rejestracji użytkownika z poprawnymi danymi wejściowymi

        res.status(201).json({ message: 'User registered successfully', userId }); // Zwrócenie ID nowo utworzonego użytkownika w odpowiedzi
    } catch (error) {
        if (error instanceof RegistrationError) {
            res.status(400).json({ message: 'Registration could not be completed' });
            return;
        } 
        // Obsługa błędu unikalności (np. duplikat adresu email) w bazie danych PostgreSQL
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505'
        ) {
            res.status(409).json({
                message: 'Registration could not be completed',
            });
            return;
        }

        console.error('Registration failed:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
});

// Endpoint logowania użytkownika
authRouter.post('/login', loginRateLimiter, async (req, res) => {
    const result = loginSchema.safeParse(req.body); // Walidacja danych wejściowych przy użyciu schematu loginSchema

    if (!result.success) { 
        res.status(400).json({
            message: 'Invalid login data',
            errors: result.error.flatten().fieldErrors
        }); // Zwrócenie błędu walidacji, jeśli dane wejściowe są niepoprawne
        return;
    }

    try {
        const user = await verifyLogin(result.data); // Wywołanie funkcji weryfikacji logowania użytkownika z poprawnymi danymi wejściowymi

        const token = generateAccessToken({
            userId: user.id,
            role: user.role
        }); // Generowanie tokenu dostępu (access token) dla zalogowanego użytkownika

        res.cookie('access_token', token, {
            httpOnly: true, // Ustawienie flagi httpOnly, aby token nie był dostępny w JavaScript po stronie klienta
            secure: process.env.NODE_ENV === 'production', // Ustawienie flagi secure tylko w środowisku produkcyjnym
            sameSite: 'strict', // Ustawienie flagi sameSite na 'strict', aby ograniczyć wysyłanie ciasteczek tylko do tej samej domeny
            maxAge: 60 * 60 * 1000, // Ustawienie czasu wygaśnięcia tokenu na 1 godzinę (w milisekundach),
            path: '/' // Ustawienie ścieżki, dla której ciasteczko jest dostępne (w tym przypadku dla całej domeny)
        });

        res.status(200).json({
            message: 'Login successful',
            user
        }); // Zwrócenie tokenu dostępu w odpowiedzi
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            res.status(401).json({
                message: 'Invalid email or password',
            });
            return;
        }

        console.error('Login failed:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
});

// Endpoint sprawdzający aktualnie zalogowanego użytkownika
authRouter.get('/me', authenticate, (req, res) => {
    res.status(200).json({
        user: res.locals.user,
    });
});

// Endpoint wylogowania użytkownika
authRouter.post('/logout', (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    res.status(200).json({
        message: 'Logout successful',
    });
});

// Endpoint dostępny tylko dla użytkowników z rolą STUDENT
authRouter.get('/student-only', authenticate, authorizeRole('STUDENT'), (req, res) => { 
    res.status(200).json({
        message: 'Welcome, student!',
    });
});

// Endpoint dostępny tylko dla użytkowników z rolą LECTURER
authRouter.get('/lecturer-only', authenticate, authorizeRole('LECTURER'), (req, res) => {
    res.status(200).json({
        message: 'Welcome, lecturer!',
    });
});