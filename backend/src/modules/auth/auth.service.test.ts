import { verifyRegistration, RegistrationError } from './auth.service.js'; // Import funkcji weryfikującej rejestrację użytkownika oraz klasy błędu rejestracji
import type { RegisterInput } from './auth.schema.js'; // Import typu danych wejściowych dla rejestracji użytkownika

async function testRegistration(label: string, data: RegisterInput) { 
    try {
        await verifyRegistration(data); // Wywołanie funkcji weryfikującej rejestrację użytkownika z danymi wejściowymi
        console.log(`${label}: OK`);
    } catch (error) {
        if (error instanceof RegistrationError) {
            console.log(`${label}: ${error.code}`);
        } else {
            console.error(`${label}: Unexpected error`, error);
        }
    }
}

// Funkcja główna testująca weryfikację rejestracji użytkownika
async function main() {
    // Testowanie weryfikacji rejestracji użytkownika z poprawnymi danymi studenta
    const student: RegisterInput = {
        role: 'STUDENT',
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        identifier: '123456',
        password: 'TestPassword123',
    };

    // Testowanie weryfikacji rejestracji użytkownika z poprawnymi danymi studenta oraz niepoprawnymi danymi (nieistniejący identyfikator)
    await testRegistration('Valid student', student);

    await testRegistration('Unknown student', {
        ...student,
        identifier: '999999', // Niepoprawny identyfikator (nie istnieje w rejestrze)
    });

    await testRegistration('Wrong surname', {
        ...student,
        lastName: 'Nowak',
    });

    await testRegistration('Valid lecturer', {
        role: 'LECTURER',
        firstName: 'Tomasz',
        lastName: 'Kowalczyk',
        email: 'tomasz.kowalczyk@example.com',
        identifier: '100001',
        password: 'TestPassword123',
    });
}

// Wywołanie funkcji głównej testującej weryfikację rejestracji użytkownika
main()
    .catch(console.error) // Obsługa błędów podczas wywoływania funkcji głównej
    .finally(async () => { // Zakończenie działania programu i zamknięcie połączenia z bazą danych
        const { pool } = await import('../../config/database.js');
        await pool.end();
    });