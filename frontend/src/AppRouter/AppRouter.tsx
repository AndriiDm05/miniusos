import { Navigate, Route, Routes } from 'react-router';

import RegisterPage from '../pages/auth/RegisterPage';
import LoginPage from '../pages/auth/LoginPage';
import { AppLayout } from '../components/layout/AppLayout/AppLayout';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import LecturerDashboardPage from '../pages/lecturer/LecturerDashboardPage';

// Komponent AppRouter definiujący strukturę routingu aplikacji
export const AppRouter = () => { 
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />\
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<AppLayout userRole="student" />}>
                <Route path="/student" element={<StudentDashboardPage />} />
            </Route>

            <Route element={<AppLayout userRole="lecturer" />}>
                <Route path="/lecturer" element={<LecturerDashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};