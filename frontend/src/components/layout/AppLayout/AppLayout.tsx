import { useState } from 'react';
import { Outlet } from 'react-router';

import { Sidebar } from '../../layout/Sidebar/Sidebar';
import { Header } from '../../layout/Header/Header';

import styles from './AppLayout.module.css';

import type { UserRole } from '../../../types/userRole';

interface AppLayoutProps {
    userRole: UserRole;
}

// Komponent AppLayout zapewniający spójny układ aplikacji, w tym pasek boczny, nagłówek i główny obszar treści.
export const AppLayout = ({ userRole }: AppLayoutProps) => { 
    
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
