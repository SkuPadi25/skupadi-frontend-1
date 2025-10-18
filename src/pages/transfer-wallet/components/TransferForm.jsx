import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, X, Send, ArrowLeft } from 'lucide-react';
// import TransferFormDemo from './TransferButton'



const TransferForm = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAmountModalOpen, setIsAmountModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [searchTerm] = useState('');
  const [filters] = useState({});

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    alert('Transfer submitted successfully!');
    setIsModalOpen(false);
    setIsAmountModalOpen(true);
  };

  return (
    <div className="max-h-screen bg-gray-50 p-8">
      <div className="flex justify-between">
        {/* Modal Trigger Button Row */}
          <button 
          onClick={() => navigate(-1)}
          className='justify-start text-center align-bottom'>
            <ArrowLeft className='' href='../' /></button>
        <div className="flex justify-end">
          <button
          className="mr-4 text-blue-800 font-semibold py-3 px-6 border border-blue-800
          rounded-xl transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            Set PIN
          </button>
          <button
          className="mr-4 text-blue-800 font-semibold py-3 px-6 border border-blue-800
          rounded-xl transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            Reset PIN
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Send size={20} />
            Transfer
          </button>
        </div>
      </div>

      {/* Transfer Modal */}
      {isModalOpen && <TransferModal onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />}
        
    </div>
  );
};

const TransferModal = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    selectedBeneficiary: null,
    bank: '',
    accountNumber: '',
    amount: '',
    narration: '',
    saveBeneficiary: false
  });

  const [errors, setErrors] = useState({});

  const recentBeneficiaries = [
    { id: 1, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: 'XXXXXXXXXX' },
    { id: 2, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: 'XXXXXXXXXX' },
    { id: 3, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: 'XXXXXXXXXX' },
    { id: 4, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: 'XXXXXXXXXX' },
    { id: 5, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: 'XXXXXXXXXX' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleBeneficiarySelect = (beneficiary) => {
    setFormData(prev => ({
      ...prev,
      selectedBeneficiary: beneficiary,
      bank: beneficiary.bankName,
      accountNumber: beneficiary.accountNumber
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bank) {
      newErrors.bank = 'Please select a bank';
    }

    if (!formData.accountNumber) {
      newErrors.accountNumber = 'Please enter account number';
    }

    if (!formData.amount) {
      newErrors.amount = 'Please enter amount';
    }

    if (!formData.narration.trim()) {
      newErrors.narration = 'Please enter narration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="relative p-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex  items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 10h18M7 14h2M7 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className='mx-auto justify-center'>
              <h2 className="text-2xl text-center font-bold text-gray-900">Send Money</h2>
              <p className="text-gray-500 mt-1">Enter details to complete your transfer</p>
            </div>
          </div>

        {/* Form Fields */}
        <div className="px-8 pb-8 space-y-4">
          {/* Bank Selection */}
          <div>
            <div className="relative">
              <select
                value={formData.bank}
                onChange={(e) => handleInputChange('bank', e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select or search for a bank</option>
                <option value="access">Access Bank</option>
                <option value="gtb">GTBank</option>
                <option value="first">First Bank</option>
                <option value="zenith">Zenith Bank</option>
                <option value="uba">UBA</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            {errors.bank && <p className="text-red-500 text-xs mt-1">{errors.bank}</p>}
          </div>

          {/* Account Number */}
          <div>
            <input
              type="text"
              placeholder="Account number"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
          </div>

          {/* Amount */}
          <div>
            <input
              type="text"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Narration */}
          <div>
            <input
              type="text"
              placeholder="Narration"
              value={formData.narration}
              onChange={(e) => handleInputChange('narration', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.narration && <p className="text-red-500 text-xs mt-1">{errors.narration}</p>}
          </div>

          {/* Recent Beneficiaries */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Recent Beneficiaries</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Find Beneficiaries
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentBeneficiaries.map((beneficiary) => (
                <button
                  key={beneficiary.id}
                  onClick={() => handleBeneficiarySelect(beneficiary)}
                  className={`flex-shrink-0 w-32 p-3 bg-white border-2 rounded-xl transition-colors ${
                    formData.selectedBeneficiary?.id === beneficiary.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 truncate">{beneficiary.name}</p>
                  <p className="text-xs text-gray-500 truncate">{beneficiary.bankName}</p>
                  <p className="text-xs text-gray-400 truncate">{beneficiary.accountNumber}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

          {/* Save Beneficiary Checkbox */}
          <div className="flex items-center justify-between py-3">
          <label 
            htmlFor="save-beneficiary"
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            Add to saved beneficiaries?
          </label>
          
          <button
            id="save-beneficiary"
            type="button"
            onClick={() => handleInputChange('saveBeneficiary', !formData.saveBeneficiary)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              formData.saveBeneficiary ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                formData.saveBeneficiary ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

          {/* Proceed Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 rounded-xl transition-colors mt-6 flex items-center justify-center gap-2"
          >
            Confirm Recipient
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TransferForm;