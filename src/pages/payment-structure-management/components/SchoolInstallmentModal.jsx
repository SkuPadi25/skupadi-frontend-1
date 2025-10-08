import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

import Icon from '../../../components/AppIcon';

const SchoolInstallmentModal = ({ isOpen, onClose, onSave, currentConfig = {} }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [configData, setConfigData] = useState({
    enabled: false,
    maxInstallments: 3,
    termly: true,
    allowedInstallments: [1, 2, 3],
    gracePeriodDays: 7,
    lateFeeAmount: '',
    downPaymentRequired: false,
    downPaymentPercentage: 20,
    installmentFrequency: 'monthly',
    applyToAllInvoices: true,
    description: 'School-wide termly installment plan - Maximum 3 installments per term'
  });
  const [errors, setErrors] = useState({});

  const frequencyOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Bi-monthly', value: 'bi_monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Term-based', value: 'termly' }
  ];

  const maxInstallmentOptions = [
    { label: '1 Installment', value: 1 },
    { label: '2 Installments', value: 2 },
    { label: '3 Installments (Recommended)', value: 3 }
  ];

  // Initialize with current config
  useEffect(() => {
    if (currentConfig && Object.keys(currentConfig)?.length > 0) {
      setConfigData({
        enabled: currentConfig?.enabled || false,
        maxInstallments: currentConfig?.maxInstallments || 3,
        termly: currentConfig?.termly ?? true,
        allowedInstallments: currentConfig?.allowedInstallments || [1, 2, 3],
        gracePeriodDays: currentConfig?.gracePeriodDays || 7,
        lateFeeAmount: currentConfig?.lateFeeAmount?.toString() || '',
        downPaymentRequired: currentConfig?.downPaymentRequired || false,
        downPaymentPercentage: currentConfig?.downPaymentPercentage || 20,
        installmentFrequency: currentConfig?.installmentFrequency || 'monthly',
        applyToAllInvoices: currentConfig?.applyToAllInvoices ?? true,
        description: currentConfig?.defaultInstallmentPlan?.description || 'School-wide termly installment plan - Maximum 3 installments per term'
      });
    }
  }, [currentConfig, isOpen]);

  if (!isOpen) return null;

  const handleInstallmentToggle = (installmentNum, checked) => {
    setConfigData(prev => ({
      ...prev,
      allowedInstallments: checked 
        ? [...prev?.allowedInstallments, installmentNum]?.sort()
        : prev?.allowedInstallments?.filter(num => num !== installmentNum)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!configData?.enabled) {
      return true; // If disabled, no validation needed
    }
    
    if (configData?.allowedInstallments?.length === 0) {
      newErrors.allowedInstallments = 'Please select at least one installment option';
    }
    
    if (configData?.maxInstallments < 1 || configData?.maxInstallments > 3) {
      newErrors.maxInstallments = 'Maximum installments must be between 1 and 3';
    }
    
    if (configData?.gracePeriodDays < 0) {
      newErrors.gracePeriodDays = 'Grace period cannot be negative';
    }
    
    if (configData?.lateFeeAmount && parseFloat(configData?.lateFeeAmount) < 0) {
      newErrors.lateFeeAmount = 'Late fee amount cannot be negative';
    }

    if (configData?.downPaymentRequired) {
      if (configData?.downPaymentPercentage < 1 || configData?.downPaymentPercentage > 50) {
        newErrors.downPaymentPercentage = 'Down payment percentage must be between 1% and 50%';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const schoolInstallmentConfig = {
      ...configData,
      lateFeeAmount: parseFloat(configData?.lateFeeAmount) || 0,
      gracePeriodDays: parseInt(configData?.gracePeriodDays) || 0,
      downPaymentPercentage: parseInt(configData?.downPaymentPercentage) || 20,
      isSchoolLevel: true,
      defaultInstallmentPlan: {
        numberOfInstallments: configData?.maxInstallments,
        installmentType: 'equal_split',
        description: configData?.description
      },
      lastUpdated: new Date()?.toISOString(),
      updatedBy: 'School Administrator'
    };
    
    onSave?.(schoolInstallmentConfig);
    handleClose();
  };

  const handleReset = () => {
    setConfigData({
      enabled: false,
      maxInstallments: 3,
      termly: true,
      allowedInstallments: [1, 2, 3],
      gracePeriodDays: 7,
      lateFeeAmount: '',
      downPaymentRequired: false,
      downPaymentPercentage: 20,
      installmentFrequency: 'monthly',
      applyToAllInvoices: true,
      description: 'School-wide termly installment plan - Maximum 3 installments per term'
    });
    setErrors({});
    setActiveTab('basic');
  };

  const handleClose = () => {
    handleReset();
    onClose?.();
  };

  const tabs = [
    { id: 'basic', label: 'Basic Settings', icon: 'Settings' },
    { id: 'installments', label: 'Installment Rules', icon: 'Calendar' },
    { id: 'fees', label: 'Fees & Penalties', icon: 'CreditCard' },
    { id: 'preview', label: 'Preview & Apply', icon: 'Eye' }
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
                <Icon name="Settings" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">School-Level Installment Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Set global installment rules that apply to all invoices
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
                {/* Basic Settings Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Basic Configuration</h3>
                      
                      {/* Enable/Disable Toggle */}
                      <div className="bg-muted/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <input
                            type="checkbox"
                            id="enableInstallments"
                            checked={configData?.enabled}
                            onChange={(e) => setConfigData(prev => ({ ...prev, enabled: e?.target?.checked }))}
                            className="rounded"
                          />
                          <label htmlFor="enableInstallments" className="text-sm font-medium text-foreground">
                            Enable School-Level Installment Plans
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          When enabled, all invoices in the school will use the same installment configuration
                        </p>
                      </div>

                      {configData?.enabled && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Plan Description
                            </label>
                            <textarea
                              placeholder="Describe the school's installment policy..."
                              value={configData?.description}
                              onChange={(e) => setConfigData(prev => ({ ...prev, description: e?.target?.value }))}
                              rows={3}
                              className="w-full p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                              label="Maximum Installments Per Term"
                              options={maxInstallmentOptions}
                              value={configData?.maxInstallments}
                              onChange={(value) => setConfigData(prev => ({ ...prev, maxInstallments: parseInt(value) }))}
                              error={errors?.maxInstallments}
                            />

                            <Select
                              label="Installment Frequency"
                              options={frequencyOptions}
                              value={configData?.installmentFrequency}
                              onChange={(value) => setConfigData(prev => ({ ...prev, installmentFrequency: value }))}
                            />
                          </div>

                          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <Icon name="Info" size={16} className="text-info mt-0.5" />
                              <div>
                                <h4 className="font-medium text-info mb-1">School-Level Configuration</h4>
                                <p className="text-sm text-info/80">
                                  This configuration will replace individual class payment plans and apply to all future invoices created in the school.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Installment Rules Tab */}
                {activeTab === 'installments' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Installment Options</h3>
                      
                      {!configData?.enabled ? (
                        <div className="bg-muted/20 rounded-lg p-8 text-center">
                          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Enable school-level installments in Basic Settings first</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-3 block">
                              Available Installment Options
                            </label>
                            {errors?.allowedInstallments && (
                              <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4">
                                <p className="text-sm text-error">{errors?.allowedInstallments}</p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[1, 2, 3]?.map(num => (
                                <div key={num} className="bg-muted/20 rounded-lg p-4">
                                  <div className="flex items-center space-x-3">
                                    <input
                                      type="checkbox"
                                      id={`installment-${num}`}
                                      checked={configData?.allowedInstallments?.includes(num)}
                                      onChange={(e) => handleInstallmentToggle(num, e?.target?.checked)}
                                      disabled={num > configData?.maxInstallments}
                                      className="rounded"
                                    />
                                    <label htmlFor={`installment-${num}`} className="font-medium text-foreground">
                                      {num} Installment{num > 1 ? 's' : ''}
                                    </label>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Allow students to pay in {num} equal installment{num > 1 ? 's' : ''}
                                  </p>
                                  {num > configData?.maxInstallments && (
                                    <p className="text-sm text-warning mt-1">
                                      Disabled - Exceeds maximum limit
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Down Payment Configuration */}
                          <div className="bg-muted/20 rounded-lg p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <input
                                type="checkbox"
                                id="downPaymentRequired"
                                checked={configData?.downPaymentRequired}
                                onChange={(e) => setConfigData(prev => ({ ...prev, downPaymentRequired: e?.target?.checked }))}
                                className="rounded"
                              />
                              <label htmlFor="downPaymentRequired" className="text-sm font-medium text-foreground">
                                Require Down Payment
                              </label>
                            </div>

                            {configData?.downPaymentRequired && (
                              <div className="mt-3">
                                <Input
                                  label="Down Payment Percentage (%)"
                                  type="number"
                                  min="1"
                                  max="50"
                                  value={configData?.downPaymentPercentage}
                                  onChange={(e) => setConfigData(prev => ({ ...prev, downPaymentPercentage: parseInt(e?.target?.value) || 20 }))}
                                  error={errors?.downPaymentPercentage}
                                  placeholder="20"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fees & Penalties Tab */}
                {activeTab === 'fees' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Late Fees & Penalties</h3>
                      
                      {!configData?.enabled ? (
                        <div className="bg-muted/20 rounded-lg p-8 text-center">
                          <Icon name="CreditCard" size={48} className="text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Enable school-level installments in Basic Settings first</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Grace Period (Days)"
                              type="number"
                              min="0"
                              max="30"
                              value={configData?.gracePeriodDays}
                              onChange={(e) => setConfigData(prev => ({ ...prev, gracePeriodDays: parseInt(e?.target?.value) || 0 }))}
                              error={errors?.gracePeriodDays}
                              placeholder="7"
                            />
                            
                            <Input
                              label="Late Fee Amount (₦)"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={configData?.lateFeeAmount}
                              onChange={(e) => setConfigData(prev => ({ ...prev, lateFeeAmount: e?.target?.value }))}
                              error={errors?.lateFeeAmount}
                            />
                          </div>

                          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                              <div>
                                <h4 className="font-medium text-warning mb-1">Late Fee Policy</h4>
                                <p className="text-sm text-warning/80">
                                  Late fees will be automatically applied to overdue installments after the grace period expires. 
                                  This applies to all installment payments across the school.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Preview & Apply Tab */}
                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Configuration Preview</h3>
                      
                      {!configData?.enabled ? (
                        <div className="bg-muted/20 rounded-lg p-8 text-center">
                          <Icon name="Eye" size={48} className="text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Enable school-level installments to see the preview</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Configuration Summary */}
                          <div className="bg-muted/20 rounded-lg p-4">
                            <h4 className="font-medium text-foreground mb-3">School Installment Configuration</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Status</div>
                                <div className="font-medium text-success">Enabled</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Max Installments</div>
                                <div className="font-medium">{configData?.maxInstallments} per term</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Frequency</div>
                                <div className="font-medium capitalize">{configData?.installmentFrequency?.replace('_', ' ')}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Grace Period</div>
                                <div className="font-medium">{configData?.gracePeriodDays} days</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Late Fee</div>
                                <div className="font-medium">₦{parseFloat(configData?.lateFeeAmount || 0)?.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Down Payment</div>
                                <div className="font-medium">
                                  {configData?.downPaymentRequired ? `${configData?.downPaymentPercentage}%` : 'Not Required'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Available Options */}
                          <div className="bg-card border border-border rounded-lg overflow-hidden">
                            <div className="p-4 border-b border-border">
                              <h4 className="font-medium text-foreground">Available Installment Options</h4>
                            </div>
                            <div className="p-4">
                              <div className="space-y-3">
                                {configData?.allowedInstallments?.map(num => (
                                  <div key={num} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                                    <div>
                                      <div className="font-medium">{num}-Installment Plan</div>
                                      <div className="text-sm text-muted-foreground">
                                        Pay in {num} equal installment{num > 1 ? 's' : ''} 
                                        {configData?.downPaymentRequired ? ` (plus ${configData?.downPaymentPercentage}% down payment)` : ''}
                                      </div>
                                    </div>
                                    <div className="text-sm text-success font-medium">Available</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Impact Notice */}
                          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <Icon name="AlertCircle" size={16} className="text-warning mt-0.5" />
                              <div>
                                <h4 className="font-medium text-warning mb-1">Implementation Impact</h4>
                                <p className="text-sm text-warning/80">
                                  Applying this configuration will:
                                </p>
                                <ul className="text-sm text-warning/80 mt-2 space-y-1 list-disc list-inside">
                                  <li>Replace all existing class-specific payment plans</li>
                                  <li>Apply to all future invoices created in the school</li>
                                  <li>Use the same installment rules for all classes and fee types</li>
                                  <li>Cannot be overridden at the class or individual invoice level</li>
                                </ul>
                              </div>
                            </div>
                          </div>
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
                {configData?.enabled 
                  ? 'Configuration will apply to all invoices school-wide' :'Enable installments to configure school-level payment plans'
                }
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={configData?.enabled && configData?.allowedInstallments?.length === 0}
                  iconName="Save"
                  iconPosition="left"
                >
                  {configData?.enabled ? 'Apply Configuration' : 'Save Settings'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolInstallmentModal;