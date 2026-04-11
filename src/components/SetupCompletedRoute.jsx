import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isSchoolSetupComplete } from "../utils/schoolSetup";
import { FRONTEND_ONLY_MODE } from "../utils/demoMode";

const SetupCompletedRoute = ({ children }) => {
  if (FRONTEND_ONLY_MODE) {
    return children;
  }

  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/school-login" replace />;
  }

  if (!isSchoolSetupComplete(user)) {
    return <Navigate to="/school-setup" replace />;
  }

  return children;
};

export default SetupCompletedRoute;
