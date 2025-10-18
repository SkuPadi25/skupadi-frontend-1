import React, { useState } from 'react';
import { Building2, X, Send, ArrowLeft } from 'lucide-react';

  // At the top of your TransferFormDemo component:
import SetPinModal from './modals/SetPinModal';
import VerifyIdentityModal from './modals/VerifyIdentityModal';
import EnterPinModal from './modals/EnterPinModal';


const TransferFormNew = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAmountModalOpen, setIsAmountModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  

  // Add these state variables:
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isEnterPinModalOpen, setIsEnterPinModalOpen] = useState(false);
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
      accountName: 'Receiver Account Name' // Mock - would come from API
    }));
    setIsModalOpen(false);
    setIsAmountModalOpen(true);
  };

  const handleAmountContinue = (amount) => {
    const fee = calculateFee(amount);
    const total = parseFloat(amount) + fee;
    
    setTransferData(prev => ({
      ...prev,
      amount: amount,
      fee: fee,
      total: total
    }));
    setIsAmountModalOpen(false);
    setIsConfirmationModalOpen(true);
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
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Send size={20} />
            Transfer
          </button>
        </div>
      </div>
            <SetPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={(data) => {
            console.log('PIN set:', data);
            setIsPinModalOpen(false);
            setIsVerifyModalOpen(true);
        }}
        />

        <VerifyIdentityModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        email="user@email.com"
        onVerify={(data) => {
            console.log('Verified:', data);
            setIsVerifyModalOpen(false);
            alert(`${pinMode === 'set' ? 'PIN set' : 'PIN reset'} successfully!`);
        }}
        />

        <EnterPinModal
        isOpen={isEnterPinModalOpen}
        onClose={() => setIsEnterPinModalOpen(false)}
        onConfirm={(data) => {
            console.log('PIN entered:', data);
            setIsEnterPinModalOpen(false);
            // Process payment here
        }}
        onResetPin={() => {
            setPinMode('reset');
            setIsPinModalOpen(true);
        }}
        />
        
      {/* Modal 1: Send Money */}
      {isModalOpen && (
        <SendMoneyModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleRecipientConfirm}
          userAccount={userAccount}
        />
      )}

      {/* Modal 2: Add Amount */}
      {isAmountModalOpen && (
        <AddAmountModal 
          onClose={() => setIsAmountModalOpen(false)} 
          onContinue={handleAmountContinue}
          userAccount={userAccount}
          transferData={transferData}
        />
      )}

      {/* Modal 3: Payment Confirmation */}
      {isConfirmationModalOpen && (
        <PaymentConfirmationModal 
          onClose={() => setIsConfirmationModalOpen(false)} 
          onConfirm={handleFinalConfirm}
          transferData={transferData}
        />
      )}
    </div>
  );
};

 // Modal 1: Send Money
const SendMoneyModal = ({ onSubmit, onClose, userAccount }) => {
  const [formData, setFormData] = useState({
    selectedBeneficiary: null,
    bank: '',
    accountNumber: '',
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
    if (!formData.narration.trim()) newErrors.narration = 'Please enter narration';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
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
            <p className="text-blue-700 mt-1">Enter details to complete your transfer</p>
            </div>
          </div>

          {/* Paying From */}
          <p className="text-sm text-center text-gray-500 mb-2">Paying From</p>
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
        </div>

        <div className="px-8 pb-8 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter receiver's account number"
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
            <div className="flex gap-3 overflow-x-auto pb-2">
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

          <div className="flex items-center justify-between py-3">
            <label htmlFor="save-beneficiary" className="text-sm text-gray-700 cursor-pointer">
              Add to saved beneficiaries?
            </label>
            <button
              id="save-beneficiary"
              type="button"
              onClick={() => handleInputChange('saveBeneficiary', !formData.saveBeneficiary)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.saveBeneficiary ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.saveBeneficiary ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-1/2 mx-auto flex justify-center bg-blue-900 hover:bg-blue-800 text-center text-white font-semibold py-4 rounded-xl 
                        transition-colors mt-6"
          >
            Confirm Recipient
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal 2: Add Amount
const AddAmountModal = ({ onClose, onContinue, userAccount, transferData }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const fee = amount ? (parseFloat(amount) <= 5000 ? 10 : parseFloat(amount) <= 50000 ? 25 : 50) : 0;
  const total = amount ? parseFloat(amount) + fee : 0;
  const balanceAfter = userAccount.balance - total;

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (parseFloat(amount) > userAccount.balance) {
      setError('Insufficient balance');
      return;
    }
    onContinue(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md">
        <div className="relative p-8">
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 10h18M7 14h2M7 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Add amount</h2>
          </div>

          {/* Paying From */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-2">Paying From</p>
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
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Enter amount</p>
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl font-bold text-gray-900">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0"
                className="text-4xl font-bold text-gray-900 bg-transparent border-none outline-none w-48 text-center"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>

          {/* Balance Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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
          <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
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
              className="py-3 px-6 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors"
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
const PaymentConfirmationModal = ({ onClose, onConfirm, transferData }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md">
        <div className="relative p-8">
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 10h18M7 14h2M7 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Confirm Transaction</h2>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Account Number</span>
              <span className="font-semibold text-gray-900">{transferData.accountNumber}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Account Name</span>
              <span className="font-semibold text-gray-900">{transferData.accountName}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Bank</span>
              <span className="font-semibold text-gray-900">{transferData.bank}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="font-semibold text-gray-900">₦{parseFloat(transferData.amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Transaction Fee</span>
              <span className="font-semibold text-gray-900">₦{transferData.fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">₦{transferData.total.toLocaleString()}</span>
            </div>
            {transferData.narration && (
              <div className="py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500 block mb-1">Description</span>
                <span className="text-gray-900">{transferData.narration}</span>
              </div>
            )}
          </div>

          {/* Confirmation Message */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-900 text-center">
              Confirm transaction details before you proceed with payment
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              Proceed with this transaction
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
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