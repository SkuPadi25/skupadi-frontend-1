import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AddBeneficiaryModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const bankOptions = [
    { value: '', label: 'Select bank', disabled: true },
    { value: 'first-bank', label: 'First Bank' },
    { value: 'gtbank', label: 'GTBank' },
    { value: 'access-bank', label: 'Access Bank' },
    { value: 'zenith-bank', label: 'Zenith Bank' },
    { value: 'uba', label: 'UBA' },
    { value: 'fidelity-bank', label: 'Fidelity Bank' },
    { value: 'union-bank', label: 'Union Bank' },
    { value: 'sterling-bank', label: 'Sterling Bank' },
    { value: 'wema-bank', label: 'Wema Bank' },
    { value: 'fcmb', label: 'FCMB' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Reset verification when account details change
    if ((field === 'bankName' || field === 'accountNumber') && isVerified) {
      setIsVerified(false);
      setFormData(prev => ({
        ...prev,
        accountName: ''
      }));
    }
  };

  const validateAccountDetails = async () => {
    if (!formData?.bankName || !formData?.accountNumber) {
      setErrors({
        bankName: !formData?.bankName ? 'Please select a bank' : null,
        accountNumber: !formData?.accountNumber ? 'Please enter account number' : null
      });
      return;
    }

    if (formData?.accountNumber?.length !== 10) {
      setErrors({
        accountNumber: 'Account number must be 10 digits'
      });
      return;
    }

    setIsVerifying(true);
    
    // Mock API call for account verification
    setTimeout(() => {
      // Simulate successful verification
      const mockAccountName = 'Account Holder Name';
      setFormData(prev => ({
        ...prev,
        accountName: mockAccountName
      }));
      setIsVerified(true);
      setIsVerifying(false);
    }, 2000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.bankName) {
      newErrors.bankName = 'Please select a bank';
    }

    if (!formData?.accountNumber) {
      newErrors.accountNumber = 'Please enter account number';
    } else if (formData?.accountNumber?.length !== 10) {
      newErrors.accountNumber = 'Account number must be 10 digits';
    }

    if (!formData?.accountName) {
      newErrors.accountName = 'Please verify account details first';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm() && isVerified) {
      const newBeneficiary = {
        id: Date.now(),
        bankName: bankOptions?.find(b => b?.value === formData?.bankName)?.label,
        accountNumber: formData?.accountNumber,
        accountName: formData?.accountName,
        lastUsed: new Date()?.toISOString()?.split('T')?.[0]
      };
      
      onAdd?.(newBeneficiary);
      onClose?.();
      
      // Reset form
      setFormData({
        bankName: '',
        accountNumber: '',
        accountName: ''
      });
      setIsVerified(false);
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose?.();
    // Reset form
    setFormData({
      bankName: '',
      accountNumber: '',
      accountName: ''
    });
    setIsVerified(false);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Add New Beneficiary</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bank Name *
            </label>
            <Select
              value={formData?.bankName}
              onChange={(value) => handleInputChange('bankName', value)}
              options={bankOptions}
              error={errors?.bankName}
              placeholder="Select bank"
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Account Number *
            </label>
            <Input
              type="text"
              placeholder="Enter 10-digit account number"
              value={formData?.accountNumber}
              onChange={(e) => {
                const value = e?.target?.value?.replace(/\D/g, '');
                if (value?.length <= 10) {
                  handleInputChange('accountNumber', value);
                }
              }}
              error={errors?.accountNumber}
              icon="CreditCard"
              maxLength={10}
            />
          </div>

          {/* Verify Button */}
          {formData?.bankName && formData?.accountNumber?.length === 10 && !isVerified && (
            <Button
              type="button"
              onClick={validateAccountDetails}
              disabled={isVerifying}
              className="w-full"
              variant="outline"
            >
              {isVerifying ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Verify Account
                </>
              )}
            </Button>
          )}

          {/* Account Name */}
          {isVerified && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Account Name
              </label>
              <div className="bg-secondary rounded-lg p-3 border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-foreground font-medium">{formData?.accountName}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!isVerified}
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              Add Beneficiary
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBeneficiaryModal;