import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import type { UserRoleUppercase } from '../types/types';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
    allowedRoles: UserRoleUppercase[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) { 
    const { t } = useTranslation(); // Hook do obsługi tłumaczeń w aplikacji
    const { user, isLoading } = useAuth(); // Pobranie aktualnie zalogowanego użytkownika z kontekstu uwierzytelnienia

    if (isLoading) {
        return <p>{t('checking_session')}</p>; // Wyświetlenie komunikatu o sprawdzaniu sesji, jeśli dane użytkownika są w trakcie ładowania
    }

    if (!user) {
        return <Navigate to="/login" replace />; // Przekierowanie do strony logowania, jeśli użytkownik nie jest zalogowany
    }

    // Sprawdzenie, czy rola użytkownika jest dozwolona dla danej trasy
    if (!allowedRoles.includes(user.role)) {
        return (
            <Navigate
                to={
                    user.role === 'STUDENT'
                        ? '/student/dashboard'
                        : '/lecturer/dashboard'
                }
                replace
            />
        );
    }

    return <Outlet />; // Renderowanie komponentu Outlet, który reprezentuje zawartość chronionej trasy, jeśli użytkownik jest zalogowany i ma odpowiednią rolę
}