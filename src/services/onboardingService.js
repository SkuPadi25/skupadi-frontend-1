import api from "./api";
import { getLS, LS_KEYS, saveLS, saveSchoolId, saveUser } from "../utils/storage";
import { createDemoSetupState, createDemoUser, DEMO_SCHOOL_ID, FRONTEND_ONLY_MODE } from "../utils/demoMode";

const DEMO_SETUP_KEY = "skp_demoSchoolSetup";

const unwrapPayload = (payload) => payload?.data || payload;

const normalizeSetup = (payload) => {
  const setup = payload?.setup || payload?.user?.setup || null;

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

const normalizeAuthenticatedUser = (payload) => {
  const baseUser = payload?.user || null;
  const school = payload?.school || null;
  const setup = normalizeSetup(payload);

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

const persistUserFromAuthPayload = (payload) => {
  const user = normalizeAuthenticatedUser(payload);

  if (user?.schoolId) {
    saveSchoolId(user.schoolId);
  }

  if (user?.id) {
    saveUser(user);
  }

  return user;
};

const saveDemoSetup = (payload) => saveLS(DEMO_SETUP_KEY, payload);

const getDemoSetup = () => getLS(DEMO_SETUP_KEY) || createDemoSetupState();

const saveDemoUserWithSetup = (setupOverrides = {}) => {
  const existingUser = getLS(LS_KEYS.USER) || createDemoUser();
  const nextSetup = {
    ...(existingUser?.setup || {}),
    ...setupOverrides,
  };
  const nextUser = createDemoUser({
    ...existingUser,
    setup: nextSetup,
    schoolSetupCompleted: Boolean(nextSetup?.completed),
    schoolSetupStep: nextSetup?.currentStep ?? existingUser?.schoolSetupStep ?? 1,
  });

  saveSchoolId(nextUser.schoolId || DEMO_SCHOOL_ID);
  saveUser(nextUser);
  return nextUser;
};

export const getSchoolSetup = async () => {
  if (FRONTEND_ONLY_MODE) {
    const setup = getDemoSetup();
    saveSchoolId(DEMO_SCHOOL_ID);
    saveDemoUserWithSetup({
      currentStep: setup?.currentStep ?? 1,
      completed: Boolean(setup?.currentStep >= 6),
    });
    return setup;
  }

  const res = await api.get("/schools/setup");
  return unwrapPayload(res.data);
};

export const saveSchoolSetupStep = async (step, key, data) => {
  if (FRONTEND_ONLY_MODE) {
    const current = getDemoSetup();
    const next = {
      ...current,
      currentStep: step,
      [key]: {
        ...(current?.[key] || {}),
        ...(data || {}),
      },
    };
    saveSchoolId(DEMO_SCHOOL_ID);
    saveDemoSetup(next);
    saveDemoUserWithSetup({
      currentStep: step,
      completed: step >= 6,
    });
    return next;
  }

  const res = await api.patch("/schools/setup", { step, key, data });
  return unwrapPayload(res.data);
};

export const uploadSchoolSetupFile = async (type, file) => {
  if (FRONTEND_ONLY_MODE) {
    const fileUrl = typeof URL !== "undefined" && file ? URL.createObjectURL(file) : "";
    return {
      fileUrl,
      fileName: file?.name || `${type}-upload`,
    };
  }

  const formData = new FormData();
  formData.append("type", type);
  formData.append("file", file);

  const res = await api.post("/schools/setup/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return unwrapPayload(res.data);
};

export const refreshAuthenticatedUser = async () => {
  if (FRONTEND_ONLY_MODE) {
    const setup = getDemoSetup();
    const user = saveDemoUserWithSetup({
      currentStep: setup?.currentStep ?? 1,
      completed: Boolean(setup?.currentStep >= 6),
    });

    return {
      user,
      setup,
    };
  }

  const res = await api.get("/auth/me");
  const payload = unwrapPayload(res.data);
  const user = persistUserFromAuthPayload(payload);

  return {
    ...payload,
    user,
  };
};

export const completeSchoolSetup = async () => {
  if (FRONTEND_ONLY_MODE) {
    const current = getDemoSetup();
    const setup = {
      ...current,
      currentStep: 6,
      completed: true,
    };
    saveDemoSetup(setup);
    const user = saveDemoUserWithSetup({
      currentStep: 6,
      completed: true,
    });

    return {
      success: true,
      user,
    };
  }

  const res = await api.post("/schools/setup/complete", {
    confirmAccurate: true,
  });

  const payload = unwrapPayload(res.data);
  const authState = await refreshAuthenticatedUser();

  return {
    ...payload,
    user: authState.user,
  };
};

export const registerSchoolBasic = async (schoolPayload) => {
  const payload = {
    schoolName: schoolPayload?.schoolName || "",
    schoolEmail: schoolPayload?.schoolEmail || "",
    schoolPhone: schoolPayload?.schoolPhone || "",
    streetAddress: schoolPayload?.streetAddress || schoolPayload?.street || "",
    city: schoolPayload?.city || "",
    state: schoolPayload?.state || "",
    localGovernmentArea: schoolPayload?.localGovernmentArea || schoolPayload?.lga || "",
    schoolLogoUrl: schoolPayload?.schoolLogoUrl || null,
  };

  const result = await saveSchoolSetupStep(1, "schoolInfo", payload);
  const authState = await refreshAuthenticatedUser();

  return {
    ...result,
    schoolId: authState?.user?.schoolId || null,
  };
};

export const submitOwnerInfo = async () => completeSchoolSetup();
