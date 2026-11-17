import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

import { Sidebar } from '../../layout/Sidebar/Sidebar';
import { Header } from '../../layout/Header/Header';

import { useAuth } from '../../../hooks/useAuth';

import styles from './AppLayout.module.css';

import type { UserRole } from '../../../types/types';

interface AppLayoutProps {
    userRole: UserRole;
}

// Komponent AppLayout zapewniający spójny układ aplikacji, w tym pasek boczny, nagłówek i główny obszar treści.
export const AppLayout = ({ userRole }: AppLayoutProps) => { 
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    // Stan określający, czy menu paska bocznego jest otwarte, czy zamknięte.
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    // Funkcja przełączająca otwarcie lub zamknięcie menu paska bocznego.
    const handleMenuToggle = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        } else {
            setIsMenuOpen(true);
        }
    };

    // Funkcja obsługująca wylogowanie użytkownika i przekierowanie na stronę logowania.
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className={styles.layout}>
            <div
                className={`${styles.sidebarWrapper} ${
                    isMenuOpen ? styles.open : ''
                }`}
            >
                <Sidebar
                    userRole={userRole}
                    onNavigate={handleMenuToggle}
                    onLogout={handleLogout}
                />
            </div>

            {isMenuOpen && (
                <button
                    type="button"
                    className={styles.overlay}
                    onClick={handleMenuToggle}
                    aria-label="Close menu"
                />
            )}

            <div className={styles.mainArea}>
                <Header onMenuClick={handleMenuToggle} />

                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
