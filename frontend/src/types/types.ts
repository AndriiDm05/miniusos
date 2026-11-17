export type UserRole = 'student' | 'lecturer';

export type UserRoleUppercase = 'STUDENT' | 'LECTURER';

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: UserRoleUppercase;
}
