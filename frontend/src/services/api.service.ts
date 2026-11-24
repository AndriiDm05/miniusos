
const API_URL = import.meta.env.VITE_API_URL; // Stała przechowująca adres URL API, pobierany z zmiennych środowiskowych lub ustawiany na domyślny localhost

// Interfejs definiujący opcje żądania API, rozszerzający standardowy interfejs RequestInit
interface ApiRequestOptions extends RequestInit {
    skipAuthCheck?: boolean;
}

// Funkcja pomocnicza do wykonywania żądań API z obsługą ciasteczek i sprawdzaniem autoryzacji
export const apiFetch = async (
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<Response> => {
    const { skipAuthCheck = false, ...fetchOptions } = options; // Rozpakowanie opcji żądania, ustawienie domyślnej wartości skipAuthCheck na false

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        credentials: 'include',
    }); // Wykonanie żądania fetch z dołączonymi ciasteczkami (credentials: 'include')

    // Jeśli odpowiedź ma status 401 (Unauthorized) i nie pominięto sprawdzania autoryzacji, wywołaj zdarzenie 'auth:unauthorized'
    if (response.status === 401 && !skipAuthCheck) {
        window.dispatchEvent(new Event('auth:unauthorized'));
    }

    if (response.status === 401 && !skipAuthCheck) {
        window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return response; // Zwrócenie obiektu Response z żądania fetch
};
