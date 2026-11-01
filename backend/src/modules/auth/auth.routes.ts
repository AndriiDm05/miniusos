import { Router } from 'express'; // Import klasy Router z biblioteki express do tworzenia tras
import { registerSchema } from './auth.schema.js'; // Import schematu walidacji danych rejestracji użytkownika
import { registerUser, RegistrationError } from './auth.service.js'; // Import funkcji rejestracji użytkownika oraz klasy błędu rejestracji

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