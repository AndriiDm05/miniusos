import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

interface HeaderProps {
    onMenuClick: () => void;
}

// Komponent nagłówka wyświetlający tytuł aplikacji, przycisk menu i przełącznik języka.
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