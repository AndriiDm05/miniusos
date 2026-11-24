// Plik umożliwiający zarządzanie kontekstem uwierzytelnienia w aplikacji React
import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import {
    getCurrentUser,
    logoutUser,
} from '../services/auth.service';

import type { AuthenticatedUser } from '../types/types';

// Interfejs reprezentujący uwierzytelnionego użytkownika w kontekście aplikacji
interface AuthContextType {
    user: AuthenticatedUser | null;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
}

// Tworzenie kontekstu uwierzytelnienia z typem AuthContextType
export const AuthContext = createContext<AuthContextType | undefined>(undefined); 

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthenticatedUser | null>(null); // Stan przechowujący aktualnie zalogowanego użytkownika
    const [isLoading, setIsLoading] = useState(true); // Stan określający, czy dane użytkownika są w trakcie ładowania

    const refreshUser = useCallback(async () => {
        const currentUser = await getCurrentUser(); // Pobranie aktualnie zalogowanego użytkownika z serwera
        setUser(currentUser);
    }, []); // Funkcja odświeżająca dane aktualnie zalogowanego użytkownika

    const logout = useCallback(async () => {
        await logoutUser();
        setUser(null); // Wylogowanie użytkownika poprzez ustawienie stanu user na null
    }, []); // Funkcja wylogowująca użytkownika

    useEffect(() => {
        let active = true; // Flaga określająca, czy komponent jest aktywny (zamontowany) w celu uniknięcia aktualizacji stanu po odmontowaniu

        async function initializeAuth() {
            try {
                const currentUser = await getCurrentUser();

                if (active) {
                    setUser(currentUser); // Ustawienie stanu user na aktualnie zalogowanego użytkownika
                }
            } catch (error) {
                console.error('Failed to initialize authentication:', error);
            } finally {
                if (active) {
                    setIsLoading(false); // Ustawienie stanu isLoading na false po zakończeniu ładowania
                }
            }
        }

        void initializeAuth(); // Wywołanie funkcji inicjalizującej uwierzytelnienie użytkownika

        return () => {
            active = false; // Ustawienie flagi active na false przy odmontowaniu komponentu, aby uniknąć aktualizacji stanu po odmontowaniu
        };
    }, []);

    // Nasłuchiwanie zdarzenia 'auth:unauthorized' w celu wylogowania użytkownika, jeśli token dostępu jest nieważny lub wygasł
    useEffect(() => {
        const handleUnauthorized = () => {
            setUser(null);
        }; // Usuwa dane użytkownika ze stanu React.

        window.addEventListener(
            'auth:unauthorized',
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                'auth:unauthorized',
                handleUnauthorized
            );
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                refreshUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}