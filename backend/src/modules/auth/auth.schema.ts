import { z } from 'zod'; // Import biblioteki zod dla walidacji danych

// Schemat walidacji danych logowania użytkownika
export const registerSchema = z.object({
    role: z.enum(['STUDENT', 'LECTURER']),

    firstName: z.string()
        .trim()
        .min(1, 'First name is required')
        .max(100, 'First name is too long'),
    
    lastName: z.string()
        .trim()
        .min(1, 'Last name is required')
        .max(100, 'Last name is too long'),
    
    email: z.email('Invalid email address')
        .trim()
        .toLowerCase()
        .max(255),
    
    identifier: z.string()
        .regex(/^\d{6}$/, 'Identifier must contain exactly 6 digits'),
    
    password: z.string()
        .min(8, 'Password must contain at least 8 characters'),
});

// Typ danych wejściowych dla rejestracji użytkownika, wywnioskowany z schematu walidacji
export type RegisterInput = z.infer<typeof registerSchema>;