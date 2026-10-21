import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

interface HeaderProps {
    onMenuClick: () => void;
}

// Header component that displays the application title, a menu button, and a language switcher.
export const Header = ({ onMenuClick }: HeaderProps) => { 
    const { t } = useTranslation();

    return (
        <header className={styles.header}>
            <button
                type="button"
                className={styles.menuButton}
                onClick={onMenuClick}
                aria-label={t('navigation.openMenu')}
            >
                ☰
            </button>

            <span className={styles.title}>MiniUSOS</span>

            <LanguageSwitcher />
        </header>
    );
};