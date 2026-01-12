// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null; // or spinner

    if (!user) {
        return <Navigate to="/school-login" replace />;
    }

    return children;
};

export default ProtectedRoute;
