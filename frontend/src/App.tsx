
import { Navigate, Route, Routes } from 'react-router';

import LoginPage from './pages/auth/LoginPage';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import LecturerDashboardPage from './pages/lecturer/LecturerDashboardPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/student"
                element={<StudentDashboardPage />}
            />

            <Route
                path="/lecturer"
                element={<LecturerDashboardPage />}
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
