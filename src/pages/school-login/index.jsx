import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { saveAuthTokens, saveUser } from "../../utils/storage";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { login } from "../../services/authService";



const SchoolLogin = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email or Phone validation
    if (!formData?.emailOrPhone?.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.emailOrPhone);
      const isPhone = /^\+?[\d\s-()]+$/?.test(formData?.emailOrPhone) && formData?.emailOrPhone?.length >= 10;

      if (!isEmail && !isPhone) {
        newErrors.emailOrPhone = 'Please enter a valid email address or phone number';
      }
    }

    // Password validation
    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Detect if input is email or phone
  const detectInputType = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(input) ? 'email' : 'phone';
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

      const loggedInUser = await login(payload); // ← real backend call
      setUser(loggedInUser?.user || null);

    } catch (err) {
      console.error("Login failed:", err);

      setErrors({
        submit:
          err?.response?.data?.message ||
          "Invalid email/phone or password",
      });

      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 3) setShowCaptcha(true);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Dark Blue */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#1a2c5b] via-[#0f1f44] to-[#0a1a38] 
                      text-white px-8 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/sk1b.png"
              alt="Skupadi Logo"
              className="w-40 h-40 object-contain  rounded-lg p-2"
            />
          </div>
          <div className="max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              Access Your Finance Hub
            </h1>
            <p className="text-blue-100 text-lg mb-20 leading-relaxed">
              Log in to your dashboard and keep your school finance running smoothly.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center">
                  <svg className="" width="14" height="14" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.25 0C1.65326 0 1.08097 0.237272 0.65901 0.659618C0.237053 1.08196 0 1.65479 0 2.25208V3.00277H14V2.25208C14 1.65479 13.7629 1.08196 13.341 0.659618C12.919 0.237272 12.3467 0 11.75 0H2.25ZM0 8.75807V4.00369H14V8.75807C14 9.35536 13.7629 9.92818 13.341 10.3505C12.919 10.7729 12.3467 11.0101 11.75 11.0101H2.25C1.65326 11.0101 1.08097 10.7729 0.65901 10.3505C0.237053 9.92818 0 9.35536 0 8.75807ZM9.5 7.00646C9.36739 7.00646 9.24021 7.05918 9.14645 7.15304C9.05268 7.24689 9 7.37419 9 7.50692C9 7.63965 9.05268 7.76694 9.14645 7.8608C9.24021 7.95465 9.36739 8.00738 9.5 8.00738H11C11.1326 8.00738 11.2598 7.95465 11.3536 7.8608C11.4473 7.76694 11.5 7.63965 11.5 7.50692C11.5 7.37419 11.4473 7.24689 11.3536 7.15304C11.2598 7.05918 11.1326 7.00646 11 7.00646H9.5Z" fill="#061036" />
                  </svg>
                </div>
                <span className="text-base text-blue-50">Payment Collection</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center">
                  <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="13.5" cy="12" rx="13.5" ry="12" fill="none" />
                    <path d="M13 15.0055C13.7956 15.0055 14.5587 14.6892 15.1213 14.126C15.6839 13.5629 16 12.7992 16 12.0028C16 11.2064 15.6839 10.4426 15.1213 9.87949C14.5587 9.31636 13.7956 9 13 9C12.2044 9 11.4413 9.31636 10.8787 9.87949C10.3161 10.4426 10 11.2064 10 12.0028C10 12.7992 10.3161 13.5629 10.8787 14.126C11.4413 14.6892 12.2044 15.0055 13 15.0055Z" fill="#061036" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13 3C13.2652 3 13.5196 3.10545 13.7071 3.29316C13.8946 3.48087 14 3.73546 14 4.00092V5.07191C15.4962 5.28772 16.8824 5.98253 17.9513 7.05242C19.0202 8.12231 19.7144 9.5098 19.93 11.0074H21C21.2652 11.0074 21.5196 11.1128 21.7071 11.3005C21.8946 11.4883 22 11.7428 22 12.0083C22 12.2738 21.8946 12.5284 21.7071 12.7161C21.5196 12.9038 21.2652 13.0092 21 13.0092H19.93C19.7144 14.5068 19.0202 15.8943 17.9513 16.9642C16.8824 18.0341 15.4962 18.7289 14 18.9447V20.0157C14 20.2811 13.8946 20.5357 13.7071 20.7234C13.5196 20.9112 13.2652 21.0166 13 21.0166C12.7348 21.0166 12.4804 20.9112 12.2929 20.7234C12.1054 20.5357 12 20.2811 12 20.0157V18.9447C10.5038 18.7289 9.11759 18.0341 8.04868 16.9642C6.97978 15.8943 6.28561 14.5068 6.07 13.0092H5C4.73478 13.0092 4.48043 12.9038 4.29289 12.7161C4.10536 12.5284 4 12.2738 4 12.0083C4 11.7428 4.10536 11.4883 4.29289 11.3005C4.48043 11.1128 4.73478 11.0074 5 11.0074H6.07C6.28638 9.51011 6.9808 8.12305 8.04956 7.0533C9.11833 5.98355 10.5041 5.28849 12 5.07191V4.00092C12 3.73546 12.1054 3.48087 12.2929 3.29316C12.4804 3.10545 12.7348 3 13 3ZM8 12.0083C8 10.681 8.52678 9.40805 9.46447 8.46951C10.4021 7.53096 11.6739 7.00369 13 7.00369C14.3261 7.00369 15.5979 7.53096 16.5355 8.46951C17.4732 9.40805 18 10.681 18 12.0083C18 13.3356 17.4732 14.6086 16.5355 15.5471C15.5979 16.4856 14.3261 17.0129 13 17.0129C11.6739 17.0129 10.4021 16.4856 9.46447 15.5471C8.52678 14.6086 8 13.3356 8 12.0083Z" fill="#061036" />
                  </svg>
                </div>
                <span className="text-base text-blue-50">Track Every ₦</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.8 4.19999H2.8V2.8H9.8V4.19999ZM8.4 6.99999V9.58299L10.633 10.871L11.158 9.96099L9.45 8.97399V6.99999H8.4ZM4.2 13.3L5.509 12.432C5.96615 12.928 6.52146 13.3236 7.13966 13.5935C7.75786 13.8634 8.42544 14.0019 9.1 14C11.809 14 14 11.809 14 9.09999C14 7.76299 13.468 6.55199 12.6 5.66999V0H0V13.3L2.1 11.9L4.2 13.3ZM4.2 11.62L2.1 10.22L1.4 10.682V1.4H11.2V4.66899C10.563 4.36799 9.849 4.19999 9.1 4.19999C7.763 4.19999 6.552 4.73199 5.67 5.59999H2.8V6.99999H4.669C4.368 7.63699 4.2 8.35099 4.2 9.09999C4.2 9.88399 4.382 10.619 4.711 11.277L4.2 11.62ZM9.1 12.6C7.168 12.6 5.6 11.032 5.6 9.09999C5.6 7.16799 7.168 5.59999 9.1 5.59999C11.032 5.59999 12.6 7.16799 12.6 9.09999C12.6 11.032 11.032 12.6 9.1 12.6Z" fill="#061036" />
                  </svg>

                </div>
                <span className="text-base text-blue-50">Simplify Invoice</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center">
                  <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2196 5.3052C13.725 5.3052 15.7561 7.08451 15.7561 9.27938C15.7561 10.1158 15.4612 10.8918 14.9575 11.532L17.2728 13.5604L16.1063 14.5823L13.791 12.5539C13.0601 12.9952 12.1743 13.2536 11.2196 13.2536C8.71408 13.2536 6.683 11.4743 6.683 9.27938C6.683 7.08451 8.71408 5.3052 11.2196 5.3052ZM11.2196 6.75037C9.62516 6.75037 8.33267 7.88268 8.33267 9.27938C8.33267 10.6761 9.6252 11.8084 11.2196 11.8084C12.814 11.8084 14.1064 10.6761 14.1064 9.27938C14.1064 7.88264 12.8139 6.75037 11.2196 6.75037ZM5.87376 8.91808C5.86338 9.03735 5.85817 9.15778 5.85814 9.27938C5.85814 9.65246 5.90779 10.0154 6.00159 10.3633L0.90918 10.3632V8.91811L5.87376 8.91808ZM4.20855 0.969727V8.19551H1.73403V0.969727H4.20855ZM7.50785 3.86003L7.50773 5.89025C6.77583 6.50562 6.24281 7.30115 6.00166 8.19547L5.03337 8.19551V3.86003H7.50785ZM10.8071 2.4149V4.59632C9.92652 4.65455 9.07622 4.90357 8.33267 5.32099V2.41486L10.8071 2.4149ZM14.1064 3.13746L14.1065 5.32099C13.3629 4.90357 12.5126 4.65455 11.632 4.59632V3.13746H14.1064Z" fill="#061036" />
                  </svg>

                </div>
                <span className="text-base text-blue-50">Analytics and Reports</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-blue-200/60 relative z-10">
          © 2025 SkuPadi A Product of AstroEdge Technologies LTD. All Rights Reserved
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center items-center gap-3 mb-8">
            <img
              src="/assets/images/sk1c.png"
              alt="Skupadi Logo"
              className="w-12 h-12 object-contain"
            />
            {/* <span className="font-bold text-2xl text-gray-900">SkuPadi</span> */}
          </div>

          {/* Top Links */}
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

          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">

            </div>
            <h1 className="text-2xl font-bold text-gray-900">Log in to dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome! Please enter your details
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Submit Error */}
            {errors?.submit && (
              <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{errors?.submit}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Email or Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your email address or phone number"
                  value={formData?.emailOrPhone}
                  onChange={(e) => handleInputChange('emailOrPhone', e?.target?.value)}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition ${errors?.emailOrPhone ? 'border-red-300' : 'border-gray-200'
                    }`}
                />
                {errors?.emailOrPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors?.emailOrPhone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData?.password}
                    onChange={(e) => handleInputChange('password', e?.target?.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition pr-12 ${errors?.password ? 'border-red-300' : 'border-gray-200'
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

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* CAPTCHA Placeholder */}
              {showCaptcha && (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Security Verification Required</p>
                  <div className="h-16 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-sm text-gray-500">CAPTCHA verification would appear here</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleTraditionalLogin}
                disabled={isLoading}
                className="mx-auto flex h-11 rounded-md px-8 bg-[#1e40af] text-white py-3 rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {/* Registration Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to Skupadi?{' '}
                <Link
                  to="/school-registration"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
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
