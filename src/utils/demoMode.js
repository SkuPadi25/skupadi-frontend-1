export const FRONTEND_ONLY_MODE =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_FRONTEND_ONLY != null)
    ? String(import.meta.env.VITE_FRONTEND_ONLY).toLowerCase() === "true"
    : true;

export const DEMO_SCHOOL_ID = "demo-school-001";

export const createDemoUser = (overrides = {}) => {
  const setup = {
    currentStep: 6,
    completed: true,
    ...(overrides?.setup || {}),
  };

  return {
    id: "demo-user-001",
    firstName: "Demo",
    lastName: "Admin",
    email: "demo@skupadi.app",
    phone: "+2348012345678",
    role: "Administrator",
    schoolId: DEMO_SCHOOL_ID,
    school: {
      id: DEMO_SCHOOL_ID,
      name: "SkuPadi Demo School",
      status: "active",
    },
    schoolSetupCompleted: setup.completed,
    schoolSetupStep: setup.currentStep,
    setup,
    ...overrides,
  };
};

export const createDemoSetupState = (overrides = {}) => ({
  currentStep: 6,
  schoolInfo: {
    schoolName: "SkuPadi Demo School",
    schoolEmail: "hello@skupadi.app",
    schoolPhone: "+2348012345678",
    streetAddress: "12 Demo Avenue",
    city: "Lagos",
    state: "Lagos",
    localGovernmentArea: "Ikeja",
    schoolLogoUrl: "",
  },
  schoolProfile: {
    schoolType: "Primary & Secondary School",
    studentCapacity: "301 - 700",
    yearEstablished: 2016,
    ownershipStructure: "Limited company",
    ownershipOther: "",
  },
  verification: {
    tin: "12345678-0001",
    cacCertificateUrl: "",
  },
  adminProfile: {
    adminFullName: "Demo Admin",
    adminPhone: "+2348012345678",
    adminEmail: "demo@skupadi.app",
    adminDob: "1990-01-01",
    adminIdType: "National ID",
    adminIdNumber: "A123456789",
    adminIdUrl: "",
  },
  ...overrides,
});
