import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';

const LoginPage = () => {
    const { t } = useTranslation();

    return (
        <main>
            <h1>MiniUSOS</h1>
            <LanguageSwitcher />

            <section>
                <h2>{t('auth.login')}</h2>
                <p>{t('auth.description')}</p>
            </section>
        </main>
    );
};

export default LoginPage;