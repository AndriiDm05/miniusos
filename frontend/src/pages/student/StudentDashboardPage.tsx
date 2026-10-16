import { useTranslation } from 'react-i18next';

const StudentDashboardPage = () => { 
    const { t } = useTranslation();

    return (
        <main>
            <h1>{t('student.dashboard')}</h1>
            <p>MiniUSOS - Student</p>
        </main>
    );
};

export default StudentDashboardPage;