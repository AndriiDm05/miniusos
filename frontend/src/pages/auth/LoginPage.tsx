import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';
import { Button } from '../../components/ui/Button';

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

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button variant="primary">
                    Primary
                </Button>

                <Button variant="secondary">
                    Secondary
                </Button>

                <Button variant="danger">
                    Danger
                </Button>

                <Button isLoading>
                    Loading
                </Button>
            </div>
        </main>
    );
};

export default LoginPage;