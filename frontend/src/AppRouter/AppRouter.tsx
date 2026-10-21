import { Navigate, Route, Routes } from 'react-router';

import LoginPage from '../pages/auth/LoginPage';
import { AppLayout } from '../components/layout/AppLayout/AppLayout';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import LecturerDashboardPage from '../pages/lecturer/LecturerDashboardPage';

// AppRouter component that defines the routing structure of the application
export const AppRouter = () => { 
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />

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