import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const TransferModal = ({ isOpen, onClose, onTransferComplete }) => {
  const [formData, setFormData] = useState({
    amount: '',
    accountNumber: '',
    accountName: '',
    bankName: '',
    transferType: 'bank',
    description: '',
    pin: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPinField, setShowPinField] = useState(false);

  const bankOptions = [
    { value: 'first-bank', label: 'First Bank Nigeria' },
    { value: 'gtb', label: 'Guaranty Trust Bank' },
    { value: 'access-bank', label: 'Access Bank' },
    { value: 'zenith-bank', label: 'Zenith Bank' },
    { value: 'uba', label: 'United Bank for Africa' }
  ];

  const transferTypeOptions = [
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'wallet', label: 'Wallet Transfer' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccountNumberChange = async (value) => {
    setFormData(prev => ({
      ...prev,
      accountNumber: value,
      accountName: '' // Reset account name when account number changes
    }));

    // Mock account name resolution (in real app, this would call an API)
    if (value?.length === 10) {
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          accountName: 'John Doe' // Mock resolved name
        }));
      }, 500);
    }
  };

  const validateForm = () => {
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      alert('Please enter a valid amount');
      return false;
    }
    if (!formData?.accountNumber || formData?.accountNumber?.length !== 10) {
      alert('Please enter a valid 10-digit account number');
      return false;
    }
    if (!formData?.bankName) {
      alert('Please select a bank');
      return false;
    }
    if (!formData?.description?.trim()) {
      alert('Please enter a description');
      return false;
    }
    return true;
  };

  const handleProceed = () => {
    if (!validateForm()) return;
    setShowPinField(true);
  };

  const handleTransfer = async () => {
    if (!formData?.pin || formData?.pin?.length !== 4) {
      alert('Please enter your 4-digit PIN');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock transfer process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success
      const transferResult = {
        id: 'TXN-' + Date.now(),
        amount: formData?.amount,
        recipient: formData?.accountName,
        bank: formData?.bankName,
        reference: 'REF-' + Date.now(),
        status: 'Success',
        date: new Date()?.toISOString()
      };
      
      onTransferComplete(transferResult);
    } catch (error) {
      alert('Transfer failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowPinField(false);
    setFormData(prev => ({ ...prev, pin: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {showPinField ? 'Confirm Transfer' : 'Transfer Funds'}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="p-6">
          {!showPinField ? (
            <div className="space-y-4">
              {/* Transfer Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Transfer Type
                </label>
                <Select
                  value={formData?.transferType}
                  onChange={(value) => handleInputChange('transferType', value)}
                  options={transferTypeOptions}
                  placeholder="Select transfer type"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount (₦)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData?.amount}
                  onChange={(e) => handleInputChange('amount', e?.target?.value)}
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account Number
                </label>
                <Input
                  type="text"
                  placeholder="Enter 10-digit account number"
                  value={formData?.accountNumber}
                  onChange={(e) => handleAccountNumberChange(e?.target?.value)}
                  maxLength={10}
                />
              </div>

              {/* Account Name (Auto-resolved) */}
              {formData?.accountName && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Account Name
                  </label>
                  <div className="p-3 bg-muted/50 rounded-md border border-border">
                    <p className="text-foreground font-medium">{formData?.accountName}</p>
                  </div>
                </div>
              )}

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bank
                </label>
                <Select
                  value={formData?.bankName}
                  onChange={(value) => handleInputChange('bankName', value)}
                  options={bankOptions}
                  placeholder="Select bank"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <Input
                  type="text"
                  placeholder="Payment description"
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleProceed} className="flex-1">
                  Proceed
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Transfer Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-foreground">Transfer Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium text-foreground">₦{formData?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium text-foreground">{formData?.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-medium text-foreground">
                      {bankOptions?.find(bank => bank?.value === formData?.bankName)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description:</span>
                    <span className="font-medium text-foreground">{formData?.description}</span>
                  </div>
                </div>
              </div>

              {/* PIN Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Enter your 4-digit PIN
                </label>
                <Input
                  type="password"
                  placeholder="****"
                  value={formData?.pin}
                  onChange={(e) => handleInputChange('pin', e?.target?.value)}
                  maxLength={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleTransfer} 
                  className="flex-1" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icon name="Loader" size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={16} className="mr-2" />
                      Transfer
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferModal;