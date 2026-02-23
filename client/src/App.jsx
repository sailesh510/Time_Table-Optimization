import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import FacultyManage from './pages/FacultyManage';
import SubjectManage from './pages/SubjectManage';
import TimetableCreate from './pages/TimetableCreate';
import TimetableView from './pages/TimetableView';
import Reports from './pages/Reports';
import ClashAlerts from './pages/ClashAlerts';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './App.css';

const AppContent = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -20 }
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5
    };

    return (
        <div className={`app-container ${user ? '' : 'auth-mode'}`}>
            {user && <Sidebar isOpen={isSidebarOpen} />}
            <div className="main-content">
                {user && <Header toggleSidebar={toggleSidebar} />}
                <div className="content-area">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            <Routes location={location} key={location.pathname}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                <Route path="/faculty" element={<ProtectedRoute><FacultyManage /></ProtectedRoute>} />
                                <Route path="/subjects" element={<ProtectedRoute><SubjectManage /></ProtectedRoute>} />
                                <Route path="/create-timetable" element={<ProtectedRoute><TimetableCreate /></ProtectedRoute>} />
                                <Route path="/view-timetable" element={<ProtectedRoute><TimetableView /></ProtectedRoute>} />
                                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                                <Route path="/clash-alerts" element={<ProtectedRoute><ClashAlerts /></ProtectedRoute>} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
