import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';

const RegisterPage = () => { 
    const { t } = useTranslation();

    return (
        <main>
            <header>
                <h1>MiniUSOS</h1>
                <LanguageSwitcher />
            </header>

            <section>
                <h2>{t('auth.register')}</h2>
                <p>{t('auth.registerDescription')}</p>

                <p>
                    {t('auth.alreadyHaveAccount')}{' '}
                    <Link to="/login">
                        {t('auth.signIn')}
                    </Link>
                </p>
            </section>
        </main>
        
    );
};

export default RegisterPage;