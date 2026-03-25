import api from "./api";
import {
  saveAuthTokens,
  saveUser,
  getUser,
  getRefreshToken,
  clearAuth,
} from "../utils/storage";

const unwrapAuthPayload = (payload) => payload?.data || payload;

const normalizeSetup = (authPayload) => {
  const setup = authPayload?.setup || authPayload?.user?.setup || null;

  if (!setup) return null;

  return {
    ...setup,
    currentStep:
      typeof setup?.currentStep === "number"
        ? setup.currentStep
        : setup?.currentStep != null
          ? Number(setup.currentStep)
          : null,
  };
};

const normalizeAuthenticatedUser = (authPayload) => {
  const baseUser = authPayload?.user || null;
  const school = authPayload?.school || null;
  const setup = normalizeSetup(authPayload);

  if (!baseUser) return null;

  return {
    ...baseUser,
    schoolId: baseUser?.schoolId || school?.id || null,
    school: baseUser?.school || school || null,
    setup,
    schoolSetupCompleted:
      typeof setup?.completed === "boolean"
        ? setup.completed
        : baseUser?.schoolSetupCompleted,
    schoolSetupStep:
      setup?.currentStep ??
      baseUser?.schoolSetupStep ??
      baseUser?.schoolSetup?.step ??
      null,
  };
};

const persistAuthenticatedSession = (payload) => {
  const authPayload = unwrapAuthPayload(payload);
  const { tokens } = authPayload || {};
  const user = normalizeAuthenticatedUser(authPayload);

  if (!tokens?.accessToken || !user) {
    throw new Error("Registration succeeded without an authenticated session");
  }

  saveAuthTokens(tokens);
  saveUser(user);

  return authPayload;
};

export const register = async (payload) => {
  const res = await api.post("/auth/register", payload);
  return persistAuthenticatedSession(res.data);
};

export const login = async (payload) => {
  const res = await api.post("/auth/login", payload);
  return persistAuthenticatedSession(res.data);
};

export const completeOnboarding = async (payload) => {
  const res = await api.post("/auth/register/owner-info", payload);
  return persistAuthenticatedSession(res.data).user;
};

export const loadSession = async () => {
  const res = await api.get("/auth/me");
  const payload = unwrapAuthPayload(res.data);
  const user = normalizeAuthenticatedUser(payload) || payload;
  saveUser(user);
  return user;
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
