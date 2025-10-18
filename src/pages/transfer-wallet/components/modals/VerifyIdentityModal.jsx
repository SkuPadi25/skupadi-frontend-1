// VerifyIdentityModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const VerifyIdentityModal = ({ isOpen, onClose, onVerify, email = 'your@email.com' }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleResend = () => {
    alert('Verification code resent!');
    // Add your resend logic here
  };

  const handleContinue = () => {
    if (!otp || otp.length < 4) {
      setError('Please enter the verification code');
      return;
    }

    onVerify?.({ otp });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
          <p className="text-sm text-blue-600">
            We have sent a verification link to your mail<br />
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setOtp(value);
                if (error) setError('');
              }}
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't get any code?{' '}
              <button
                onClick={handleResend}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Resend Code
              </button>
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-4 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors mt-6"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyIdentityModal;