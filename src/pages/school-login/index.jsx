import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { login } from "../../services/authService";
import { removeLS } from "../../utils/storage";
import { getPostAuthRedirect } from "../../utils/schoolSetup";

const SchoolLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.emailOrPhone?.trim()) {
      newErrors.emailOrPhone = "Email or phone number is required";
    } else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.emailOrPhone);
      const isPhone =
        /^\+?[\d\s-()]+$/?.test(formData?.emailOrPhone) &&
        formData?.emailOrPhone?.length >= 10;

      if (!isEmail && !isPhone) {
        newErrors.emailOrPhone = "Please enter a valid email address or phone number";
      }
    }

    if (!formData?.password?.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const input = formData.emailOrPhone.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

      const payload = isEmail
        ? { email: input, password: formData.password }
        : { phone: input, password: formData.password };

      const result = await login(payload);
      const nextUser = result?.user || null;

      if (nextUser) {
        removeLS("skp_schoolSetupDraft");
      }
      setUser(nextUser);
      navigate(getPostAuthRedirect(nextUser), { replace: true });
    } catch (err) {
      console.error("Login failed:", err);

      setErrors({
        submit: err?.response?.data?.message || "Invalid email/phone or password",
      });

      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 3) setShowCaptcha(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:flex bg-gray-50">
      <div
        className="hidden bg-gradient-to-br from-[#0a1952] via-[#0f1f44] to-[#0a1952]
                      
                       px-9 py-8 text-white lg:flex lg:w-[36%] lg:flex-col"
      >
        {/* <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div> */}
        {/* skupadi logo */}
        <div className="flex-1 relative z-10 ">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/sk1e.png"
              alt="Skupadi Logo"
              className="h-20 w-auto object-contain"
            />
          </div>
          <div className="mt-20 2xl:mt-40 max-w-xl items-center justify-center px-4">
            <h1 className="text-[40px] font-bold leading-tight">Access Your Dashboard</h1>
            {/* <p className="text-blue-100 text-lg mb-10 leading-relaxed">
              Log in to your dashboard and keep your school finance running smoothly.
            </p> */}
            <div className="ml-12 space-y-2 2xl:space-y-6 mt-10">
              <img src="../assets/images/skupadi_image.png" alt="main-image" />
            </div>
          </div>
        </div>

        <div className="mt-auto text-xs text-blue-200/60 relative z-10">
          © 2025 SkuPadi A Product of AstroEdge Technologies LTD. All Rights Reserved
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center items-center gap-3 mb-8">
            <img
              src="/assets/images/sk1e.png"
              alt="Skupadi Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="flex justify-end gap-6 mb-8 text-sm">
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

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900">Log in to dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome! Please enter your details</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {errors?.submit && (
              <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{errors?.submit}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your email address or phone number"
                  value={formData?.emailOrPhone}
                  onChange={(e) => handleInputChange("emailOrPhone", e?.target?.value)}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition ${
                    errors?.emailOrPhone ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {errors?.emailOrPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors?.emailOrPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData?.password}
                    onChange={(e) => handleInputChange("password", e?.target?.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition pr-12 ${
                      errors?.password ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors?.password && (
                  <p className="mt-1 text-sm text-red-600">{errors?.password}</p>
                )}
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {showCaptcha && (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Security Verification Required</p>
                  <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-sm text-gray-500">
                      CAPTCHA verification would appear here
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleTraditionalLogin}
                disabled={isLoading}
                className="mx-auto flex h-11 rounded-md px-8 bg-[#1e40af] text-white py-3 rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to Skupadi?{" "}
                <Link
                  to="/school-registration"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Protected by enterprise-grade security. Your data is safe with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolLogin;
