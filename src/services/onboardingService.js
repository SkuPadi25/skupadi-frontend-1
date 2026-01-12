// src/services/onboardingService.js
import api from "./api";
import {
  saveSchoolId,
  saveSchoolInfo,
  saveAuthTokens,
  saveUser,
  clearOnboarding
} from "../utils/storage";

// STEP 1 — School Basic Info
export const registerSchoolBasic = async (schoolPayload) => {
  const res = await api.post("/auth/register/school-basic", schoolPayload);

  const { schoolId } = res.data;

  if (schoolId) {
    saveSchoolId(schoolId);
    saveSchoolInfo(schoolPayload);
  }

  return res.data;
};

// STEP 2 — Owner Information
export const submitOwnerInfo = async (ownerPayload) => {
  const res = await api.post("/auth/register/owner-info", ownerPayload);

  // Save auth tokens + user (since step 2 completes onboarding)
  if (res.data?.tokens) saveAuthTokens(res.data.tokens);
  if (res.data?.user) saveUser(res.data.user);

  clearOnboarding();
  return res.data;
};


