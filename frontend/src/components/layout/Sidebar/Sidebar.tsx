import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from './Sidebar.module.css';

import type { UserRole } from '../../../types/userRole';

interface SidebarProps {
    userRole: UserRole;
    onNavigate?: () => void;
}

// Sidebar component that displays navigation links based on the user's role (student or lecturer).
export const Sidebar = ({ userRole, onNavigate }: SidebarProps) => { 
    const { t } = useTranslation();

    const studentLinks = [
        { path: '/student', label: t('navigation.dashboard') },
        { path: '/student/courses', label: t('navigation.courses') },
        { path: '/student/grades', label: t('navigation.grades') },
        { path: '/student/exams', label: t('navigation.exams') },
        { path: '/student/messages', label: t('navigation.messages') },
    ];

    const lecturerLinks = [
        { path: '/lecturer', label: t('navigation.dashboard') },
        { path: '/lecturer/courses', label: t('navigation.courses') },
        { path: '/lecturer/students', label: t('navigation.students') },
        { path: '/lecturer/notifications', label: t('navigation.notifications') },
    ];

    const links = userRole === 'student' ? studentLinks : lecturerLinks;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>MiniUSOS</div>

            <nav aria-label={t('navigation.main')}>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.active : ''}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};