import api from "./api";
import {
  saveAuthTokens,
  saveUser,
  getUser,
  getRefreshToken,
  clearAuth,
} from "../utils/storage";
import { createDemoUser, FRONTEND_ONLY_MODE } from "../utils/demoMode";

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
  const tokens = authPayload?.tokens || authPayload;
  const user = normalizeAuthenticatedUser(authPayload);

  if (!tokens?.accessToken || !user?.id) {
    throw new Error("Authentication failed: missing tokens or user");
  }

  saveAuthTokens(tokens);
  if (user?.id) {
  saveUser(user);
}

  return {
    ...authPayload,
    user,
  };
};

const persistDemoSession = (userOverrides = {}, tokenSuffix = "demo") => {
  const user = createDemoUser(userOverrides);

  saveAuthTokens({
    accessToken: `frontend-only-access-${tokenSuffix}`,
    refreshToken: `frontend-only-refresh-${tokenSuffix}`,
  });
  saveUser(user);

  return {
    user,
    tokens: {
      accessToken: `frontend-only-access-${tokenSuffix}`,
      refreshToken: `frontend-only-refresh-${tokenSuffix}`,
    },
  };
};

export const register = async (payload) => {
  if (FRONTEND_ONLY_MODE) {
    return persistDemoSession({
      firstName: payload?.fullName?.split(" ")?.[0] || "Demo",
      lastName: payload?.fullName?.split(" ")?.slice(1)?.join(" ") || "Admin",
      email: payload?.email || "demo@skupadi.app",
      phone: payload?.phoneNumber || payload?.phone || "+2348012345678",
      setup: {
        currentStep: 1,
        completed: false,
      },
      schoolSetupCompleted: false,
      schoolSetupStep: 1,
    }, "register");
  }

  const res = await api.post("/auth/register", payload);
  return persistAuthenticatedSession(res.data);
};

export const login = async (payload) => {
  if (FRONTEND_ONLY_MODE) {
    return persistDemoSession({
      email: payload?.email || "demo@skupadi.app",
      phone: payload?.phone || "+2348012345678",
    }, "login");
  }

  const res = await api.post("/auth/login", payload);
  return persistAuthenticatedSession(res.data);
};

export const completeOnboarding = async (payload) => {
  if (FRONTEND_ONLY_MODE) {
    return persistDemoSession({
      firstName: payload?.fullName?.split(" ")?.[0] || "Demo",
      lastName: payload?.fullName?.split(" ")?.slice(1)?.join(" ") || "Admin",
      email: payload?.email || "demo@skupadi.app",
      phone: payload?.phone || "+2348012345678",
      setup: {
        currentStep: 6,
        completed: true,
      },
      schoolSetupCompleted: true,
      schoolSetupStep: 6,
    }, "owner-info").user;
  }

  const res = await api.post("/auth/register/owner-info", payload);
  return persistAuthenticatedSession(res.data).user;
};

export const loadSession = async () => {
  if (FRONTEND_ONLY_MODE) {
    const user = getUser() || createDemoUser();
    saveUser(user);
    return user;
  }

  const res = await api.get("/auth/me");
  const payload = unwrapAuthPayload(res.data);
  const user = normalizeAuthenticatedUser(payload) || payload;
  saveUser(user);
  return user;
};

export const logout = async () => {
  if (FRONTEND_ONLY_MODE) {
    clearAuth();
    return;
  }

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
