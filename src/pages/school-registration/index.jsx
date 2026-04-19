import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Button from "../../components/ui/Button";
import { saveRegistration } from "../../utils/storage";
import { useAuth } from "../../contexts/AuthContext";
import { register } from "../../services/authService";
import { getPostAuthRedirect } from "../../utils/schoolSetup";

const inputClass =
  "h-12 w-full rounded-[7px] border border-transparent bg-[#ececec] px-5 text-[15px] text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1b3278] focus:bg-white focus:ring-4 focus:ring-[#1b3278]/10";

const Field = ({ label, error, children }) => (
  <div>
    <label className="mb-2 block text-[15px] font-medium text-[#15182f]">{label}</label>
    {children}
    {error ? <p className="mt-2 text-[12px] text-[#d92d20]">{error}</p> : null}
  </div>
);

const FeatureCard = ({ icon, label, className = "" }) => (
  <div
    className={`absolute flex h-16 items-center gap-4 rounded-[10px] bg-white px-5 text-[#1f2333] shadow-[0_16px_34px_rgba(0,0,0,0.2)] ${className}`}
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f7f0] text-[#178b55]">
      {icon}
    </div>
    <span className="whitespace-nowrap font-serif text-[15px] font-semibold tracking-normal">{label}</span>
  </div>
);

const passwordChecks = (password) => ({
  length: password.length >= 8,
  symbol: /[^A-Za-z0-9]/.test(password),
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
});

const SchoolRegistration = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    schoolName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const checks = useMemo(() => passwordChecks(formData.password), [formData.password]);
  const passwordScore = Object.values(checks).filter(Boolean).length;
  const isPasswordStrong = passwordScore >= 4;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null, submit: null }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!formData.email.trim()) nextErrors.email = "Email address is required";
    else if (!emailRegex.test(formData.email)) nextErrors.email = "Enter a valid email address";
    if (!formData.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!formData.schoolName.trim()) nextErrors.schoolName = "School name is required";
    if (!formData.password) nextErrors.password = "Password is required";
    else if (!isPasswordStrong) nextErrors.password = "Use 8+ chars with uppercase, lowercase, number, and symbol";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const registrationPayload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      fullName,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      phoneNumber: formData.phone.trim(),
      schoolName: formData.schoolName.trim(),
      password: formData.password,
    };

    try {
      saveRegistration(registrationPayload);

      try {
        const result = await register(registrationPayload);
        const nextUser = result?.user || null;

        setUser(nextUser);
        navigate(getPostAuthRedirect(nextUser), { replace: true });
        return;
      } catch (registrationError) {
        const statusCode = registrationError?.response?.status;
        const isSessionlessResponse =
          registrationError?.message === "Registration succeeded without an authenticated session";
        const canFallbackToSetup =
          isSessionlessResponse || statusCode === 404 || statusCode === 405 || statusCode === 501;

        if (!canFallbackToSetup) {
          throw registrationError;
        }
      }

      navigate("/school-setup", { replace: true });
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Failed to create your account. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const requirementPills = [
    ["8+ Chars", checks.length],
    ["Symbol", checks.symbol],
    ["Uppercase", checks.uppercase],
    ["Lowercase", checks.lowercase],
    ["Number", checks.number],
  ];

  return (
    <div className="min-h-screen bg-[#eef2fc] lg:flex">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#0b1b5b] px-12 py-7 text-white lg:flex lg:w-[39%] lg:flex-col">
        <img src="/assets/images/sk1e.png" alt="SkuPadi" className="h-12 w-auto object-contain" />

        <div className="mt-24 text-[24px] max-w-[500px]">
          <h1 className="font-serif font-bold leading-[1.16] tracking-normal">
            Set up your school once.
            <br />
            Run operations with ease.
          </h1>
        </div>

        <div className="relative mt-10">
        <div className="mt-20 ml-12 space-y-2 2xl:space-y-6 mt-10">
              <img src="../assets/images/skupadi_image.png" alt="main-image" />
        </div>
        
        <p className="mt-auto text-[14px] text-white/60">
          {"\u00a9"} 2025 SkuPadi A Product of Astroidegita Technologies LTD. All Right Reserved
        </p>
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col px-5 py-6 md:px-10 lg:px-16">
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#1b3278]"
            onClick={() => navigate("/school-login")}
          >
            Need help? Get support
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[980px] flex-1 flex-col justify-center pb-8">
          <h2 className="mb-8 text-center font-serif text-[18px] font-bold leading-tight text-[#132365] md:text-[20px]">
            Create your school account in 2 minutes
          </h2>

          <form
            onSubmit={handleSubmit}
            className="rounded-[18px] border border-[#d9ddea] bg-white px-6 py-7 shadow-[0_12px_30px_rgba(16,24,40,0.08)] md:px-9"
          >
            {errors.submit ? (
              <div className="mb-5 rounded-[8px] border border-[#fecdca] bg-[#fff6ed] px-4 py-3 text-sm text-[#b42318]">
                {errors.submit}
              </div>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="First Name" error={errors.firstName}>
                <input
                  className={inputClass}
                  placeholder="Ada"
                  value={formData.firstName}
                  onChange={(event) => handleInputChange("firstName", event.target.value)}
                />
              </Field>
              <Field label="Last Name" error={errors.lastName}>
                <input
                  className={inputClass}
                  placeholder="Okonkwo"
                  value={formData.lastName}
                  onChange={(event) => handleInputChange("lastName", event.target.value)}
                />
              </Field>
            </div>

            <div className="mt-6 space-y-5">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Email Address" error={errors.email}>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="admin@schoolname.com"
                    value={formData.email}
                    onChange={(event) => handleInputChange("email", event.target.value)}
                  />
                </Field>

                <Field label="Phone Number" error={errors.phone}>
                  <input
                    className={inputClass}
                    placeholder="+234 80 000 0000"
                    value={formData.phone}
                    onChange={(event) => handleInputChange("phone", event.target.value)}
                  />
                  <p className="mt-2 text-[12px] font-medium text-[#667085]">We'll send a verification code</p>
                </Field>
              </div>

              <Field label="School Name" error={errors.schoolName}>
                <input
                  className={inputClass}
                  placeholder="Bright Future Academy"
                  value={formData.schoolName}
                  onChange={(event) => handleInputChange("schoolName", event.target.value)}
                />
              </Field>

              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`${inputClass} pr-12`}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(event) => handleInputChange("password", event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-4 flex items-center text-[#0b1b5b]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </Field>
            </div>

            <div className="mt-3">
              <div className="h-2 rounded-full bg-[#d9ddea]">
                <div
                  className="h-full rounded-full bg-[#303654] transition-all"
                  style={{ width: `${Math.max(passwordScore, 1) * 20}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {requirementPills.map(([label, passed]) => (
                  <span
                    key={label}
                    className={`inline-flex h-7 items-center gap-2 rounded-full px-3 text-xs font-semibold ${
                      passed ? "bg-[#dfe4fb] text-[#101828]" : "bg-[#eef0f7] text-[#667085]"
                    }`}
                  >
                    <CheckCircle2 className={`h-3.5 w-3.5 ${passed ? "text-[#101828]" : "text-[#98a2b3]"}`} />
                    {label}
                  </span>
                ))}
                <span className="ml-auto text-sm font-semibold text-[#1d4ed8]">
                  {isPasswordStrong ? "Strong" : "Needs work"}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="navy"
              loading={isLoading}
              className="mt-2 h-10 w-full rounded-[6px] bg-[#1234c7] shadow-[0_12px_22px_rgba(18,52,199,0.24)] hover:bg-[#0e2da9]"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
            </Button>

            <div className="mt-2 flex items-center justify-center gap-3 
                            text-center text-[10px] font-serif font-semibold text-[#333748]">
              <LockKeyhole className="h-5 w-5 text-[#0b1b5b]" />
              Your data is securely encrypted
            </div>

            <p className="mt-2 text-center text-[10px] font-serif font-semibold text-[#4b4f5c]">
              Already have an account?{" "}
              <Link to="/school-login" className="font-bold text-[#1234c7] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SchoolRegistration;
