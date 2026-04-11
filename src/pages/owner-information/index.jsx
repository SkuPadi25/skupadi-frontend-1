import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submitOwnerInfo } from "../../services/onboardingService";
import { useAuth } from "../../contexts/AuthContext";
import {
  getRegistration,
  getSchoolId,
} from "../../utils/storage";
import { Upload, ArrowLeft } from "lucide-react";
import { FRONTEND_ONLY_MODE } from "../../utils/demoMode";

const OwnerInformation = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    bvn: "",
    settlementBankName: "",
    accountNumber: "",
    uploadedFile: null, // UI only for now
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  /* ================================
     STEP GUARD
     ================================ */
  useEffect(() => {
    if (FRONTEND_ONLY_MODE) {
      return;
    }

    const reg = getRegistration();
    const schoolId = getSchoolId();

    if (!user && !reg) {
      navigate("/school-registration", { replace: true });
      return;
    }

    if (!schoolId) {
      navigate("/school-setup", { replace: true });
    }
  }, [navigate, user]);

  /* ================================
     INPUT HANDLERS
     ================================ */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  /* ================================
     FILE HANDLING (UI ONLY)
     ================================ */
  const handleFileUpload = (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setErrors({ file: "Invalid file type" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ file: "File must be under 10MB" });
      return;
    }

    setFormData((p) => ({ ...p, uploadedFile: file }));
    setErrors((p) => ({ ...p, file: null }));
  };

  /* ================================
     VALIDATION
     ================================ */
  const validateForm = () => {
    const e = {};
    const hasBvn = Boolean(formData.bvn);
    const hasBankName = Boolean(formData.settlementBankName.trim());
    const hasAccountNumber = Boolean(formData.accountNumber);
    const hasAnyBankDetails = hasBvn || hasBankName || hasAccountNumber;

    if (hasAnyBankDetails) {
      if (!hasBvn) e.bvn = "BVN is required when adding bank details";
      else if (formData.bvn.length !== 11) e.bvn = "BVN must be 11 digits";

      if (!hasBankName) e.settlementBankName = "Bank name required";

      if (!hasAccountNumber) e.accountNumber = "Account number required";
      else if (formData.accountNumber.length !== 10) {
        e.accountNumber = "Account number must be 10 digits";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================================
     SUBMIT — FINAL STEP
     ================================ */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const reg = getRegistration();
      const schoolId = getSchoolId();

      const payload = {
        schoolId,
        fullName: reg.fullName,
        email: reg.email,
        phone: reg.phone,
        password: reg.password,
        bvn: formData.bvn,
        bankName: formData.settlementBankName,
        accountNumber: formData.accountNumber,
      };

      const result = await submitOwnerInfo(payload);
      setUser(result?.user || null);

      // tokens + user already saved by service
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setErrors({
        submit:
          err?.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    handleFileUpload(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFileUpload(file);
  };

  const handleBack = () => {
    navigate("/school-setup");
  };


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Dark Blue */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#1a2c5b] via-[#0f1f44] to-[#0a1a38] 
                      text-white px-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/sk1e.png"
              alt="Skupadi Logo"
              className="w-40 h-40 object-contain  rounded-lg p-2"
            />

          </div>

          <div className="max-w-md">
            <h1 className="text-3xl font-bold mb-8 leading-tight">
              Set Up Your School in Minutes
            </h1>

            <div className="space-y-6 mt-10">
              <img src="../assets/images/skupadi_image.png" alt="main-image" />
            </div>
          </div>
        </div>

        <div className="text-xs text-blue-200/60 relative z-10">
          © 2025 SkuPadi A Product of AstroEdge Technologies LTD. All Rights Reserved
        </div>
      </div>

      {/* Right Panel - Owner Information Form */}
      <div className="flex-1 flex flex-col p-6">
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

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#0a1f44] mb-2">
                Owner Information
              </h1>
              <p className="text-gray-600">
                Please provide your identity details
              </p>
            </div>

            {/* Single Form Card */}
            <div className="bg-white rounded-2xl border border-[#0a1f44] p-8 shadow-sm">
              {/* Submit Error */}
              {errors?.submit && (
                <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{errors?.submit}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* BVN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BVN
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your BVN"
                      maxLength="11"
                      value={formData?.bvn}
                      onChange={(e) => handleInputChange('bvn', e?.target?.value?.replace(/\D/g, ''))}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition pr-12 ${errors?.bvn ? 'border-red-300' : 'border-gray-200'
                        }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" />
                        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>
                  {errors?.bvn && (
                    <p className="mt-1 text-sm text-red-600">{errors?.bvn}</p>
                  )}
                </div>

                {/* Upload File Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload your school document, identification, and selfie
                  </p>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                      }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileInputChange}
                    />

                    {formData?.uploadedFile ? (
                      <div className="space-y-2">
                        <div className="text-green-600">
                          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{formData?.uploadedFile?.name}</p>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, uploadedFile: null }))}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-gray-400">
                          <Upload className="w-12 h-12 mx-auto" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Drag and drop files here or click to upload
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            .jpeg, .png, .svg, .mp3 up to 10 mb
                          </p>
                        </div>
                        <label
                          htmlFor="file-upload"
                          className="inline-block px-4 py-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          Browse files
                        </label>
                      </div>
                    )}
                  </div>
                  {errors?.file && (
                    <p className="mt-1 text-sm text-red-600">{errors?.file}</p>
                  )}
                </div>

                {/* Bank Preferences Section */}
                <div className="pt-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Bank Preferences</h3>

                  {/* Settlement Bank Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Settlement Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter bank name"
                      value={formData?.settlementBankName}
                      onChange={(e) => handleInputChange('settlementBankName', e?.target?.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition ${errors?.settlementBankName ? 'border-red-300' : 'border-gray-200'
                        }`}
                    />
                    {errors?.settlementBankName && (
                      <p className="mt-1 text-sm text-red-600">{errors?.settlementBankName}</p>
                    )}
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter account number"
                      maxLength="10"
                      value={formData?.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e?.target?.value?.replace(/\D/g, ''))}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition ${errors?.accountNumber ? 'border-red-300' : 'border-gray-200'
                        }`}
                    />
                    {errors?.accountNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors?.accountNumber}</p>
                    )}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-4">
                  <p className="text-xs text-gray-600 text-center">
                    By clicking "Submit button," you agree to SkuPadi's{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="w-12 h-12 bg-[#0a1f44] text-white rounded-full hover:bg-[#0d2850] transition-colors shadow-lg flex items-center justify-center"
              >
                <ArrowLeft size={20} />
              </button>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-[#0a1f44] text-white rounded-lg hover:bg-[#0d2850] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
              >
                {isLoading ? 'Submitting...' : 'Submit Details'}
              </button>
            </div>

            {/* Support Email */}
            <div className="mt-8 text-right">
              <p className="text-xs">
                <a href="mailto:support@skupadi.com" className="text-blue-600 hover:text-blue-700">
                  support@skupadi.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerInformation;

