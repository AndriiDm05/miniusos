import { registerSchema } from './auth.schema.js'; // Import schematu walidacji danych registracji użytkownika

// Test walidacji danych rejestracji użytkownika przy użyciu schematu registerSchema
const validStudent = {
    role: 'STUDENT',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    identifier: '123456',
    password: 'TestPassword123',
};

const validResult = registerSchema.safeParse(validStudent); 

console.log('Valid student:', validResult.success); // Oczekiwany wynik: true

const invalidStudent = {
    ...validStudent, // Kopiowanie poprawnych danych studenta
    identifier: '123', // Niepoprawny identyfikator (mniej niż 6 cyfr)
    email: 'invalid-email', // Niepoprawny adres email
}

const invalidResult = registerSchema.safeParse(invalidStudent);

console.log('Invalid student:', invalidResult.success); // Oczekiwany wynik: false

// Wyświetlenie szczegółowych informacji o błędach walidacji dla niepoprawnych danych
if (!invalidResult.success) {
    console.log(
        JSON.stringify(
            invalidResult.error.flatten(),
            null,
            2
        )
    );
}