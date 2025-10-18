// SetPinModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const SetPinModal = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};

    if (!pin || pin.length !== 4) {
      newErrors.pin = 'PIN must be 4 digits';
    }

    if (!confirmPin) {
      newErrors.confirmPin = 'Please confirm your PIN';
    }

    if (pin && confirmPin && pin !== confirmPin) {
      newErrors.confirmPin = 'PINs do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSuccess?.({ pin });
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Transaction PIN</h2>
          <p className="text-sm text-blue-600">
            Secure your payments with a 4-digit PIN. You'll need this PIN to authorize all transactions in the app.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPin(value);
                if (errors.pin) setErrors(prev => ({ ...prev, pin: null }));
              }}
              maxLength={4}
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm your PIN"
              value={confirmPin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setConfirmPin(value);
                if (errors.confirmPin) setErrors(prev => ({ ...prev, confirmPin: null }));
              }}
              maxLength={4}
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.confirmPin && <p className="text-red-500 text-xs mt-1">{errors.confirmPin}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors mt-6"
          >
            Set Transaction PIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetPinModal;