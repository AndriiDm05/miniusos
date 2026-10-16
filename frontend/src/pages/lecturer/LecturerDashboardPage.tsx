import { useTranslation } from 'react-i18next';

const LecturerDashboardPage = () => { 
    const { t } = useTranslation();

    return (
        <main>
            <h1>{t('lecturer.dashboard')}</h1>
            <p>MiniUSOS - Lecturer</p>
        </main>
    );
};

export default LecturerDashboardPage;