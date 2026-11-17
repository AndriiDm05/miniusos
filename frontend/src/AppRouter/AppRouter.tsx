// Plik odpowiedzialny za konfigurację routingu w aplikacji React
import { Navigate, Route, Routes } from 'react-router';

import RegisterPage from '../pages/auth/RegisterPage';
import SuccessPage from '../pages/auth/SuccessPage';
import LoginPage from '../pages/auth/LoginPage';

import { AppLayout } from '../components/layout/AppLayout/AppLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import LecturerDashboardPage from '../pages/lecturer/LecturerDashboardPage';

export const AppRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/register/success"
                element={<SuccessPage />}
            />

            <Route
                element={
                    <ProtectedRoute allowedRoles={['STUDENT']} />
                }
            >
                <Route element={<AppLayout userRole="student" />}>
                    <Route
                        path="/student/dashboard"
                        element={<StudentDashboardPage />}
                    />
                </Route>
            </Route>

            <Route
                element={
                    <ProtectedRoute allowedRoles={['LECTURER']} />
                }
            >
                <Route element={<AppLayout userRole="lecturer" />}>
                    <Route
                        path="/lecturer/dashboard"
                        element={<LecturerDashboardPage />}
                    />
                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
};
