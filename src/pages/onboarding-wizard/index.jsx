import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Check, ChevronDown, Eye, EyeOff, Upload } from "lucide-react";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import {
  completeSchoolSetup,
  getSchoolSetup,
  saveSchoolSetupStep,
  uploadSchoolSetupFile,
} from "../../services/onboardingService";
import { clearOnboarding, getLS, getRegistration, removeLS, saveLS } from "../../utils/storage";
import { FRONTEND_ONLY_MODE } from "../../utils/demoMode";
import { isSchoolSetupComplete } from "../../utils/schoolSetup";

const DRAFT_KEY = "skp_schoolSetupDraft";
const STEPS = ["School Info", "School Profile", "Verification", "Admin Profile", "Security", "Review"];
const TYPES = ["Nursery / Preschool", "Primary School", "Secondary School", "Primary & Secondary School", "Other"];
const CAPACITY = ["Under 100", "100 - 300", "301 - 700", "701 - 1000", "1000+"];
const OWNERSHIP = ["Sole Proprietor", "Partnership", "Limited company", "Faith-based", "NGO / Trust", "Other"];
const IDS = ["National ID", "International Passport", "Driver's License", "Voter's Card"];
const EMPTY = {
  schoolName: "", schoolEmail: "", schoolPhone: "", streetAddress: "", city: "", lga: "", state: "", schoolLogo: null, schoolLogoUrl: "",
  schoolType: "", studentCapacity: "", yearEstablished: "", ownershipStructure: "", ownershipOther: "",
  tin: "", cacCertificate: null, cacCertificateUrl: "", adminFullName: "", adminPhone: "", adminEmail: "", adminDob: "", adminIdType: "", adminIdNumber: "", adminIdFile: null, adminIdUrl: "",
  password: "", confirmPassword: "",
};

const inputClass = "h-14 w-full rounded-2xl border border-[#d7dcef] bg-[#f7f8fc] px-4 text-[16px] text-[#101828] placeholder:text-[#98a2b3] outline-none transition focus:border-[#335CFF] focus:ring-4 focus:ring-[rgba(51,92,255,0.12)]";
const boxClass = "rounded-[28px] border border-[#d7dcef] bg-white px-6 py-6 shadow-[0_12px_34px_rgba(16,24,40,0.06)] md:px-8";

const strength = (password) => [/[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password), password.length >= 8].filter(Boolean).length;
const isBrowserFile = (value) => typeof File !== "undefined" && value instanceof File;
const fileStub = (url, name) => (url ? { name, url, uploaded: true } : null);

const mapSetupToFormData = (setup) => ({
  schoolName: setup?.schoolInfo?.schoolName || "",
  schoolEmail: setup?.schoolInfo?.schoolEmail || "",
  schoolPhone: setup?.schoolInfo?.schoolPhone || "",
  streetAddress: setup?.schoolInfo?.streetAddress || "",
  city: setup?.schoolInfo?.city || "",
  lga: setup?.schoolInfo?.localGovernmentArea || "",
  state: setup?.schoolInfo?.state || "",
  schoolLogo: fileStub(setup?.schoolInfo?.schoolLogoUrl, "Uploaded school logo"),
  schoolLogoUrl: setup?.schoolInfo?.schoolLogoUrl || "",
  schoolType: setup?.schoolProfile?.schoolType || "",
  studentCapacity: setup?.schoolProfile?.studentCapacity || "",
  yearEstablished: setup?.schoolProfile?.yearEstablished != null ? String(setup.schoolProfile.yearEstablished) : "",
  ownershipStructure: setup?.schoolProfile?.ownershipStructure || "",
  ownershipOther: setup?.schoolProfile?.ownershipOther || "",
  tin: setup?.verification?.tin || "",
  cacCertificate: fileStub(setup?.verification?.cacCertificateUrl, "Uploaded CAC certificate"),
  cacCertificateUrl: setup?.verification?.cacCertificateUrl || "",
  adminFullName: setup?.adminProfile?.adminFullName || "",
  adminPhone: setup?.adminProfile?.adminPhone || "",
  adminEmail: setup?.adminProfile?.adminEmail || "",
  adminDob: setup?.adminProfile?.adminDob || "",
  adminIdType: setup?.adminProfile?.adminIdType || "",
  adminIdNumber: setup?.adminProfile?.adminIdNumber || "",
  adminIdFile: fileStub(setup?.adminProfile?.adminIdUrl, "Uploaded admin ID"),
  adminIdUrl: setup?.adminProfile?.adminIdUrl || "",
});

const buildStepPayload = (currentStep, formData) => {
  if (currentStep === 0) return { key: "schoolInfo", data: { schoolName: formData.schoolName, schoolEmail: formData.schoolEmail, schoolPhone: formData.schoolPhone.replace(/\s+/g, ""), streetAddress: formData.streetAddress, city: formData.city, state: formData.state, localGovernmentArea: formData.lga, schoolLogoUrl: formData.schoolLogoUrl || null } };
  if (currentStep === 1) return { key: "schoolProfile", data: { schoolType: formData.schoolType, studentCapacity: formData.studentCapacity, yearEstablished: Number(formData.yearEstablished), ownershipStructure: formData.ownershipStructure, ownershipOther: formData.ownershipOther || "" } };
  if (currentStep === 2) return { key: "verification", data: { tin: formData.tin, cacCertificateUrl: formData.cacCertificateUrl || null } };
  if (currentStep === 3) return { key: "adminProfile", data: { adminFullName: formData.adminFullName, adminPhone: formData.adminPhone, adminEmail: formData.adminEmail, adminDob: formData.adminDob, adminIdType: formData.adminIdType, adminIdNumber: formData.adminIdNumber, adminIdUrl: formData.adminIdUrl || null } };
  if (currentStep === 4) return { key: "security", data: { passwordSet: true } };
  return null;
};
const Field = ({ label, helper, error, right, children }) => (
  <div>
    <label className="mb-2 block text-[16px] font-medium text-[#101828]">{label}</label>
    <div className="relative">
      {children}
      {right ? <div className="absolute inset-y-0 right-4 flex items-center">{right}</div> : null}
    </div>
    {error ? <p className="mt-2 text-[13px] text-[#d92d20]">{error}</p> : helper ? <p className="mt-2 text-[14px] text-[#475467]">{helper}</p> : null}
  </div>
);

const Stepper = ({ step }) => (
  <div className="rounded-[24px] border border-[#e5e7f0] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,24,40,0.04)] md:px-8">
    <div className="grid grid-cols-3 gap-y-4 md:grid-cols-6">
      {STEPS.map((label, index) => (
        <div key={label} className="relative flex flex-col items-center gap-2 text-center">
          {index > 0 ? <div className={`absolute left-[-50%] top-[14px] hidden h-[2px] w-full md:block ${index <= step ? "bg-[#14266e]" : "bg-[#d8deef]"}`} /> : null}
          <div className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-[13px] font-semibold ${index < step || index === step ? "border-[#14266e] bg-[#14266e] text-white" : "border-[#14266e] bg-white text-[#14266e]"}`}>{index < step ? <Check className="h-4 w-4" /> : index + 1}</div>
          <span className="text-[14px] text-[#101828]">{label}</span>
        </div>
      ))}
    </div>
  </div>
);

const UploadField = ({ label, helper, file, error, onPick }) => (
  <Field label={label} helper={helper} error={error}>
    <label className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed px-6 py-7 text-center ${error ? "border-[#d92d20] bg-[#fff4f2]" : "border-[#b8c9ff] bg-[#f8faff]"}`}>
      <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf,.svg" onChange={(e) => onPick(e.target.files?.[0] || null)} />
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(16,24,40,0.08)] text-[#98a2b3]"><Upload className="h-5 w-5" /></div>
      <p className="text-[15px] font-medium text-[#344054]">{file?.name || "Drag and drop files here or browse"}</p>
      <p className="mt-1 text-[12px] text-[#667085]">JPG, PDF, PNG up to 2 mb</p>
    </label>
  </Field>
);

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const registration = getRegistration();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!FRONTEND_ONLY_MODE && user && isSchoolSetupComplete(user)) {
      removeLS(DRAFT_KEY);
      navigate("/dashboard", { replace: true });
      return;
    }
    if (!FRONTEND_ONLY_MODE && !user && !registration) {
      navigate("/school-login", { replace: true });
      return;
    }
    let ignore = false;
    const initialize = async () => {
      const draft = getLS(DRAFT_KEY);
      const draftData = draft?.data || {};
      let nextData = { ...EMPTY, ...draftData };
      let nextStep = typeof draft?.step === "number" ? Math.min(Math.max(draft.step, 0), 5) : 0;
      if (user || FRONTEND_ONLY_MODE) {
        try {
          const setup = await getSchoolSetup();
          if (!ignore) {
            nextData = { ...nextData, ...mapSetupToFormData(setup), ...draftData };
            if (typeof draft?.step !== "number" && FRONTEND_ONLY_MODE) {
              nextStep = 0;
            } else if (typeof draft?.step !== "number" && typeof setup?.currentStep === "number") {
              nextStep = Math.min(Math.max(setup.currentStep - 1, 0), 5);
            }
          }
        } catch (err) {
          if (!ignore) console.error("Failed to load school setup", err);
        }
      }
      if (registration?.password) {
        nextData = {
          ...nextData,
          password: nextData.password || registration.password,
          confirmPassword: nextData.confirmPassword || registration.password,
          adminFullName: nextData.adminFullName || registration.fullName || "",
          adminEmail: nextData.adminEmail || registration.email || "",
          adminPhone: nextData.adminPhone || registration.phone || registration.phoneNumber || "",
        };
      }
      if (!ignore) {
        setData(nextData);
        setStep(nextStep);
      }
    };
    initialize();
    return () => {
      ignore = true;
    };
  }, [navigate, registration, user]);

  useEffect(() => {
    saveLS(DRAFT_KEY, { step, data: { ...data, schoolLogo: null, cacCertificate: null, adminIdFile: null } });
  }, [data, step]);

  const passwordScore = useMemo(() => strength(data.password), [data.password]);
  const setField = (key, value) => { setData((prev) => ({ ...prev, [key]: value })); setErrors((prev) => ({ ...prev, [key]: null, submit: null })); setMessage(""); };

  const validate = () => {
    const next = {};
    if (step === 0) {
      if (!data.schoolName.trim()) next.schoolName = "Enter your registered school name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.schoolEmail)) next.schoolEmail = "Enter a valid school email address.";
      if (!data.schoolPhone.trim()) next.schoolPhone = "Enter an active school phone number.";
      if (!data.streetAddress.trim()) next.streetAddress = "Enter your school's street address.";
      if (!data.city.trim()) next.city = "Enter the city or town.";
      if (!data.lga.trim()) next.lga = "Enter the local government area.";
      if (!data.state.trim()) next.state = "Enter the state.";
    }
    if (step === 1) {
      if (!data.schoolType) next.schoolType = "Select the school type.";
      if (!data.studentCapacity) next.studentCapacity = "Select the student capacity.";
      if (!/^\d{4}$/.test(data.yearEstablished)) next.yearEstablished = "Use a four-digit year.";
      if (!data.ownershipStructure) next.ownershipStructure = "Select the ownership structure.";
      if (data.ownershipStructure === "Other" && !data.ownershipOther.trim()) next.ownershipOther = "Specify the ownership structure.";
    }
    if (step === 2) {
      if (!data.tin.trim()) next.tin = "Enter the school's tax identification number.";
      if (!data.cacCertificate && !data.cacCertificateUrl) next.cacCertificate = "Upload the CAC certificate.";
    }
    if (step === 3) {
      if (!data.adminFullName.trim()) next.adminFullName = "Enter the administrator's full name.";
      if (!data.adminPhone.trim()) next.adminPhone = "Enter the administrator's phone number.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.adminEmail)) next.adminEmail = "Enter a valid administrator email address.";
      if (!data.adminDob) next.adminDob = "Select the date of birth.";
      if (!data.adminIdType) next.adminIdType = "Select the ID type.";
      if (!data.adminIdNumber.trim()) next.adminIdNumber = "Enter the identity number.";
      if (!data.adminIdFile && !data.adminIdUrl) next.adminIdFile = "Upload the government-issued ID.";
    }
    if (step === 4) {
      if (passwordScore < 5) next.password = "Use 8+ characters with uppercase, lowercase, number, and symbol.";
      if (data.password !== data.confirmPassword) next.confirmPassword = "Passwords do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const uploadPendingFiles = async (currentStep, formData) => {
    let nextData = { ...formData };
    if (currentStep === 0 && isBrowserFile(formData.schoolLogo)) {
      const uploadedLogo = await uploadSchoolSetupFile("schoolLogo", formData.schoolLogo);
      nextData = { ...nextData, schoolLogo: fileStub(uploadedLogo?.fileUrl, uploadedLogo?.fileName || "Uploaded school logo"), schoolLogoUrl: uploadedLogo?.fileUrl || "" };
    }
    if (currentStep === 2 && isBrowserFile(formData.cacCertificate)) {
      const uploadedCertificate = await uploadSchoolSetupFile("cacCertificate", formData.cacCertificate);
      nextData = { ...nextData, cacCertificate: fileStub(uploadedCertificate?.fileUrl, uploadedCertificate?.fileName || "Uploaded CAC certificate"), cacCertificateUrl: uploadedCertificate?.fileUrl || "" };
    }
    if (currentStep === 3 && isBrowserFile(formData.adminIdFile)) {
      const uploadedAdminId = await uploadSchoolSetupFile("adminId", formData.adminIdFile);
      nextData = { ...nextData, adminIdFile: fileStub(uploadedAdminId?.fileUrl, uploadedAdminId?.fileName || "Uploaded admin ID"), adminIdUrl: uploadedAdminId?.fileUrl || "" };
    }
    return nextData;
  };

  const nextStep = async () => {
    if (!validate()) return;
    setBusy(true);
    try {
      const nextData = await uploadPendingFiles(step, data);
      const payload = buildStepPayload(step, nextData);
      if (payload) await saveSchoolSetupStep(step + 1, payload.key, payload.data);
      setData(nextData);
      if (step < 5) setStep((prev) => prev + 1);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err?.response?.data?.message || "We couldn't save this step just yet." }));
    } finally {
      setBusy(false);
    }
  };

  const saveLater = () => setMessage("Your progress has been saved on this device. You can return to continue later.");

  const submitReview = async () => {
    setBusy(true);
    try {
      const result = await completeSchoolSetup();
      if (result?.user) setUser(result.user);
      clearOnboarding();
      removeLS(DRAFT_KEY);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err?.response?.data?.message || "We couldn't submit your setup just yet." }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eff3ff] lg:flex">
      <aside className="hidden bg-[#132365] px-6 py-4 text-white lg:flex lg:w-[33%] lg:flex-col">
        <div>
          <img src="/assets/images/sk1e.png" alt="SkuPadi" className="h-12 w-auto object-contain" />
        </div>
        <div className="mt-20">
          <h5 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.03em]">
            Set up your school once.<br />Run operations with ease.</h5>
        </div>
        <div className="mt-20 2xl:mt-40 space-y-5 text-[#101828]">
          <img src="../assets/images/skupadi_image.png" alt="main-image" />
        </div>
        <div className="mt-auto text-[12px] text-[rgba(255,255,255,0.66)]">© 2025 SkuPadi A Product of Astroidegita Technologies LTD. All Right Reserved</div>
      </aside>
      <main className="flex-1 px-4 py-5 md:px-8 md:py-8 lg:px-10">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-8 flex justify-end text-[14px] font-medium text-[#1d4ed8]">Need help? Get support ?</div>
          <header className="mb-8 text-center">
            <h1 className="font-serif text-[30px] font-bold text-[#1b3278] md:text-[42px]">{["Tell us about your school", "Know your school", "Verify your school for payments", "Principal administrator verification", "Secure your account", "Review your information"][step]}</h1>
            <p className="mx-auto mt-4 max-w-[760px] text-[18px] leading-7 text-[#101828]">{["This information helps us create your school profile and personalize invoices, receipts, and reports.", "Help us understand the type and structure of your institution", "To activate payment features, we need to verify your institution and supporting documents.", "This helps us verify the authorized representative of the school and protect access to school records and payments.", "Create a password to access your School admin dashboard.", "Please confirm that all details are accurate. This information will be used for verification and account setup."][step]}</p>
          </header>
          <Stepper step={step} />
          <section className={`${boxClass} mt-6`}>
            {errors.submit ? <div className="mb-5 rounded-2xl border border-[#fecdca] bg-[#fff6ed] px-4 py-3 text-[14px] text-[#b42318]">{errors.submit}</div> : null}
            {message ? <div className="mb-5 rounded-2xl border border-[#bfd6ff] bg-[#eef4ff] px-4 py-3 text-[14px] text-[#1d4ed8]">{message}</div> : null}
            {step === 0 ? <div className="space-y-2">
              <Field label="School Name" error={errors.schoolName}><input className={inputClass} placeholder="Enter your registered school name" value={data.schoolName} onChange={(e) => setField("schoolName", e.target.value)} /></Field>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="School email address" helper="This is important for updates and verification notices." error={errors.schoolEmail}><input className={inputClass} placeholder="e.g. admin@schoolname.com" value={data.schoolEmail} onChange={(e) => setField("schoolEmail", e.target.value)} /></Field>
                <Field label="School phone number" helper="Use an active number your school can be reached on." error={errors.schoolPhone}><input className={inputClass} placeholder="e.g. 0801 234 5678" value={data.schoolPhone} onChange={(e) => setField("schoolPhone", e.target.value)} /></Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Street Address" error={errors.streetAddress}><input className={inputClass} placeholder="Street Address" value={data.streetAddress} onChange={(e) => setField("streetAddress", e.target.value)} /></Field>
                <Field label="City / Town" error={errors.city}><input className={inputClass} placeholder="City / Town" value={data.city} onChange={(e) => setField("city", e.target.value)} /></Field>
                <Field label="Local Government Area" error={errors.lga}><input className={inputClass} placeholder="Local Government Area" value={data.lga} onChange={(e) => setField("lga", e.target.value)} /></Field>
                <Field label="State" error={errors.state}><input className={inputClass} placeholder="State" value={data.state} onChange={(e) => setField("state", e.target.value)} /></Field>
              </div>
              <div className="grid gap-6 md:grid-cols-[1.35fr,0.8fr] md:items-end">
                <UploadField label="School logo" helper="Your logo will be used on invoices, receipts, and reports." file={data.schoolLogo} onPick={(file) => setField("schoolLogo", file)} />
                <div className="space-y-3"><Button variant="navy" size="xl" className="w-full rounded-2xl" onClick={nextStep} loading={busy}>Continue</Button><button type="button" className="h-12 w-full rounded-2xl border border-[#a7b2d9] bg-white text-[16px] font-medium text-[#475467]" onClick={saveLater}>Save and continue later</button></div>
              </div>
            </div> : null}
            {step === 1 ? <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="School Type" error={errors.schoolType}><div className="relative"><select className={`${inputClass} appearance-none`} value={data.schoolType} onChange={(e) => setField("schoolType", e.target.value)}><option value="">Select school type</option>{TYPES.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#475467]" /></div></Field>
                <Field label="Student Capacity" error={errors.studentCapacity}><div className="relative"><select className={`${inputClass} appearance-none`} value={data.studentCapacity} onChange={(e) => setField("studentCapacity", e.target.value)}><option value="">Select student capacity</option>{CAPACITY.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#475467]" /></div></Field>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Year Established" helper="Enter the year the school was founded" error={errors.yearEstablished}><input className={inputClass} placeholder="e.g. 2012" value={data.yearEstablished} onChange={(e) => setField("yearEstablished", e.target.value.replace(/[^\d]/g, ""))} /></Field>
                <Field label="Ownership Structure" error={errors.ownershipStructure}><div className="relative"><select className={`${inputClass} appearance-none`} value={data.ownershipStructure} onChange={(e) => setField("ownershipStructure", e.target.value)}><option value="">Select ownership structure</option>{OWNERSHIP.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#475467]" /></div></Field>
              </div>
              <Field label='If "Other" selected in ownership structure' error={errors.ownershipOther}><input className={inputClass} placeholder="Specify ownership structure" value={data.ownershipOther} onChange={(e) => setField("ownershipOther", e.target.value)} /></Field>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><button type="button" className="inline-flex items-center gap-2 text-[16px] font-medium text-[#344054]" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" />Back</button><div className="w-full space-y-3 md:w-[280px]"><Button variant="navy" size="xl" className="w-full rounded-2xl" onClick={nextStep} loading={busy}>Continue</Button><button type="button" className="h-12 w-full rounded-2xl border border-[#a7b2d9] bg-white text-[16px] font-medium text-[#475467]" onClick={saveLater}>Save and continue later</button></div></div>
            </div> : null}
            {step === 2 ? <div className="space-y-6">
              <div className="rounded-[20px] bg-[#f8fafc] px-6 py-5"><h3 className="text-[18px] font-semibold text-[#101828]">Before you upload</h3><p className="mt-2 text-[15px] leading-6 text-[#475467]">Make sure your documents are clear, complete, and match the details you provide. Blurry or incomplete files may delay approval.</p></div>
              <Field label="Tax Identification Number (TIN)" helper="Enter the tax ID registered to your school or institution." error={errors.tin}><input className={inputClass} placeholder="Enter the school's TIN" value={data.tin} onChange={(e) => setField("tin", e.target.value)} /></Field>
              <UploadField label="CAC certificate" helper="Upload your school's CAC registration or business registration document." file={data.cacCertificate} error={errors.cacCertificate} onPick={(file) => setField("cacCertificate", file)} />
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><button type="button" className="inline-flex items-center gap-2 text-[16px] font-medium text-[#344054]" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" />Back</button><div className="w-full space-y-3 md:w-[280px]"><Button variant="navy" size="xl" className="w-full rounded-2xl" onClick={nextStep} loading={busy}>Continue</Button><button type="button" className="h-12 w-full rounded-2xl border border-[#a7b2d9] bg-white text-[16px] font-medium text-[#475467]" onClick={saveLater}>Save and continue later</button></div></div>
            </div> : null}
            {step === 3 ? <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Full name" helper="This should match the government-issued ID." error={errors.adminFullName}><input className={inputClass} placeholder="Enter administrator full name" value={data.adminFullName} onChange={(e) => setField("adminFullName", e.target.value)} /></Field>
                <Field label="Phone number" error={errors.adminPhone}><input className={inputClass} placeholder="0801 234 5678" value={data.adminPhone} onChange={(e) => setField("adminPhone", e.target.value)} /></Field>
                <Field label="Email address" error={errors.adminEmail}><input className={inputClass} placeholder="e.g. admin@schoolname.com" value={data.adminEmail} onChange={(e) => setField("adminEmail", e.target.value)} /></Field>
                <Field label="Date of birth" error={errors.adminDob} right={<Calendar className="h-5 w-5 text-[#667085]" />}><input type="date" className={inputClass} value={data.adminDob} onChange={(e) => setField("adminDob", e.target.value)} /></Field>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="ID Type" error={errors.adminIdType}><div className="relative"><select className={`${inputClass} appearance-none`} value={data.adminIdType} onChange={(e) => setField("adminIdType", e.target.value)}><option value="">Select your government ID type</option>{IDS.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#475467]" /></div></Field>
                <Field label="Enter your ID number" error={errors.adminIdNumber}><input className={inputClass} placeholder="Enter identity number" value={data.adminIdNumber} onChange={(e) => setField("adminIdNumber", e.target.value)} /></Field>
              </div>
              <UploadField label="Government-issued ID upload card" file={data.adminIdFile} error={errors.adminIdFile} onPick={(file) => setField("adminIdFile", file)} />
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><button type="button" className="inline-flex items-center gap-2 text-[16px] font-medium text-[#344054]" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" />Back</button><div className="w-full space-y-3 md:w-[280px]"><Button variant="navy" size="xl" className="w-full rounded-2xl" onClick={nextStep} loading={busy}>Continue</Button><button type="button" className="h-12 w-full rounded-2xl border border-[#a7b2d9] bg-white text-[16px] font-medium text-[#475467]" onClick={saveLater}>Save and continue later</button></div></div>
            </div> : null}
            {step === 4 ? <div className="space-y-6">
              <Field label="Password" helper="Use at least 8 characters with a mix of letters, numbers, and symbols." error={errors.password} right={<button type="button" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <EyeOff className="h-5 w-5 text-[#667085]" /> : <Eye className="h-5 w-5 text-[#667085]" />}</button>}><input type={showPassword ? "text" : "password"} className={`${inputClass} pr-12`} placeholder="Create a strong password" value={data.password} onChange={(e) => setField("password", e.target.value)} /></Field>
              <Field label="Confirm Password" error={errors.confirmPassword}><input type={showPassword ? "text" : "password"} className={inputClass} placeholder="Confirm password" value={data.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} /></Field>
              <div className="rounded-[20px] bg-[#f8faff] px-5 py-5"><div className="mb-4 flex items-center justify-between"><span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#344054]">Strength</span><span className="text-[15px] font-medium text-[#344054]">{passwordScore >= 5 ? "Strong" : passwordScore >= 3 ? "Good" : "Needs work"}</span></div><div className="h-3 rounded-full bg-white"><div className="h-full rounded-full bg-[#14266e]" style={{ width: `${Math.max(passwordScore, 1) * 20}%` }} /></div></div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><button type="button" className="inline-flex items-center gap-2 text-[16px] font-medium text-[#344054]" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" />Back</button><div className="w-full md:w-[280px]"><Button variant="navy" size="xl" className="w-full rounded-2xl" onClick={nextStep} loading={busy}>Continue</Button></div></div>
            </div> : null}
            {step === 5 ? <div className="space-y-5">
              {[
                { title: "School Information", edit: 0, rows: [["School Name", data.schoolName], ["Address", [data.streetAddress, data.city, data.state].filter(Boolean).join(", ")], ["Email", data.schoolEmail], ["Phone", data.schoolPhone]] },
                { title: "School Profile", edit: 1, rows: [["School Type", data.schoolType], ["Student Capacity", data.studentCapacity], ["Ownership", data.ownershipStructure === "Other" ? data.ownershipOther : data.ownershipStructure], ["Year Established", data.yearEstablished]] },
                { title: "School Verification", edit: 2, rows: [["TIN", data.tin], ["CAC Certificate", data.cacCertificate?.name]] },
                { title: "Principal Administrator", edit: 3, rows: [["Full Name", data.adminFullName], ["ID Type", data.adminIdType], ["Email", data.adminEmail], ["Phone", data.adminPhone]] },
              ].map((section) => <div key={section.title} className="rounded-[18px] border border-[#e4e7ec] bg-white p-5"><div className="mb-4 flex items-center justify-between"><h4 className="text-[16px] font-semibold text-[#101828]">{section.title}</h4><button type="button" className="text-[14px] font-medium text-[#14266e]" onClick={() => setStep(section.edit)}>Edit</button></div><div className="grid gap-3 md:grid-cols-2">{section.rows.map(([label, value]) => <div key={label}><p className="text-[12px] uppercase tracking-[0.04em] text-[#667085]">{label}</p><p className="mt-1 text-[15px] text-[#101828]">{value || "Not provided"}</p></div>)}</div></div>)}
              <label className="flex items-start gap-3 rounded-[18px] bg-[#f8fafc] p-5"><input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#98a2b3]" defaultChecked /><span className="text-[14px] leading-6 text-[#344054]">I declare that the information provided is accurate and I confirm that this school profile is accurate as far as I am authorized to act on behalf of the school.</span></label>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><button type="button" className="inline-flex items-center gap-2 text-[16px] font-medium text-[#344054]" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" />Back</button><div className="w-full md:w-[280px]"><Button variant="navy" size="xl" className="w-full rounded-2xl" onClick={submitReview} loading={busy}>Submit</Button></div></div>
            </div> : null}
          </section>
        </div>
      </main>
    </div>
  );
};

export default OnboardingWizard;


