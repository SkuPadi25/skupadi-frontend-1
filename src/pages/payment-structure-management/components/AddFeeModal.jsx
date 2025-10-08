import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AddFeeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'termly',
    category: 'academic',
    mandatory: true,
    description: '',
    // New installment-related fields
    allowInstallments: false,
    maxInstallments: '3',
    minInstallmentAmount: ''
  });
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { label: 'Academic', value: 'academic' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Accommodation', value: 'accommodation' },
    { label: 'Activities', value: 'activities' },
    { label: 'Administrative', value: 'administrative' },
    { label: 'Other', value: 'other' }
  ];

  const frequencyOptions = [
    { label: 'One-time', value: 'one_time' },
    { label: 'Termly', value: 'termly' },
    { label: 'Annually', value: 'annually' },
    { label: 'Custom', value: 'custom' }
  ];

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Fee name is required';
    }
    
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Validate installment settings
    if (formData?.allowInstallments) {
      if (!formData?.maxInstallments || parseInt(formData?.maxInstallments) < 2) {
        newErrors.maxInstallments = 'Maximum installments must be at least 2';
      }
      
      if (formData?.minInstallmentAmount) {
        const minAmount = parseFloat(formData?.minInstallmentAmount);
        const totalAmount = parseFloat(formData?.amount);
        const maxInstallments = parseInt(formData?.maxInstallments);
        
        if (minAmount <= 0) {
          newErrors.minInstallmentAmount = 'Minimum installment amount must be greater than 0';
        } else if (minAmount * maxInstallments > totalAmount) {
          newErrors.minInstallmentAmount = 'Minimum amount would exceed total fee amount';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const feeData = {
      ...formData,
      amount: parseFloat(formData?.amount),
      maxInstallments: formData?.allowInstallments ? parseInt(formData?.maxInstallments) : null,
      minInstallmentAmount: formData?.allowInstallments && formData?.minInstallmentAmount 
        ? parseFloat(formData?.minInstallmentAmount) 
        : null
    };
    
    onSave?.(feeData);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      name: '',
      amount: '',
      frequency: 'termly',
      category: 'academic',
      mandatory: true,
      description: '',
      allowInstallments: false,
      maxInstallments: '3',
      minInstallmentAmount: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose?.();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Plus" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Add New Fee Type</h2>
                <p className="text-sm text-muted-foreground">
                  Create a new payment category for the selected class
                </p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Fee Name"
                    required
                    placeholder="e.g., Tuition Fee, School Bus, Exam Fee"
                    value={formData?.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                    error={errors?.name}
                  />
                </div>

                <Input
                  label="Amount (₦)"
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData?.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e?.target?.value }))}
                  error={errors?.amount}
                />

                <Select
                  label="Frequency"
                  options={frequencyOptions}
                  value={formData?.frequency}
                  onChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
                />

                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData?.category}
                  onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                />

                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    id="mandatory"
                    checked={formData?.mandatory}
                    onChange={(e) => setFormData(prev => ({ ...prev, mandatory: e?.target?.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="mandatory" className="text-sm font-medium text-foreground">
                    Mandatory Fee
                  </label>
                </div>
              </div>

              {/* New Installment Configuration Section */}
              <div className="bg-muted/20 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="allowInstallments"
                    checked={formData?.allowInstallments}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowInstallments: e?.target?.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="allowInstallments" className="text-sm font-medium text-foreground">
                    Allow Installment Payments
                  </label>
                </div>

                {formData?.allowInstallments && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Maximum Installments"
                        type="number"
                        min="2"
                        max="12"
                        value={formData?.maxInstallments}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxInstallments: e?.target?.value }))}
                        error={errors?.maxInstallments}
                      />

                      <Input
                        label="Minimum Installment Amount (₦)"
                        type="number"
                        step="0.01"
                        placeholder="Optional"
                        value={formData?.minInstallmentAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, minInstallmentAmount: e?.target?.value }))}
                        error={errors?.minInstallmentAmount}
                      />
                    </div>

                    <div className="bg-info/10 border border-info/20 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Icon name="Info" size={16} className="text-info mt-0.5" />
                        <div>
                          <p className="text-sm text-info/80">
                            When installments are enabled, this fee can be included in payment plans. 
                            Students will be able to pay this fee in multiple installments based on the configured limits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Additional details about this fee..."
                  value={formData?.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                  rows={3}
                  className="w-full p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Fee Preview */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">Fee Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium text-foreground">
                      {formData?.name || 'Fee Name'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Amount</div>
                    <div className="font-medium text-foreground">
                      ₦{formData?.amount ? parseFloat(formData?.amount)?.toLocaleString() : '0.00'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="capitalize font-medium text-foreground">
                      {formData?.category}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        formData?.mandatory 
                          ? 'bg-error/10 text-error' :'bg-success/10 text-success'
                      }`}>
                        {formData?.mandatory ? 'Mandatory' : 'Optional'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Installment Preview */}
                {formData?.allowInstallments && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-2">Installment Options</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <Icon name="Calendar" size={12} className="mr-1" />
                        Max {formData?.maxInstallments} installments
                      </span>
                      {formData?.minInstallmentAmount && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info">
                          Min ₦{parseFloat(formData?.minInstallmentAmount)?.toLocaleString()} per installment
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {formData?.description && (
                  <div className="mt-3">
                    <div className="text-sm text-muted-foreground">Description</div>
                    <div className="text-sm text-foreground">{formData?.description}</div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-info mt-0.5" />
                  <div>
                    <h4 className="font-medium text-info mb-1">Integration with Invoices & Payment Plans</h4>
                    <p className="text-sm text-info/80">
                      This fee type will be automatically available when creating invoices for the selected class.
                      {formData?.allowInstallments 
                        ? ' Since installments are enabled, this fee can also be included in payment plans for flexible payment options.'
                        : ' Enable installments to make this fee available for payment plan configurations.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Fee will be added to the currently selected class
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={!formData?.name || !formData?.amount}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Fee Type
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFeeModal;