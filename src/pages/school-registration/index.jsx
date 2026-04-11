import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import Icon from "../../components/AppIcon";
import PasswordStrengthMeter from "./components/PasswordStrengthMeter";
import CountryCodeSelector from "./components/CountryCodeSelector";
import TermsOfServiceModal from "./components/TermsOfServiceModal";
import { saveRegistration } from "../../utils/storage";
import { useAuth } from "../../contexts/AuthContext";
import { register } from "../../services/authService";
import { getPostAuthRedirect } from "../../utils/schoolSetup";

const SchoolRegistration = () => {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // if (user) {
    //   navigate(getPostAuthRedirect(user), { replace: true });
    // }
  }, [loading, navigate, user]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+234",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);


  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { strength: 0, text: "", color: "" };
    }

    let strength = 0;

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);

    if (password.length >= 8) strength += 1;
    if (hasLetter && hasNumber) strength += 1;
    if (hasSpecial) strength += 1;
    if (hasUpper && hasLower) strength += 1;

    const strengthLevels = {
      0: { text: "", color: "" },
      1: { text: "Weak", color: "bg-red-500" },
      2: { text: "Fair", color: "bg-yellow-500" },
      3: { text: "Good", color: "bg-blue-500" },
      4: { text: "Strong", color: "bg-green-500" },
    };

    return { strength, ...strengthLevels[strength] };
  };

  /* ================================
     VALIDATION
     ================================ */

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the Terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  /* ================================
     SUBMIT — STEP 1
     ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // SAVE LOCALLY — DO NOT CALL BACKEND
      const registrationPayload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.countryCode + formData.phone,
        password: formData.password,
      };

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
          registrationError?.message ===
          "Registration succeeded without an authenticated session";
        const canFallbackToLegacyFlow =
          isSessionlessResponse ||
          statusCode === 404 ||
          statusCode === 405 ||
          statusCode === 501;

        if (!canFallbackToLegacyFlow) {
          throw registrationError;
        }
      }

      navigate("/school-setup");
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to continue. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.phone &&
    formData.password &&
    formData.confirmPassword &&
    formData.agreeToTerms &&
    !Object.keys(errors).length;


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Dark Blue */}
      <div className="hidden lg:flex px-9 py-8 text-white lg:flex lg:w-[36%] lg:flex-col
                 bg-gradient-to-br from-[#0a1952] via-[#0f1f44] to-[#0a1952]">
        {/* Decorative elements */}
        {/* <div className="absolute top-0 right-0 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-400/5 rounded-full blur-3xl"></div> */}

        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/sk1e.png"
              alt="Skupadi Logo"
              className="h-20 w-auto object-contain"
            />

          </div>
          <div className="mt-20 2xl:mt-40 max-w-lg">
            <p className="ml-10 text-[18px] font-bold mb-8 leading-tight">
              Simplified Financial Solution for Everything School Payments
            </p>
            <div className="ml-20 space-y-2 2xl:space-y-6">
              <img src="../assets/images/skupadi_image.png" alt="main-image" />
            </div>
          </div>
        </div>
        <div className="mt-auto text-xs text-blue-200/60 relative z-10">
          © 2025 SkuPadi A Product of AstroEdge Technologies LTD. All Rights Reserved
        </div>
      </div>
      {/* RHS */}
      <div className="mx-auto my-auto max-w-[800px] flex-1 flex-col items-center justify-center p-6">
        <div className="flex justify-end gap-4 text-sm mb-2">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Having Trouble?
          </button>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Get Help
            <span>→</span>
          </button>
        </div>
        {/* Registration Form */}
        <div className="bg-card rounded-2xl border border-blue-900 p-4 shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Get Started</h1>
            <p className="text-muted-foreground mt-2">
              Welcome! Create your account right away
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2 ">
            {/* Submit Error */}
            {errors?.submit && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{errors?.submit}</p>
              </div>
            )}
            <div className="grid grid-cols-2">
            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData?.fullName}
              onChange={(e) => handleInputChange('fullName', e?.target?.value)}
              error={errors?.fullName}
              required
              className={formData?.fullName && !errors?.fullName ? 'border-success' : ''}
            />

            {/* Email */}
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
                className={formData?.email && !errors?.email ? 'border-success' : ''}
              />
              {formData?.email && !errors?.email && (
                <div className="absolute right-3 top-8">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                </div>
              )}
            </div>
            </div>
            <div className="flex flex-col  items-start justify-around">
            {/* Phone Number with Country Code */}
            <CountryCodeSelector
              selectedCountryCode={formData?.countryCode}
              phoneNumber={formData?.phone}
              onCountryCodeChange={(code) => handleInputChange('countryCode', code)}
              onPhoneNumberChange={(phone) => handleInputChange('phone', phone)}
              error={errors?.phone}
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={formData?.password}
                onChange={(e) => handleInputChange('password', e?.target?.value)}
                error={errors?.password}
                required
                description="Minimum 8 characters with letters and numbers"
              />

              {/* Password Strength Meter */}
              {formData?.password && (
                <PasswordStrengthMeter
                  password={formData?.password}
                  strength={passwordStrength}
                />
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData?.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
                error={errors?.confirmPassword}
                required
              />
              {formData?.confirmPassword && !errors?.confirmPassword && formData?.password === formData?.confirmPassword && (
                <div className="absolute right-3 top-8">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                </div>
              )}
            </div>

            {/* Terms of Service Agreement */}
            <div className="space-y-2">
              <Checkbox
                checked={formData?.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
                label={
                  <span className="text-sm">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </button>
                    {' '}and Privacy Policy
                  </span>
                }
                error={errors?.agreeToTerms}
                required
              />
              {errors?.agreeToTerms && (
                <p className="text-sm text-destructive">{errors?.agreeToTerms}</p>
              )}
            </div>
          </div>
            {/* Submit Button */}
            <Button
              variant="navy"
              className="mx-auto flex justify-center items-center rounded-lg"
              type="submit"
              size="lg"
              disabled={!isFormValid || isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/school-login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        {/* submit section for form  */}

      </div>
      {/* Terms of Service Modal */}
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          handleInputChange('agreeToTerms', true);
          setShowTermsModal(false);
        }}
      />
    </div>
  );
};

export default SchoolRegistration;
