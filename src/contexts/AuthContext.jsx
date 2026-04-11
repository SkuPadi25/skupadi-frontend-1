import { createContext, useContext, useEffect, useState } from "react";
import { getLS, LS_KEYS, removeLS, saveUser } from "../utils/storage";
import { logout as logoutService } from "../services/authService";
import { isSchoolSetupComplete } from "../utils/schoolSetup";
import { createDemoUser, FRONTEND_ONLY_MODE } from "../utils/demoMode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user once on app start
  useEffect(() => {
    const storedUser = getLS(LS_KEYS.USER);
    if (storedUser) {
      if (isSchoolSetupComplete(storedUser)) {
        removeLS("skp_schoolSetupDraft");
      }
      setUser(storedUser);
    } else if (FRONTEND_ONLY_MODE) {
      const demoUser = createDemoUser();
      saveUser(demoUser);
      setUser(demoUser);
    }
    setLoading(false);
  }, []);

  // ✅ FIXED logout
  const signOut = async () => {
    await logoutService(); // clears tokens + storage
    setUser(null);         // clears context state
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
