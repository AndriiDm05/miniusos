import { useState } from 'react';
import { Outlet } from 'react-router';

import { Sidebar } from '../../layout/Sidebar/Sidebar';
import { Header } from '../../layout/Header/Header';

import styles from './AppLayout.module.css';

import type { UserRole } from '../../../types/userRole';

interface AppLayoutProps {
    userRole: UserRole;
}

// AppLayout component that provides a consistent layout for the application, including a sidebar, header, and main content area.
export const AppLayout = ({ userRole }: AppLayoutProps) => { 
    
    // State to track whether the sidebar menu is open or closed.
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    // Function to toggle the sidebar menu open or closed.
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

