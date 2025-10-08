import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const TransferForm = ({ onSubmit, selectedRecipient, onAddBeneficiary }) => {
  const [formData, setFormData] = useState({
    recipient: selectedRecipient,
    amount: '',
    description: '',
    purpose: ''
  });

  const [errors, setErrors] = useState({});
  const availableBalance = 2450000; // Mock balance

  React.useEffect(() => {
    if (selectedRecipient) {
      setFormData(prev => ({
        ...prev,
        recipient: selectedRecipient
      }));
    }
  }, [selectedRecipient]);

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
  };

  const formatCurrency = (value) => {
    const numValue = value?.replace(/[₦,]/g, '');
    if (!numValue) return '';
    return '₦' + Number(numValue)?.toLocaleString();
  };

  const handleAmountChange = (value) => {
    const formatted = formatCurrency(value);
    handleInputChange('amount', formatted);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.recipient) {
      newErrors.recipient = 'Please select a recipient';
    }

    if (!formData?.amount) {
      newErrors.amount = 'Please enter an amount';
    } else {
      const numAmount = parseFloat(formData?.amount?.replace(/[₦,]/g, ''));
      if (numAmount <= 0) {
        newErrors.amount = 'Amount must be greater than zero';
      } else if (numAmount > availableBalance) {
        newErrors.amount = 'Insufficient funds';
      }
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData?.purpose) {
      newErrors.purpose = 'Please select a purpose';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const recipientOptions = [
    { value: '', label: 'Select recipient', disabled: true },
    { value: 'add-new', label: '+ Add New Beneficiary', special: true }
  ];

  const purposeOptions = [
    { value: '', label: 'Select purpose', disabled: true },
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
  ];

  const handleRecipientChange = (value) => {
    if (value === 'add-new') {
      onAddBeneficiary?.();
    } else {
      handleInputChange('recipient', value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Recipient Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Recipient *
        </label>
        {selectedRecipient ? (
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                  <Icon name="Building2" size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedRecipient?.accountName}</p>
                  <p className="text-sm text-muted-foreground">{selectedRecipient?.bankName}</p>
                  <p className="text-xs text-muted-foreground">{selectedRecipient?.accountNumber}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleInputChange('recipient', null)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <Select
            value={formData?.recipient || ''}
            onChange={handleRecipientChange}
            options={recipientOptions}
            error={errors?.recipient}
            placeholder="Select recipient"
          />
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Amount *
        </label>
        <Input
          type="text"
          placeholder="₦0"
          value={formData?.amount}
          onChange={(e) => handleAmountChange(e?.target?.value)}
          error={errors?.amount}
          icon="DollarSign"
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground">
            Available: ₦{availableBalance?.toLocaleString()}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAmountChange(availableBalance?.toString())}
          >
            Use Max
          </Button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description *
        </label>
        <Input
          type="text"
          placeholder="Enter transfer description or reference"
          value={formData?.description}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          error={errors?.description}
          icon="FileText"
        />
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Purpose *
        </label>
        <Select
          value={formData?.purpose}
          onChange={(value) => handleInputChange('purpose', value)}
          options={purposeOptions}
          error={errors?.purpose}
          placeholder="Select purpose"
        />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full"
        size="lg"
        disabled={!formData?.recipient || !formData?.amount || !formData?.description || !formData?.purpose}
      >
        <Icon name="ArrowUpRight" size={16} className="mr-2" />
        Continue Transfer
      </Button>
    </form>
  );
};

export default TransferForm;