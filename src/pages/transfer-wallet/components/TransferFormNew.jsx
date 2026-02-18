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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
      <div className="bg-white rounded-3xl w-full max-w-2xl">
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
              <div className="w-10 h-10 rounded-full bg-[#0a1952] flex items-center justify-center text-white font-semibold">
                {userAccount.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className=''>
                <p className="font-semibold text-gray-900">{userAccount.name}</p>
                <p className="text-sm text-gray-500">{userAccount.bankName} ******{userAccount.accountNumber.slice(-4)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-8 space-y-2">
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

          <div className="my-6">
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
            className="w-full mx-auto flex justify-center bg-gradient-to-r from-[#0a1952] to-[#1638b8] 
            hover:bg-blue-800 text-center text-white py-4 rounded-xl 
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
  const [narration, setNarration] = useState('');

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


          {/* Amount Input */}
          <div className="flex flex-col justify-center mb-6">
            <p className="text-sm text-center text-gray-600 mb-3">Enter amount</p>
            <div className="w-4/5 flex items-center text-center justify-center 
            mb-6 pl-12 ml-14 bg-gray-50 rounded-xl">
              <span className="text-4xl ml-24 font-bold text-gray-900">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value.toLocaleString());
                  setError('');
                }}
                placeholder="0"
                className="no-spinner text-4xl font-bold text-gray-900 bg-transparent border-none outline-none w-48 "
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>

          {/* Balance Info */}
          <div className='p-2 bg-white rounded-xl mb-8'>
            <div className="grid grid-cols-2 gap-4 bg-white pt-4">
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
          <div className="space-y-3 p-4 bg-white">
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
          </div>
          
          {/* Narration area */}
          <div className='bg-white p-8 rounded rounded-xl mb-4'>
            <div className="flex items-start text-start mb-6 bg-gray-200 rounded-sm">
              <input
                type="text"
                placeholder="Enter payment description"
                value={narration}
                onChange={(e) => {
                  setNarration(e.target.value.toLocaleString());
                  setError('');
                }}
                className="no-spinner p-2 text-xl text-gray-900 bg-gray-200 
                border-none outline-none rounded rounded-xl"
              />
            </div>

            {/* recurring payment  */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg text-gray-900">
              Make this a recurring payment?
            </span>

            <button
              // onClick={pass}
              className={`w-14 h-8 flex items-center rounded-full px-1 transition-colors ${
                'saveBeneficiary' ? "bg-blue-900" : "bg-gray-300"
              }`}
            >
              <span
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  'saveBeneficiary' ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          </div>
          
          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            
            <button
              onClick={handleContinue}
              className="py-3 px-6 bg-gradient-to-r from-[#0a1952] to-[#1638b8] text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              Continue
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold 
              text-blue-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
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
            <p className="my-2 text-gray-700">
              {bank} {accountNumber}
            </p>
            { saveBeneficiary ||
            <p>This recipient is not currently saved as a beneficiary.<br/>
              Kindly reconfirm the beneficiary as payment can not be recalled.
            </p>
            }
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

// Modal 4: Payment Cancellation
const PaymentCancellationModal = ({ onClose, onConfirm, onToggleSave, }) => {
  const [x,setX] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#f3f4f6] rounded-3xl w-full max-w-xl">
        <div className="relative p-8">

          {/* Bank Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center">
              <svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="85" height="85" rx="42.5" fill="#E26313" fill-opacity="0.33"/>
                <circle cx="42.5" cy="42.5" r="37.5" fill="#E27429" fill-opacity="0.4"/>
                <circle cx="43" cy="42" r="29" fill="#D55209"/>
                <path d="M45.73 28.5949C45.4587 28.1098 45.0629 27.7058 44.5835 27.4246C44.1041 27.1434 43.5583 26.9951 43.0025 26.9951C42.4467 26.9951 41.9009 27.1434 41.4215 27.4246C40.942 27.7058 40.5463 28.1098 40.275 28.5949L28.3925 49.8499C28.1267 50.3253 27.9898 50.8619 27.9953 51.4066C28.0008 51.9512 28.1486 52.4849 28.424 52.9549C28.6994 53.4248 29.0928 53.8146 29.5652 54.0856C30.0377 54.3566 30.5728 54.4994 31.1175 54.4999H54.8775C55.4224 54.4998 55.9578 54.3574 56.4306 54.0865C56.9034 53.8157 57.2972 53.4259 57.5729 52.956C57.8485 52.486 57.9965 51.952 58.0022 51.4072C58.0078 50.8623 57.8709 50.3255 57.605 49.8499L45.73 28.5949Z" fill="url(#paint0_linear_9882_16285)"/>
                <path d="M44.875 47.625C44.875 48.1223 44.6775 48.5992 44.3258 48.9508C43.9742 49.3025 43.4973 49.5 43 49.5C42.5027 49.5 42.0258 49.3025 41.6742 48.9508C41.3225 48.5992 41.125 48.1223 41.125 47.625C41.125 47.1277 41.3225 46.6508 41.6742 46.2992C42.0258 45.9475 42.5027 45.75 43 45.75C43.4973 45.75 43.9742 45.9475 44.3258 46.2992C44.6775 46.6508 44.875 47.1277 44.875 47.625ZM41.75 42V35.75C41.75 35.4185 41.8817 35.1005 42.1161 34.8661C42.3505 34.6317 42.6685 34.5 43 34.5C43.3315 34.5 43.6495 34.6317 43.8839 34.8661C44.1183 35.1005 44.25 35.4185 44.25 35.75V42C44.25 42.3315 44.1183 42.6495 43.8839 42.8839C43.6495 43.1183 43.3315 43.25 43 43.25C42.6685 43.25 42.3505 43.1183 42.1161 42.8839C41.8817 42.6495 41.75 42.3315 41.75 42Z" fill="url(#paint1_linear_9882_16285)"/>
                <defs>
                <linearGradient id="paint0_linear_9882_16285" x1="32.68" y1="22.6974" x2="49.8125" y2="58.3124" gradientUnits="userSpaceOnUse">
                <stop stop-color="white"/>
                <stop offset="1" stop-color="white"/>
                </linearGradient>
                <linearGradient id="paint1_linear_9882_16285" x1="38" y1="34.5" x2="44.165" y2="50.9375" gradientUnits="userSpaceOnUse">
                <stop stop-color="#4A4A4A"/>
                <stop offset="1" stop-color="#212121"/>
                </linearGradient>
                </defs>
              </svg>jj
            </div>
          </div>

          {/* Recipient Info */}
          <div className="text-center mb-8">
            <h2>Cancel This Traansaction</h2>
            <p className="text-sm text-gray-600 mb-1">
              Are you sure you want to cancel this payment?
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              {accountName || 'Receiver Account Number'}
            </h2>
            <p className="my-2 text-gray-700">
              {bank} {accountNumber}
            </p>
          </div>
   
          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={onConfirm}
              className="w-full py-4 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-[#0a1952] to-[#1638b8]"
            >
              Continue with this payment
            </button>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl border-2 border-blue-900 text-blue-900 font-semibold text-lg hover:bg-blue-50"
            >
              Yes, Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );

};

export default TransferFormNew;