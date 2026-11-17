import { generateAccessToken, verifyAccessToken } from './token.service'; // Import funkcji generowania i weryfikacji tokenów JWT

// Generowanie tokenu JWT dla użytkownika o ID 123 i roli STUDENT
const token = generateAccessToken({
    userId: '123e4567-e89b-12d3-a456-426614174000',
    role: 'STUDENT'
}); 

console.log('Generated token:', token);

const payload = verifyAccessToken(token); // Weryfikacja tokenu JWT i pobranie danych zawartych w tokenie

console.log('Verified payload:', payload);

// Próba weryfikacji nieprawidłowego tokenu JWT, co powinno spowodować błąd
try {
    verifyAccessToken(token + 'invalid');
    console.error('Invalid token was accepted!');
} catch {
    console.log('Invalid token: rejected');
}