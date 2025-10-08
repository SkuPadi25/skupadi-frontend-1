import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

import { X, AlertTriangle, Users, CheckCircle, ArrowRight, Loader } from 'lucide-react';
import { specialInvoiceService } from '../../../services/specialInvoiceService';
import { SERVICE_TYPE_LABELS, INVOICE_SCOPE_LABELS, INVOICE_SCOPES } from '../../../constants/specialInvoice';

const SpecialInvoiceCreationModal = ({ 
  isOpen, 
  onClose, 
  onInvoiceCreated, 
  serviceConfigurations = [] 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [creationResult, setCreationResult] = useState(null);

  const [formData, setFormData] = useState({
    serviceType: '',
    scope: '',
    classId: '',
    subclassId: '',
    selectedStudentIds: [],
    amount: '',
    dueDate: '',
    term: '2024/2025 Second Term',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData?.serviceType && formData?.scope) {
      loadEligibleStudents();
    }
  }, [formData?.serviceType, formData?.scope, formData?.classId, formData?.subclassId]);

  const loadInitialData = async () => {
    try {
      const classes = await specialInvoiceService?.getSchoolClasses();
      setSchoolClasses(classes);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadEligibleStudents = async () => {
    if (!formData?.serviceType || !formData?.scope) return;

    setIsLoading(true);
    try {
      const filters = {};
      if (formData?.scope === INVOICE_SCOPES?.CLASS) {
        filters.classId = formData?.classId;
      } else if (formData?.scope === INVOICE_SCOPES?.SUBCLASS) {
        filters.subclassId = formData?.subclassId;
      } else if (formData?.scope === INVOICE_SCOPES?.SELECTED_STUDENTS) {
        filters.selectedStudentIds = formData?.selectedStudentIds;
      }

      const students = await specialInvoiceService?.getEligibleStudents(
        formData?.serviceType,
        formData?.scope,
        filters
      );

      setEligibleStudents(students);

      // Auto-populate amount from service configuration
      const serviceConfig = serviceConfigurations?.find(
        config => config?.service_type === formData?.serviceType
      );
      if (serviceConfig && !formData?.amount) {
        setFormData(prev => ({
          ...prev,
          amount: serviceConfig?.default_amount?.toString()
        }));
      }
    } catch (error) {
      console.error('Error loading eligible students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear errors when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Reset dependent fields when scope changes
    if (field === 'scope') {
      setFormData(prev => ({
        ...prev,
        classId: '',
        subclassId: '',
        selectedStudentIds: []
      }));
    }

    // Reset subclass when class changes
    if (field === 'classId') {
      setFormData(prev => ({
        ...prev,
        subclassId: ''
      }));
    }
  };

  const handleStudentSelection = (studentId, isSelected) => {
    const updatedStudentIds = isSelected
      ? [...formData?.selectedStudentIds, studentId]
      : formData?.selectedStudentIds?.filter(id => id !== studentId);

    setFormData(prev => ({
      ...prev,
      selectedStudentIds: updatedStudentIds
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData?.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    if (!formData?.scope) {
      newErrors.scope = 'Please select a scope';
    }

    if (formData?.scope === INVOICE_SCOPES?.CLASS && !formData?.classId) {
      newErrors.classId = 'Please select a class';
    }

    if (formData?.scope === INVOICE_SCOPES?.SUBCLASS && !formData?.subclassId) {
      newErrors.subclassId = 'Please select a subclass';
    }

    if (formData?.scope === INVOICE_SCOPES?.SELECTED_STUDENTS && formData?.selectedStudentIds?.length === 0) {
      newErrors.selectedStudentIds = 'Please select at least one student';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData?.dueDate) {
      newErrors.dueDate = 'Please select a due date';
    }

    if (!formData?.term?.trim()) {
      newErrors.term = 'Please enter the term';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setShowConfirmation(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleCreateInvoices = async () => {
    setIsLoading(true);
    setShowConfirmation(false);

    try {
      const invoiceData = {
        serviceType: formData?.serviceType,
        scope: formData?.scope,
        classId: formData?.classId || null,
        subclassId: formData?.subclassId || null,
        selectedStudentIds: formData?.selectedStudentIds?.length > 0 ? formData?.selectedStudentIds : null,
        amount: parseFloat(formData?.amount),
        dueDate: formData?.dueDate,
        term: formData?.term,
        notes: formData?.notes,
        createdBy: 'current-user-id' // Should come from auth context
      };

      const result = await specialInvoiceService?.createSpecialInvoicesBulk(invoiceData);
      
      setCreationResult(result);
      setCurrentStep(3); // Success step

      // Call parent callback after a short delay
      setTimeout(() => {
        onInvoiceCreated();
      }, 2000);

    } catch (error) {
      console.error('Error creating special invoices:', error);
      setErrors({ submit: 'Failed to create invoices. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedClassData = () => {
    if (!formData?.classId) return null;
    return schoolClasses?.find(cls => cls?.id === formData?.classId);
  };

  const getSelectedSubclassData = () => {
    if (!formData?.subclassId) return null;
    const classData = getSelectedClassData();
    return classData?.subclasses?.find(sub => sub?.id === formData?.subclassId);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Select Service & Scope';
      case 2:
        return 'Configure Invoice Details';
      case 3:
        return 'Invoices Created Successfully';
      default:
        return 'Create Special Invoice';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{getStepTitle()}</h2>
            <div className="flex items-center space-x-2 mt-2">
              {[1, 2, 3]?.map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-primary text-white' :'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step < currentStep ? <CheckCircle size={16} /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-0.5 ${
                        step < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Service Type *
                  </label>
                  <Select
                    placeholder="Select service type"
                    value={formData?.serviceType}
                    onChange={(value) => handleInputChange('serviceType', value)}
                    options={serviceConfigurations?.map(config => ({
                      value: config?.service_type,
                      label: config?.name,
                      description: config?.description
                    }))}
                    error={errors?.serviceType}
                  />
                  {formData?.serviceType && (
                    <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm">
                        <strong>{SERVICE_TYPE_LABELS?.[formData?.serviceType]}</strong>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {serviceConfigurations?.find(c => c?.service_type === formData?.serviceType)?.description}
                      </div>
                    </div>
                  )}
                </div>

                {/* Scope Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Invoice Scope *
                  </label>
                  <Select
                    placeholder="Select scope"
                    value={formData?.scope}
                    onChange={(value) => handleInputChange('scope', value)}
                    options={Object?.entries(INVOICE_SCOPE_LABELS)?.map(([value, label]) => ({
                      value,
                      label
                    }))}
                    error={errors?.scope}
                  />
                </div>
              </div>

              {/* Conditional Fields Based on Scope */}
              {formData?.scope === INVOICE_SCOPES?.CLASS && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Class *
                  </label>
                  <Select
                    placeholder="Select class"
                    value={formData?.classId}
                    onChange={(value) => handleInputChange('classId', value)}
                    options={schoolClasses?.map(cls => ({
                      value: cls?.id,
                      label: cls?.name
                    }))}
                    error={errors?.classId}
                  />
                </div>
              )}

              {formData?.scope === INVOICE_SCOPES?.SUBCLASS && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Class *
                    </label>
                    <Select
                      placeholder="Select class"
                      value={formData?.classId}
                      onChange={(value) => handleInputChange('classId', value)}
                      options={schoolClasses?.map(cls => ({
                        value: cls?.id,
                        label: cls?.name
                      }))}
                      error={errors?.classId}
                    />
                  </div>
                  
                  {formData?.classId && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Select Subclass *
                      </label>
                      <Select
                        placeholder="Select subclass"
                        value={formData?.subclassId}
                        onChange={(value) => handleInputChange('subclassId', value)}
                        options={getSelectedClassData()?.subclasses?.map(sub => ({
                          value: sub?.id,
                          label: sub?.name
                        })) || []}
                        error={errors?.subclassId}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Student Preview */}
              {formData?.serviceType && formData?.scope && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Users size={16} className="text-primary" />
                    <span className="font-medium text-foreground">Eligible Students Preview</span>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Loader size={16} className="animate-spin" />
                      <span>Loading eligible students...</span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm text-foreground mb-2">
                        Found <strong>{eligibleStudents?.length}</strong> eligible students
                      </div>
                      {eligibleStudents?.length > 0 && (
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {eligibleStudents?.slice(0, 10)?.map((student) => (
                            <div key={student?.student_id} className="text-xs text-muted-foreground">
                              {student?.student_name} ({student?.class_name}
                              {student?.subclass_name && ` - ${student?.subclass_name}`})
                            </div>
                          ))}
                          {eligibleStudents?.length > 10 && (
                            <div className="text-xs text-muted-foreground">
                              ... and {eligibleStudents?.length - 10} more students
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount per Student (₦) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData?.amount}
                    onChange={(e) => handleInputChange('amount', e?.target?.value)}
                    error={errors?.amount}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Due Date *
                  </label>
                  <Input
                    type="date"
                    value={formData?.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
                    error={errors?.dueDate}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Academic Term *
                </label>
                <Input
                  placeholder="e.g., 2024/2025 Second Term"
                  value={formData?.term}
                  onChange={(e) => handleInputChange('term', e?.target?.value)}
                  error={errors?.term}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg resize-none"
                  rows={3}
                  placeholder="Add any additional notes for this invoice generation..."
                  value={formData?.notes}
                  onChange={(e) => handleInputChange('notes', e?.target?.value)}
                />
              </div>

              {/* Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">Invoice Generation Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{SERVICE_TYPE_LABELS?.[formData?.serviceType]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scope:</span>
                    <span className="font-medium">{INVOICE_SCOPE_LABELS?.[formData?.scope]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students Affected:</span>
                    <span className="font-medium">{eligibleStudents?.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount per Student:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(formData?.amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-primary/20 pt-2">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-bold text-primary">
                      {formatCurrency((parseFloat(formData?.amount) || 0) * eligibleStudents?.length)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && creationResult && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-success" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Special Invoices Created Successfully!
                </h3>
                <p className="text-muted-foreground">
                  {creationResult?.invoices_created} invoices have been generated and are ready for distribution.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invoices Created:</span>
                  <span className="font-medium">{creationResult?.invoices_created}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">{formatCurrency(creationResult?.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Generation ID:</span>
                  <span className="font-mono text-xs">{creationResult?.generation_id}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
                <Button onClick={() => window.location?.reload()}>
                  View Invoices
                </Button>
              </div>
            </div>
          )}

          {errors?.submit && (
            <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{errors?.submit}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep < 3 && (
          <div className="flex items-center justify-between p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onClose : handlePrevious}
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>

            <div className="flex items-center space-x-3">
              {currentStep === 2 && !showConfirmation && (
                <Button
                  onClick={() => setShowConfirmation(true)}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Review & Create
                </Button>
              )}
              
              {currentStep < 2 && (
                <Button
                  onClick={handleNext}
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-card rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle size={24} className="text-warning" />
                <h3 className="text-lg font-medium text-foreground">Confirm Invoice Creation</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                You are about to create <strong>{eligibleStudents?.length} special invoices</strong> for {SERVICE_TYPE_LABELS?.[formData?.serviceType]} 
                with a total amount of <strong>{formatCurrency((parseFloat(formData?.amount) || 0) * eligibleStudents?.length)}</strong>.
              </p>
              
              <p className="text-sm text-muted-foreground mb-6">
                This action cannot be undone. Are you sure you want to proceed?
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateInvoices}
                  disabled={isLoading}
                  iconName={isLoading ? "Loader" : "CheckCircle"}
                  iconPosition="left"
                >
                  {isLoading ? 'Creating...' : 'Create Invoices'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialInvoiceCreationModal;