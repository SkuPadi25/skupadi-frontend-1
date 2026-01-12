import React, { useState } from 'react';
import { Building2, X, Send, ArrowLeft } from 'lucide-react';

  // At the top of your TransferFormDemo component:
import SetPinModal from './modals/SetPinModal';
import VerifyIdentityModal from './modals/VerifyIdentityModal';
import EnterPinModal from './modals/EnterPinModal';

const TRANSFER_STEPS = {
  NONE: null,
  RECIPIENT: 'recipient',
  AMOUNT: 'amount',
  CONFIRM: 'confirm',
  ENTER_PIN: 'enter_pin',
  SET_PIN: 'set_pin',
  VERIFY: 'verify'
};


const TransferFormNew = () => {
  const [currentStep, setCurrentStep] = useState(TRANSFER_STEPS.NONE);

  const [pinMode, setPinMode] = useState('set'); // 'set' or 'reset'

  const [transferData, setTransferData] = useState({
    bank: '',
    accountNumber: '',
    accountName: '',
    narration: '',
    amount: '',
    fee: 0,
    total: 0,
    saveBeneficiary: false
  });

  // Mock user data
  const userAccount = {
    name: 'User Account Name',
    accountNumber: '1234567890',
    bankName: 'Bank Name',
    balance: 5000000.00
  };

  const handleRecipientConfirm = (formData) => {
  setTransferData(prev => ({
    ...prev,
    ...formData,
    accountName: 'Receiver Account Name'
  }));

  setCurrentStep(TRANSFER_STEPS.AMOUNT);
};


const handleAmountContinue = (amount) => {
  const fee = calculateFee(amount);
  const total = Number(amount) + fee;

  setTransferData(prev => ({
    ...prev,
    amount,
    fee,
    total
  }));

  setCurrentStep(TRANSFER_STEPS.CONFIRM);
};

  const calculateFee = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount <= 5000) return 10;
    if (numAmount <= 50000) return 25;
    return 50;
  };

  const handleFinalConfirm = () => {
    console.log('Final transfer data:', transferData);
    alert('Payment processed successfully!');
    setIsConfirmationModalOpen(false);
    // Reset form
    setTransferData({
      bank: '',
      accountNumber: '',
      accountName: '',
      narration: '',
      amount: '',
      fee: 0,
      total: 0,
      saveBeneficiary: false
    });
  };

  const handleConfirmRecipient = () => {
    setCurrentStep(TRANSFER_STEPS.ENTER_PIN);
  };

  const handleFinalSubmit = () => {
    console.log('FINAL TRANSFER DATA:', transferData);

    alert('Payment processed successfully');

    setTransferData({
    bank: '',
    accountNumber: '',
    accountName: '',
    narration: '',
    amount: '',
    fee: 0,
    total: 0,
    saveBeneficiary: false
  });

  setCurrentStep(TRANSFER_STEPS.NONE);
};


  return (
    <div className=" bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        
        <div className="flex gap-3">
          <button className="text-blue-800 font-semibold py-3 px-6 bg-blue-200 border border-blue-800 rounded-xl transition-colors 
                                shadow-lg hover:shadow-xl"
          onClick={() => {
                setPinMode('set');
                setIsPinModalOpen(true);
                
            }}>
            Set PIN
          </button>
          <button className="text-blue-800 font-semibold py-3 px-6 border border-blue-800 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            onClick={() => {
            setPinMode('reset');
            setIsVerifyModalOpen(true);
            }}>
            Reset PIN
          </button>
          <button
            onClick={() => setCurrentStep(TRANSFER_STEPS.RECIPIENT)}
            className="bg-gradient-to-r from-[#0a1952] to-[#1638b8]
             hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Send size={20} />
            Transfer
          </button>
        </div>
      </div>
          {currentStep === TRANSFER_STEPS.RECIPIENT && (
      <SendMoneyModal
        userAccount={userAccount}
        transferData={transferData}
        onClose={() => setCurrentStep(TRANSFER_STEPS.NONE)}
        onSubmit={handleRecipientConfirm}
      />
    )}

    {currentStep === TRANSFER_STEPS.AMOUNT && (
      <AddAmountModal
        userAccount={userAccount}
        transferData={transferData}
        onClose={() => setCurrentStep(TRANSFER_STEPS.RECIPIENT)}
        onContinue={handleAmountContinue}
      />
    )}

    {currentStep === TRANSFER_STEPS.CONFIRM && (
      <PaymentConfirmationModal
        transferData={transferData}
        onClose={() => setCurrentStep(TRANSFER_STEPS.AMOUNT)}
        onConfirm={handleConfirmRecipient}
        onToggleSave={() =>
          setTransferData(prev => ({
            ...prev,
            saveBeneficiary: !prev.saveBeneficiary
          }))
        }
      />
    )}

    {currentStep === TRANSFER_STEPS.ENTER_PIN && (
      <EnterPinModal
        isOpen
        onClose={() => setCurrentStep(TRANSFER_STEPS.CONFIRM)}
        onConfirm={handleFinalSubmit}
        onResetPin={() => setCurrentStep(TRANSFER_STEPS.SET_PIN)}
      />
    )}

    {currentStep === TRANSFER_STEPS.SET_PIN && (
      <SetPinModal
        isOpen
        onClose={() => setCurrentStep(TRANSFER_STEPS.NONE)}
        onSuccess={() => setCurrentStep(TRANSFER_STEPS.VERIFY)}
      />
    )}

    {currentStep === TRANSFER_STEPS.VERIFY && (
      <VerifyIdentityModal
        isOpen
        email="user@email.com"
        onClose={() => setCurrentStep(TRANSFER_STEPS.NONE)}
        onVerify={() => setCurrentStep(TRANSFER_STEPS.NONE)}
      />
    )}

    </div>
  );
};

 // Modal 1: Send Money
const SendMoneyModal = ({ onSubmit, onClose, userAccount, transferData }) => {
  const [formData, setFormData] = useState({
  bank: transferData.bank,
  accountNumber: transferData.accountNumber,
  narration: transferData.narration,
  saveBeneficiary: transferData.saveBeneficiary,
  selectedBeneficiary: null
});


  const [errors, setErrors] = useState({});

  const recentBeneficiaries = [
    { id: 1, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: '1357902468' },
    { id: 2, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: 'XXXXXXXXXX' },
    { id: 3, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: 'XXXXXXXXXX' },
    { id: 4, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: 'XXXXXXXXXX' },
    { id: 5, name: 'Receiver Name', bankName: 'Bank Name', accountNumber: 'XXXXXXXXXX' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
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
    if (!formData.bank) newErrors.bank = 'Please select a bank';
    if (!formData.accountNumber) newErrors.accountNumber = 'Please enter account number';
    // if (!formData.narration.trim()) newErrors.narration = 'Please enter narration';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        'bank':formData.bank,
        'accountNumber': formData.accountNumber,
        'narration': formData.narration,
        'saveBeneficiary': formData.saveBeneficiary
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative p-8 pb-6">
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X size={20} />
          </button>
          
          <div className="flex items-center mb-6">
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
            <p className="text-blue-700 text-bold mt-1">Enter details to complete your transfer</p>
            </div>
          </div>

          {/* Paying From */}
          <p className="text-sm text-center text-gray-500 mb-2">Paying From</p>
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            
            <div className="flex items-center gap-3 bg-white">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {userAccount.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className=''>
                <p className="font-semibold text-gray-900">{userAccount.name}</p>
                <p className="text-sm text-gray-500">{userAccount.bankName} ******{userAccount.accountNumber.slice(-4)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 space-y-2">
          <div>
            <p>Enter receiver's account number</p>
            <input
              type="text"
              placeholder="0612349910"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
            <p className='text-md font-bold mt-1'>Receiver Account Name</p>
          </div>

          <div>
            <div className="relative">
              <select
                value={formData.bank}
                onChange={(e) => handleInputChange('bank', e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select or search for a bank</option>
                <option value="Access Bank">Access Bank</option>
                <option value="GTBank">GTBank</option>
                <option value="First Bank">First Bank</option>
                <option value="Zenith Bank">Zenith Bank</option>
                <option value="UBA">UBA</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            {errors.bank && <p className="text-red-500 text-xs mt-1">{errors.bank}</p>}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Recent Beneficiaries</h3>
              <button className="text-sm text-blue-600 underline hover:text-blue-700 font-medium">Find Beneficiaries</button>
            </div>
            <div className="flex gap-3 overflow-x-hidden pb-2">
              {recentBeneficiaries.map((beneficiary) => (
                <button
                  key={beneficiary.id}
                  onClick={() => handleBeneficiarySelect(beneficiary)}
                  className={`flex-shrink-0 w-32 p-3 bg-white border-2 rounded-xl transition-colors ${
                    formData.selectedBeneficiary?.id === beneficiary.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500'
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
          <button
            onClick={handleSubmit}
            className="w-1/2 mx-auto flex justify-center bg-gradient-to-r from-[#0a1952] to-[#1638b8] 
            hover:bg-blue-800 text-center text-white font-semibold py-4 rounded-xl 
                        transition-colors mt-6 space-y-4"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal 2: Add Amount
const AddAmountModal = ({ onClose, onContinue, userAccount, transferData }) => {
  const [amount, setAmount] = useState(transferData.amount || '');
  const [error, setError] = useState('');

  const fee = amount ? (parseFloat(amount) <= 5000 ? 10 : parseFloat(amount) <= 50000 ? 25 : 50) : 0;
  const total = amount ? parseFloat(amount) + fee : 0;
  const balanceAfter = userAccount.balance - total;

  const handleContinue = () => {
  if (!amount || Number(amount) <= 0) {
    setError('Please enter a valid amount');
    return;
  }

  if (Number(amount) > userAccount.balance) {
    setError('Insufficient balance');
    return;
  }

  onContinue(amount);
};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
      <div className="bg-gray-200 rounded-3xl w-full max-w-2xl px-8">
        <div className="relative p-8">
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-lg font-bold text-gray-900">Add amount</h2>
          </div>

          {/* Paying From */}
          <p className="text-md text-center text-gray-500 mb-2">Paying From</p>
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {userAccount.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{userAccount.name}</p>
                <p className="text-sm text-gray-500">{userAccount.bankName} ******{userAccount.accountNumber.slice(-4)}</p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col justify-center mb-6">
            <p className="text-sm text-center text-gray-600 mb-3">Enter amount</p>
            <div className="flex items-center justify-center mb-6 w-2/3 bg-gray-50 rounded-xl">
              <span className="text-4xl font-bold text-gray-900">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0"
                className="no-spinner text-4xl font-bold text-gray-900 bg-transparent border-none outline-none w-48 text-center"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>

          {/* Balance Info */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 pt-4 rounded-t rounded-xl">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Wallet Balance Before</p>
              <p className="font-semibold text-gray-900">₦{userAccount.balance.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Wallet Balance After</p>
              <p className="font-semibold text-gray-900">₦{balanceAfter.toLocaleString()}</p>
            </div>
          </div>

          {/* Fee Details */}
          <div className="space-y-3 mb-6 p-4 bg-gray-50 ">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="font-semibold">₦{amount || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fee</span>
              <span className="font-semibold">₦{fee}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Total debit</span>
              <span className="font-bold text-gray-900">₦{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="py-3 px-6 bg-gradient-to-r from-[#0a1952] to-[#1638b8] text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal 3: Payment Confirmation

const PaymentConfirmationModal = ({ onClose, onConfirm, onToggleSave, transferData }) => {
  const {
    accountName,
    bank,
    accountNumber,
    saveBeneficiary = false
  } = transferData || {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#f3f4f6] rounded-3xl w-full max-w-xl">
        <div className="relative p-8">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={20} />
          </button>

          {/* Bank Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-blue-900"
              >
                <path
                  d="M3 10h18M5 10V20h14V10M12 3l9 5H3l9-5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 mb-1">
              Sending money to
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              {accountName || 'Receiver Account Number'}
            </h2>
            <p className="mt-2 text-gray-700">
              {bank} {accountNumber}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-blue-600 mb-6" />

          {/* Save Beneficiary */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg text-gray-900">
              Add to saved beneficiaries?
            </span>

            <button
              onClick={onToggleSave}
              className={`w-14 h-8 flex items-center rounded-full px-1 transition-colors ${
                saveBeneficiary ? "bg-blue-900" : "bg-gray-300"
              }`}
            >
              <span
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  saveBeneficiary ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-blue-600 mb-8" />

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={onConfirm}
              className="w-full py-4 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-[#0a1952] to-[#1638b8]"
            >
              Confirm Recipient
            </button>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl border-2 border-blue-900 text-blue-900 font-semibold text-lg hover:bg-blue-50"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};


export default TransferFormNew;