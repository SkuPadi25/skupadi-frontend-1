// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FRONTEND_ONLY_MODE } from "../utils/demoMode";

const ProtectedRoute = ({ children }) => {
    if (FRONTEND_ONLY_MODE) {
        return children;
    }

    const { user, loading } = useAuth();

    if (loading) return null; // or spinner

    if (!user) {
        return <Navigate to="/school-login" replace />;
    }

    return children;
};

export default ProtectedRoute;
