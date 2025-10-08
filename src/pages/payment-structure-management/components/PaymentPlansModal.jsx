import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { addMonths, format } from 'date-fns';

const PaymentPlansModal = ({ isOpen, onClose, onSave, availableFees = [] }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [planData, setPlanData] = useState({
    name: '',
    description: '',
    totalAmount: '',
    installmentType: 'fixed_number',
    numberOfInstallments: '3',
    installmentFrequency: 'monthly',
    startDate: new Date()?.toISOString()?.split('T')?.[0],
    gracePeriodDays: '7',
    lateFeeAmount: '',
    selectedFees: [],
    downPaymentRequired: false,
    downPaymentAmount: '',
    downPaymentPercentage: '20'
  });
  const [errors, setErrors] = useState({});
  const [installmentPreview, setInstallmentPreview] = useState([]);

  const installmentTypeOptions = [
    { label: 'Fixed Number of Installments', value: 'fixed_number' },
    { label: 'Fixed Amount per Installment', value: 'fixed_amount' },
    { label: 'Percentage-based Installments', value: 'percentage_based' }
  ];

  const frequencyOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Bi-monthly', value: 'bi_monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Term-based', value: 'termly' }
  ];

  if (!isOpen) return null;

  // Calculate installment preview
  const calculateInstallmentPreview = () => {
    const totalAmount = parseFloat(planData?.totalAmount) || 0;
    const numberOfInstallments = parseInt(planData?.numberOfInstallments) || 1;
    const downPayment = planData?.downPaymentRequired 
      ? (parseFloat(planData?.downPaymentAmount) || 0) 
      : 0;
    
    const remainingAmount = totalAmount - downPayment;
    const installmentAmount = remainingAmount / numberOfInstallments;
    
    const preview = [];
    let currentDate = new Date(planData.startDate);

    // Add down payment if required
    if (planData?.downPaymentRequired && downPayment > 0) {
      preview?.push({
        id: 0,
        type: 'down_payment',
        amount: downPayment,
        dueDate: format(currentDate, 'yyyy-MM-dd'),
        description: 'Down Payment'
      });
    }

    // Add installments
    for (let i = 1; i <= numberOfInstallments; i++) {
      const installmentDate = planData?.installmentFrequency === 'monthly' 
        ? addMonths(new Date(planData.startDate), i)
        : planData?.installmentFrequency === 'quarterly'
        ? addMonths(new Date(planData.startDate), i * 3)
        : addMonths(new Date(planData.startDate), i);

      preview?.push({
        id: i,
        type: 'installment',
        amount: installmentAmount,
        dueDate: format(installmentDate, 'yyyy-MM-dd'),
        description: `Installment ${i} of ${numberOfInstallments}`
      });
    }

    return preview;
  };

  // Update preview when relevant data changes
  React.useEffect(() => {
    if (planData?.totalAmount && planData?.numberOfInstallments && planData?.startDate) {
      setInstallmentPreview(calculateInstallmentPreview());
    }
  }, [
    planData?.totalAmount, 
    planData?.numberOfInstallments, 
    planData?.startDate, 
    planData?.downPaymentRequired,
    planData?.downPaymentAmount,
    planData?.installmentFrequency
  ]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!planData?.name?.trim()) {
      newErrors.name = 'Payment plan name is required';
    }
    
    if (!planData?.totalAmount || parseFloat(planData?.totalAmount) <= 0) {
      newErrors.totalAmount = 'Total amount must be greater than 0';
    }
    
    if (!planData?.numberOfInstallments || parseInt(planData?.numberOfInstallments) < 1) {
      newErrors.numberOfInstallments = 'Number of installments must be at least 1';
    }

    if (planData?.selectedFees?.length === 0) {
      newErrors.selectedFees = 'Please select at least one fee type';
    }

    if (planData?.downPaymentRequired) {
      const totalAmount = parseFloat(planData?.totalAmount) || 0;
      const downPayment = parseFloat(planData?.downPaymentAmount) || 0;
      
      if (downPayment <= 0) {
        newErrors.downPaymentAmount = 'Down payment amount is required';
      } else if (downPayment >= totalAmount) {
        newErrors.downPaymentAmount = 'Down payment cannot be greater than or equal to total amount';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const paymentPlanData = {
      ...planData,
      totalAmount: parseFloat(planData?.totalAmount),
      numberOfInstallments: parseInt(planData?.numberOfInstallments),
      downPaymentAmount: planData?.downPaymentRequired ? parseFloat(planData?.downPaymentAmount) : 0,
      lateFeeAmount: parseFloat(planData?.lateFeeAmount) || 0,
      gracePeriodDays: parseInt(planData?.gracePeriodDays) || 0,
      installments: installmentPreview,
      createdDate: new Date()?.toISOString(),
      status: 'active'
    };
    
    onSave?.(paymentPlanData);
    handleReset();
  };

  const handleReset = () => {
    setPlanData({
      name: '',
      description: '',
      totalAmount: '',
      installmentType: 'fixed_number',
      numberOfInstallments: '3',
      installmentFrequency: 'monthly',
      startDate: new Date()?.toISOString()?.split('T')?.[0],
      gracePeriodDays: '7',
      lateFeeAmount: '',
      selectedFees: [],
      downPaymentRequired: false,
      downPaymentAmount: '',
      downPaymentPercentage: '20'
    });
    setInstallmentPreview([]);
    setErrors({});
    setActiveTab('basic');
  };

  const handleClose = () => {
    handleReset();
    onClose?.();
  };

  const handleFeeSelection = (feeId, checked) => {
    setPlanData(prev => ({
      ...prev,
      selectedFees: checked 
        ? [...prev?.selectedFees, feeId]
        : prev?.selectedFees?.filter(id => id !== feeId)
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'Info' },
    { id: 'installments', label: 'Installment Setup', icon: 'Calendar' },
    { id: 'fees', label: 'Fee Assignment', icon: 'CreditCard' },
    { id: 'preview', label: 'Preview', icon: 'Eye' }
  ];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleClose} />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Calendar" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Create Payment Plan</h2>
                <p className="text-sm text-muted-foreground">
                  Set up installment schedules and payment terms
                </p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="flex h-[calc(95vh-140px)]">
            {/* Sidebar Tabs */}
            <div className="w-64 border-r border-border bg-muted/20">
              <div className="p-4">
                <nav className="space-y-2">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <Input
                          label="Payment Plan Name"
                          required
                          placeholder="e.g., Term 1 Payment Plan, Annual Fee Installment"
                          value={planData?.name}
                          onChange={(e) => setPlanData(prev => ({ ...prev, name: e?.target?.value }))}
                          error={errors?.name}
                        />

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Description
                          </label>
                          <textarea
                            placeholder="Describe the payment plan terms and conditions..."
                            value={planData?.description}
                            onChange={(e) => setPlanData(prev => ({ ...prev, description: e?.target?.value }))}
                            rows={3}
                            className="w-full p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Total Amount (₦)"
                            required
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={planData?.totalAmount}
                            onChange={(e) => setPlanData(prev => ({ ...prev, totalAmount: e?.target?.value }))}
                            error={errors?.totalAmount}
                          />

                          <Input
                            label="Start Date"
                            required
                            type="date"
                            value={planData?.startDate}
                            onChange={(e) => setPlanData(prev => ({ ...prev, startDate: e?.target?.value }))}
                          />
                        </div>

                        {/* Down Payment Option */}
                        <div className="bg-muted/20 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <input
                              type="checkbox"
                              id="downPaymentRequired"
                              checked={planData?.downPaymentRequired}
                              onChange={(e) => setPlanData(prev => ({ ...prev, downPaymentRequired: e?.target?.checked }))}
                              className="rounded"
                            />
                            <label htmlFor="downPaymentRequired" className="text-sm font-medium text-foreground">
                              Require Down Payment
                            </label>
                          </div>

                          {planData?.downPaymentRequired && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                label="Down Payment Amount (₦)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={planData?.downPaymentAmount}
                                onChange={(e) => setPlanData(prev => ({ ...prev, downPaymentAmount: e?.target?.value }))}
                                error={errors?.downPaymentAmount}
                              />
                              <div className="flex items-end">
                                <div className="text-sm text-muted-foreground">
                                  {planData?.totalAmount && planData?.downPaymentAmount 
                                    ? `${((parseFloat(planData?.downPaymentAmount) / parseFloat(planData?.totalAmount)) * 100)?.toFixed(1)}% of total`
                                    : 'Percentage of total'
                                  }
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Installment Setup Tab */}
                {activeTab === 'installments' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Installment Configuration</h3>
                      <div className="space-y-4">
                        <Select
                          label="Installment Type"
                          options={installmentTypeOptions}
                          value={planData?.installmentType}
                          onChange={(value) => setPlanData(prev => ({ ...prev, installmentType: value }))}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Number of Installments"
                            required
                            type="number"
                            min="1"
                            max="12"
                            value={planData?.numberOfInstallments}
                            onChange={(e) => setPlanData(prev => ({ ...prev, numberOfInstallments: e?.target?.value }))}
                            error={errors?.numberOfInstallments}
                          />

                          <Select
                            label="Installment Frequency"
                            options={frequencyOptions}
                            value={planData?.installmentFrequency}
                            onChange={(value) => setPlanData(prev => ({ ...prev, installmentFrequency: value }))}
                          />
                        </div>

                        {/* Late Fee Configuration */}
                        <div className="bg-muted/20 rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-3">Late Fee Configuration</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Grace Period (Days)"
                              type="number"
                              min="0"
                              value={planData?.gracePeriodDays}
                              onChange={(e) => setPlanData(prev => ({ ...prev, gracePeriodDays: e?.target?.value }))}
                            />
                            
                            <Input
                              label="Late Fee Amount (₦)"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={planData?.lateFeeAmount}
                              onChange={(e) => setPlanData(prev => ({ ...prev, lateFeeAmount: e?.target?.value }))}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Late fees will be applied after the grace period expires
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fee Assignment Tab */}
                {activeTab === 'fees' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Fee Assignment</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select which fees should be included in this payment plan
                      </p>

                      {errors?.selectedFees && (
                        <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4">
                          <p className="text-sm text-error">{errors?.selectedFees}</p>
                        </div>
                      )}

                      <div className="space-y-3">
                        {availableFees?.length > 0 ? availableFees?.map((fee) => (
                          <div key={fee?.id} className="bg-muted/20 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  id={`fee-${fee?.id}`}
                                  checked={planData?.selectedFees?.includes(fee?.id)}
                                  onChange={(e) => handleFeeSelection(fee?.id, e?.target?.checked)}
                                  className="rounded"
                                />
                                <div>
                                  <label htmlFor={`fee-${fee?.id}`} className="font-medium text-foreground">
                                    {fee?.name}
                                  </label>
                                  {fee?.description && (
                                    <p className="text-sm text-muted-foreground">{fee?.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-foreground">₦{fee?.amount?.toLocaleString()}</div>
                                <div className="text-sm text-muted-foreground">{fee?.frequency}</div>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="bg-muted/20 rounded-lg p-8 text-center">
                            <Icon name="CreditCard" size={48} className="text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No fees available. Please add fees first.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Payment Plan Preview</h3>
                      
                      {/* Plan Summary */}
                      <div className="bg-muted/20 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-foreground mb-3">Plan Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Plan Name</div>
                            <div className="font-medium">{planData?.name || 'Not specified'}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Total Amount</div>
                            <div className="font-medium">₦{parseFloat(planData?.totalAmount || 0)?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Installments</div>
                            <div className="font-medium">{planData?.numberOfInstallments}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Frequency</div>
                            <div className="font-medium capitalize">{planData?.installmentFrequency?.replace('_', ' ')}</div>
                          </div>
                        </div>
                      </div>

                      {/* Installment Schedule */}
                      <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-border">
                          <h4 className="font-medium text-foreground">Payment Schedule</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/30">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                  #
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                  Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                  Due Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {installmentPreview?.map((installment, index) => (
                                <tr key={installment?.id} className="hover:bg-muted/10">
                                  <td className="px-4 py-3 text-sm font-medium">
                                    {installment?.type === 'down_payment' ? 'DP' : index}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      installment?.type === 'down_payment' 
                                        ? 'bg-info/10 text-info' :'bg-primary/10 text-primary'
                                    }`}>
                                      {installment?.description}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm">{installment?.dueDate}</td>
                                  <td className="px-4 py-3 text-sm font-medium">
                                    ₦{installment?.amount?.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {installmentPreview?.length === 0 && (
                        <div className="bg-muted/20 rounded-lg p-8 text-center">
                          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Complete the basic info and installment setup to see the preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Payment plan will be available for invoice creation
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={!planData?.name || !planData?.totalAmount || !planData?.numberOfInstallments}
                  iconName="Save"
                  iconPosition="left"
                >
                  Create Payment Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPlansModal;