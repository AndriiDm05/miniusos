export type UserRole = 'STUDENT' | 'LECTURER';

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: UserRole;
}