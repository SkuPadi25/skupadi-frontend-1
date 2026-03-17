import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import { usePaymentStructure } from '../../contexts/PaymentStructureContext';
import { dynamicFeeService } from '../../services/dynamicFeeService';
import { studentClassService } from '../../services/studentClassService';
import { integrationStatusUtils } from '../../utils/integrationStatus';
import { getUser } from '../../utils/storage';
import invoiceService from '../../services/invoiceService';

import StudentSelection from './components/StudentSelection';
import InvoiceDetails from './components/InvoiceDetails';
import LineItemsTable from './components/LineItemsTable';
import InvoiceActions from './components/InvoiceActions';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPopulatedFees, setAutoPopulatedFees] = useState([]);
  const [suggestedOptionalFees, setSuggestedOptionalFees] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [isGradeMode, setIsGradeMode] = useState(false);
  const [currentGradeInfo, setCurrentGradeInfo] = useState(null);
  const [studentExceptions, setStudentExceptions] = useState({});

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    dueDate: '',
    description: '',
    paymentTerms: '30',
    notes: ''
  });

  const [lineItems, setLineItems] = useState([]);
  const [errors, setErrors] = useState({});

  // Use payment structure context
  const paymentStructureContext = usePaymentStructure();

  // Auto-generate invoice number on component mount
  useEffect(() => {
    const generateInvoiceNumber = () => {
      const date = new Date();
      const year = date?.getFullYear();
      const month = String(date?.getMonth() + 1)?.padStart(2, '0');
      const random = Math.floor(Math.random() * 1000)?.toString()?.padStart(3, '0');
      return `INV-${year}${month}-${random}`;
    };

    setInvoiceData(prev => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber()
    }));
  }, []);

  // Set default due date when payment terms change
  useEffect(() => {
    if (invoiceData?.paymentTerms && invoiceData?.paymentTerms !== 'immediate') {
      const daysToAdd = parseInt(invoiceData?.paymentTerms);
      const dueDate = new Date();
      dueDate?.setDate(dueDate?.getDate() + daysToAdd);
      
      setInvoiceData(prev => ({
        ...prev,
        dueDate: dueDate?.toISOString()?.split('T')?.[0]
      }));
    }
  }, [invoiceData?.paymentTerms]);

  // Enhanced useEffect for grade-based fee loading
  useEffect(() => {
    const loadFeesForSelectedStudents = async () => {
      if (!selectedStudents?.length) {
        setAutoPopulatedFees([]);
        setSuggestedOptionalFees([]);
        setSelectedClasses([]);
        return;
      }

      try {
        if (isGradeMode && currentGradeInfo) {
          // Load grade-based fees
          const gradeBasedFees = await dynamicFeeService?.getGradeBasedFees(
            currentGradeInfo?.id, 
            paymentStructureContext,
            Object.keys(studentExceptions)
          );

          if (gradeBasedFees?.mandatoryFees) {
            setAutoPopulatedFees(gradeBasedFees?.mandatoryFees);
            // Add mandatory fees to line items automatically
            const existingLineItems = lineItems?.filter(item => !item?.isAutoPopulated);
            setLineItems([...existingLineItems, ...gradeBasedFees?.mandatoryFees]);
          }

          if (gradeBasedFees?.optionalFees) {
            setSuggestedOptionalFees(gradeBasedFees?.optionalFees);
          }

          // Set grade as selected class
          setSelectedClasses([{
            classId: currentGradeInfo?.id,
            className: currentGradeInfo?.name,
            studentsCount: selectedStudents?.length
          }]);

        } else {
          // Original individual student logic
          const uniqueClasses = await studentClassService?.getUniqueClassesFromStudents(selectedStudents);
          setSelectedClasses(uniqueClasses);

          const mandatoryFees = await dynamicFeeService?.getAutoPopulatedFees(selectedStudents, paymentStructureContext);
          setAutoPopulatedFees(mandatoryFees);

          const optionalFees = await dynamicFeeService?.getSuggestedOptionalFees(selectedStudents, paymentStructureContext);
          setSuggestedOptionalFees(optionalFees);

          const existingLineItems = lineItems?.filter(item => !item?.isAutoPopulated);
          setLineItems([...existingLineItems, ...mandatoryFees]);
        }

      } catch (error) {
        console.error('Error loading fees for selected students:', error);
      }
    };

    loadFeesForSelectedStudents();
  }, [selectedStudents, paymentStructureContext, isGradeMode, currentGradeInfo, studentExceptions]);

  // Enhanced validation for grade mode
  const validateForm = () => {
    const newErrors = {};

    // Validate student selection
    if (selectedStudents?.length === 0) {
      newErrors.students = 'Please select at least one student or grade';
    }

    // Grade mode specific validation
    if (isGradeMode && !currentGradeInfo) {
      newErrors.grade = 'Please select a valid grade';
    }

    // Validate invoice details
    if (!invoiceData?.invoiceNumber?.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }
    if (!invoiceData?.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    // Validate line items
    if (lineItems?.length === 0) {
      newErrors.lineItems = 'Please add at least one line item';
    } else {
      lineItems?.forEach((item, index) => {
        if (!item?.feeType) {
          newErrors[`lineItems.${index}.feeType`] = 'Fee type is required';
        }
        if (!item?.description?.trim()) {
          newErrors[`lineItems.${index}.description`] = 'Description is required';
        }
        if (!item?.quantity || item?.quantity <= 0) {
          newErrors[`lineItems.${index}.quantity`] = 'Quantity must be greater than 0';
        }
        if (!item?.unitPrice || item?.unitPrice < 0) {
          newErrors[`lineItems.${index}.unitPrice`] = 'Unit price must be 0 or greater';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleCreateInvoice = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await invoiceService?.createInvoices({
        invoiceNumber: invoiceData?.invoiceNumber,
        dueDate: invoiceData?.dueDate,
        description: invoiceData?.description,
        paymentTerms: invoiceData?.paymentTerms,
        notes: invoiceData?.notes,
        selectedStudentIds: selectedStudents,
        lineItems
      });

      integrationStatusUtils?.updateIntegrationStatusAfterInvoice(paymentStructureContext, lineItems);
      
      // Enhanced success message for grade mode
      const invoiceCount = result?.count || selectedStudents?.length;
      const totalAmount = lineItems?.reduce((sum, item) => {
        const itemTotal = (item?.quantity || 0) * (item?.unitPrice || 0);
        return sum + itemTotal;
      }, 0);
      const finalAmount = totalAmount * 1.08; // Including 8% tax
      const grandTotal = finalAmount * (isGradeMode ? selectedStudents?.length : 1);

      let successMessage = `Successfully created ${invoiceCount} invoice${invoiceCount > 1 ? 's' : ''}`;
      
      if (isGradeMode && currentGradeInfo) {
        successMessage += ` for ${currentGradeInfo?.name}`;
        if (Object.keys(studentExceptions)?.length > 0) {
          successMessage += ` (${Object.keys(studentExceptions)?.length} exception${Object.keys(studentExceptions)?.length > 1 ? 's' : ''} noted)`;
        }
      }
      
      successMessage += ` totaling ₦${grandTotal?.toFixed(2)}`;

      alert(successMessage);
      navigate('/invoices-management');
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await invoiceService?.createInvoices({
        invoiceNumber: invoiceData?.invoiceNumber,
        dueDate: invoiceData?.dueDate,
        description: invoiceData?.description,
        paymentTerms: invoiceData?.paymentTerms,
        notes: invoiceData?.notes,
        status: 'DRAFT',
        selectedStudentIds: selectedStudents,
        lineItems
      });
      
      alert('Invoice saved as draft successfully');
      navigate('/invoices-management');
      
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced bulk mode toggle with grade mode reset
  const handleToggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    setSelectedStudents([]);
    setLineItems([]);
    setAutoPopulatedFees([]);
    setSuggestedOptionalFees([]);
    // Reset grade mode
    setIsGradeMode(false);
    setCurrentGradeInfo(null);
    setStudentExceptions({});
  };

  // Handle grade mode activation from StudentSelection
  const handleGradeModeChange = (gradeMode, gradeInfo, exceptions) => {
    setIsGradeMode(gradeMode);
    setCurrentGradeInfo(gradeInfo);
    setStudentExceptions(exceptions || {});
  };

  // Add optional fee to line items
  const handleAddOptionalFee = (optionalFee) => {
    const newLineItem = {
      id: `optional_${optionalFee?.id}_${Date.now()}`,
      feeType: optionalFee?.feeType,
      description: optionalFee?.name,
      quantity: 1,
      unitPrice: optionalFee?.amount || 0,
      total: optionalFee?.amount || 0,
      category: optionalFee?.category,
      classId: optionalFee?.classId,
      className: optionalFee?.className,
      structureId: optionalFee?.structureId,
      isOptional: true
    };

    setLineItems(prev => [...prev, newLineItem]);
    
    // Remove from suggested fees
    setSuggestedOptionalFees(prev => prev?.filter(fee => fee?.id !== optionalFee?.id));
  };

  const isFormValid = () => {
    return (selectedStudents?.length > 0 &&
    invoiceData?.invoiceNumber?.trim() &&
    invoiceData?.dueDate &&
    lineItems?.length > 0 && lineItems?.every(item => 
      item?.feeType && 
      item?.description?.trim() && 
      item?.quantity > 0 && 
      item?.unitPrice >= 0
    ));
  };

  const currentUser = getUser();
  const headerUser = currentUser ? {
    name: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`?.trim() || currentUser?.email,
    role: currentUser?.role
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:ml-64">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={headerUser} />
        
        <main className="p-6">
          <Breadcrumb customItems={[]} />
          
          <PageHeader
            title="Create Invoice"
            subtitle={isGradeMode ? "Generate grade-based invoices with common fees and exceptions" : "Generate invoices for student fees and charges with smart auto-population"}
            icon="FileText"
            actions={
              <Button
                variant="outline"
                onClick={() => navigate('/invoices-management')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Invoices
              </Button>
            }
          />

          <div className="space-y-6">
            {/* Enhanced Student Selection with Grade Mode */}
            <StudentSelection
              selectedStudents={selectedStudents}
              onStudentChange={setSelectedStudents}
              isBulkMode={isBulkMode}
              onToggleBulkMode={handleToggleBulkMode}
              selectedClasses={selectedClasses}
              autoPopulatedFeesCount={autoPopulatedFees?.length || 0}
              isGradeMode={isGradeMode}
              currentGradeInfo={currentGradeInfo}
              studentExceptions={studentExceptions}
              onGradeModeChange={handleGradeModeChange}
            />

            {/* Suggested Optional Fees Section */}
            {suggestedOptionalFees?.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Suggested Optional Fees</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on selected students' classes, these optional fees are available:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestedOptionalFees?.map(fee => (
                    <div key={fee?.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{fee?.name}</h4>
                        <span className="text-sm font-semibold text-primary">₦{fee?.amount?.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{fee?.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {fee?.applicableClasses?.map(cls => cls?.className)?.join(', ')}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddOptionalFee(fee)}
                          className="text-xs py-1 px-2"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoice Details */}
            <InvoiceDetails
              invoiceData={invoiceData}
              onInvoiceDataChange={setInvoiceData}
              errors={errors}
            />

            {/* Enhanced Line Items with Grade Mode Support */}
            <LineItemsTable
              lineItems={lineItems}
              onLineItemsChange={setLineItems}
              errors={errors}
              selectedStudents={selectedStudents}
              paymentStructureContext={paymentStructureContext}
              autoPopulatedFees={autoPopulatedFees}
              isGradeMode={isGradeMode}
              currentGradeInfo={currentGradeInfo}
              studentExceptions={studentExceptions}
            />

            {/* Enhanced Actions */}
            <InvoiceActions
              onCreateInvoice={handleCreateInvoice}
              onSaveDraft={handleSaveDraft}
              isValid={isFormValid()}
              isLoading={isLoading}
              selectedStudents={selectedStudents}
              lineItems={lineItems}
              isGradeMode={isGradeMode}
              currentGradeInfo={currentGradeInfo}
              exceptionCount={Object.keys(studentExceptions)?.length}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateInvoice;
