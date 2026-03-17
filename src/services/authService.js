import api from "./api";
import {
  saveAuthTokens,
  saveUser,
  getUser,
  getRefreshToken,
  clearAuth,
} from "../utils/storage";

export const login = async (payload) => {
  const res = await api.post("/auth/login", payload);

  const { tokens, user } = res.data;

  if (!tokens?.accessToken) {
    throw new Error("No access token returned");
  }

  saveAuthTokens(tokens);
  saveUser(user);

  return res.data;
};

export const completeOnboarding = async (payload) => {
  const res = await api.post("/auth/register/owner-info", payload);
  saveAuthTokens(res.data.tokens);
  saveUser(res.data.user);
  return res.data.user;
};

export const loadSession = async () => {
  const res = await api.get("/auth/me");
  saveUser(res.data);
  return res.data;
};

export const logout = async () => {
  try {
    const user = getUser();
    const refreshToken = getRefreshToken();

    if (user?.id) {
      await api.post("/auth/logout", {
        userId: user.id,
        refreshToken,
      });
    }
  } catch {
    // Ignore backend failure and still clear frontend auth state.
  } finally {
    clearAuth();
  }
};
