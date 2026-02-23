import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user && !localStorage.getItem('userInfo')) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
