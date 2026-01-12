import api from "./api";
import { saveAuthTokens, saveUser } from "../utils/storage";
import { clearAuth } from "../utils/storage";

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

/* COMPLETE ONBOARDING */
export const completeOnboarding = async (payload) => {
    const res = await api.post("/auth/register/owner-info", payload);
    saveAuthTokens(res.data.tokens);
    saveUser(res.data.user);
    return res.data.user;
};

/* LOAD SESSION */
export const loadSession = async () => {
    const res = await api.get("/auth/me");
    saveUser(res.data);
    return res.data;
};

/* LOGOUT */
export const logout = async () => {
    try {
        // optional: tell backend to revoke refresh token
        await api.post("/auth/logout");
    } catch {
        // ignore backend failure
    } finally {
        clearAuth(); // ✅ ALWAYS clear frontend auth
    }
};