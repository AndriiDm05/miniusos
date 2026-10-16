import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';

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

            <div style={{ maxWidth: '400px', display: 'grid', gap: '16px' }}>
                <Input
                    label="E-mail"
                    type="email"
                    placeholder="student@example.com"
                    required
                />

                <Input
                    label="Hasło"
                    type="password"
                    placeholder="Wprowadź hasło"
                    required
                />

                <Input
                    label="E-mail z błędem"
                    type="email"
                    error="Nieprawidłowy adres e-mail"
                />
            </div>
        </main>
    );
};

export default LoginPage;