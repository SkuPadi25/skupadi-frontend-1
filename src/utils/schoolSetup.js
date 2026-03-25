export const SCHOOL_SETUP_STEPS = 6;

const COMPLETED_STATUS = new Set(["complete", "completed", "active"]);

export const getSchoolIdFromUser = (user) =>
  user?.schoolId || user?.school?.id || null;

export const getSchoolSetupStep = (user) => {
  const rawStep =
    user?.setup?.currentStep ??
    user?.schoolSetupStep ??
    user?.schoolSetup?.step ??
    user?.setupStep ??
    null;

  if (typeof rawStep === "number") return rawStep;

  if (typeof rawStep === "string") {
    const numericStep = Number(rawStep);
    if (!Number.isNaN(numericStep)) return numericStep;
  }

  return null;
};

export const isSchoolSetupComplete = (user) => {
  if (!user) return false;

  if (typeof user?.setup?.completed === "boolean") {
    return user.setup.completed;
  }

  if (typeof user?.schoolSetupCompleted === "boolean") {
    return user.schoolSetupCompleted;
  }

  const status =
    user?.schoolSetupStatus ||
    user?.verificationStatus ||
    user?.school?.status ||
    "";

  if (typeof status === "string" && COMPLETED_STATUS.has(status.toLowerCase())) {
    return true;
  }

  const step = getSchoolSetupStep(user);
  if (typeof step === "number") {
    return step >= SCHOOL_SETUP_STEPS;
  }

  return false;
};

export const getPostAuthRedirect = (user) =>
  isSchoolSetupComplete(user) ? "/dashboard" : "/school-setup";
