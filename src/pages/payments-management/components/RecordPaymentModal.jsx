import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import receiptService from '../../../services/receiptService';

const RecordPaymentModal = ({ isOpen, onClose, onPaymentRecorded }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    invoiceId: '',
    amount: '',
    paymentType: 'full',
    paymentDate: new Date()?.toISOString()?.split('T')?.[0],
    reference: '',
    notes: '',
    receivedBy: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchStudent, setSearchStudent] = useState('');

  // Mock students data - in real app, this would come from API
  const mockStudents = [
    {
      id: 'STU-2025-001',
      name: 'Emma Johnson',
      class: 'Grade 10A',
      admissionNumber: 'ADM-001',
      parentName: 'Robert Johnson',
      parentPhone: '+234-803-123-4567'
    },
    {
      id: 'STU-2025-002',
      name: 'Michael Chen',
      class: 'Grade 9B',
      admissionNumber: 'ADM-002',
      parentName: 'David Chen',
      parentPhone: '+234-803-234-5678'
    },
    {
      id: 'STU-2025-003',
      name: 'Sarah Williams',
      class: 'Grade 11A',
      admissionNumber: 'ADM-003',
      parentName: 'Jennifer Williams',
      parentPhone: '+234-803-345-6789'
    },
    {
      id: 'STU-2025-004',
      name: 'David Rodriguez',
      class: 'Grade 8C',
      admissionNumber: 'ADM-004',
      parentName: 'Carlos Rodriguez',
      parentPhone: '+234-803-456-7890'
    },
    {
      id: 'STU-2025-005',
      name: 'Lisa Anderson',
      class: 'Grade 12A',
      admissionNumber: 'ADM-005',
      parentName: 'Mark Anderson',
      parentPhone: '+234-803-567-8901'
    }
  ];

  // Mock invoices data - in real app, this would come from API
  const mockInvoices = [
    {
      id: 'INV-2025-001',
      studentId: 'STU-2025-001',
      studentName: 'Emma Johnson',
      totalAmount: 500000.00,
      paidAmount: 0.00,
      remainingAmount: 500000.00,
      dueDate: '2025-02-15',
      status: 'unpaid',
      items: [
        { category: 'Tuition Fee', amount: 300000.00 },
        { category: 'Development Levy', amount: 100000.00 },
        { category: 'Administrative Fee', amount: 75000.00 },
        { category: 'Library Fee', amount: 25000.00 }
      ]
    },
    {
      id: 'INV-2025-002',
      studentId: 'STU-2025-002',
      studentName: 'Michael Chen',
      totalAmount: 300000.00,
      paidAmount: 0.00,
      remainingAmount: 300000.00,
      dueDate: '2025-02-20',
      status: 'unpaid',
      items: [
        { category: 'Tuition Fee', amount: 200000.00 },
        { category: 'Development Levy', amount: 60000.00 },
        { category: 'Administrative Fee', amount: 40000.00 }
      ]
    },
    {
      id: 'INV-2025-003',
      studentId: 'STU-2025-003',
      studentName: 'Sarah Williams',
      totalAmount: 250000.00,
      paidAmount: 0.00,
      remainingAmount: 250000.00,
      dueDate: '2025-02-25',
      status: 'unpaid',
      items: [
        { category: 'Tuition Fee', amount: 180000.00 },
        { category: 'Development Levy', amount: 50000.00 },
        { category: 'Administrative Fee', amount: 20000.00 }
      ]
    },
    {
      id: 'INV-2025-009',
      studentId: 'STU-2025-004',
      studentName: 'David Rodriguez',
      totalAmount: 600000.00,
      paidAmount: 200000.00,
      remainingAmount: 400000.00,
      dueDate: '2025-02-10',
      status: 'partial',
      items: [
        { category: 'Tuition Fee', amount: 400000.00 },
        { category: 'Development Levy', amount: 120000.00 },
        { category: 'Administrative Fee', amount: 80000.00 }
      ]
    },
    {
      id: 'INV-2025-010',
      studentId: 'STU-2025-005',
      studentName: 'Lisa Anderson',
      totalAmount: 950000.00,
      paidAmount: 380000.00,
      remainingAmount: 570000.00,
      dueDate: '2025-01-30',
      status: 'partial',
      items: [
        { category: 'Tuition Fee', amount: 600000.00 },
        { category: 'Development Levy', amount: 200000.00 },
        { category: 'Administrative Fee', amount: 100000.00 },
        { category: 'Library Fee', amount: 50000.00 }
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setStudents(mockStudents);
      setInvoices(mockInvoices);
      // Generate default reference number
      const refNumber = `CASH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setFormData(prev => ({
        ...prev,
        reference: refNumber,
        receivedBy: 'Finance Officer' // Default value, could be from user context
      }));
    }
  }, [isOpen]);

  // Filter students based on search
  const filteredStudents = students?.filter(student =>
    student?.name?.toLowerCase()?.includes(searchStudent?.toLowerCase()) ||
    student?.admissionNumber?.toLowerCase()?.includes(searchStudent?.toLowerCase()) ||
    student?.class?.toLowerCase()?.includes(searchStudent?.toLowerCase())
  );

  // Get student's invoices
  const getStudentInvoices = (studentId) => {
    return invoices?.filter(invoice => invoice?.studentId === studentId);
  };

  // Handle student selection
  const handleStudentSelect = (student) => {
    setFormData(prev => ({
      ...prev,
      studentId: student?.id,
      studentName: student?.name,
      invoiceId: '',
      amount: ''
    }));
    setSearchStudent(student?.name);
    setSelectedInvoice(null);
    
    // Clear any previous errors
    setErrors(prev => ({
      ...prev,
      studentId: '',
      invoiceId: ''
    }));
  };

  // Handle invoice selection
  const handleInvoiceSelect = (invoiceId) => {
    const invoice = invoices?.find(inv => inv?.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setFormData(prev => ({
        ...prev,
        invoiceId: invoiceId,
        amount: invoice?.remainingAmount?.toString()
      }));
      
      // Clear invoice error
      setErrors(prev => ({
        ...prev,
        invoiceId: '',
        amount: ''
      }));
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.studentId) {
      newErrors.studentId = 'Please select a student';
    }

    if (!formData?.invoiceId) {
      newErrors.invoiceId = 'Please select an invoice';
    }

    const amount = parseFloat(formData?.amount);
    if (!formData?.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid payment amount';
    } else if (selectedInvoice && amount > selectedInvoice?.remainingAmount) {
      newErrors.amount = `Amount cannot exceed remaining balance of ${formatAmount(selectedInvoice?.remainingAmount)}`;
    }

    if (!formData?.paymentDate) {
      newErrors.paymentDate = 'Please select payment date';
    }

    if (!formData?.reference) {
      newErrors.reference = 'Please enter payment reference';
    }

    if (!formData?.receivedBy) {
      newErrors.receivedBy = 'Please enter who received the payment';
    }

    return newErrors;
  };

  // Format amount for display
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    })?.format(amount);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create payment data
      const paymentAmount = parseFloat(formData?.amount);
      const paymentType = selectedInvoice && paymentAmount < selectedInvoice?.remainingAmount ? 'partial' : 'full';
      
      const paymentData = {
        id: `PAY-${Date.now()}-CASH`,
        studentId: formData?.studentId,
        studentName: formData?.studentName,
        invoiceId: formData?.invoiceId,
        amount: paymentAmount,
        paymentDate: formData?.paymentDate,
        method: 'cash',
        status: 'completed',
        reference: formData?.reference,
        paymentType: paymentType,
        notes: formData?.notes,
        receivedBy: formData?.receivedBy,
        recordedAt: new Date()?.toISOString(),
        transactionId: `TXN-CASH-${Date.now()}`
      };

      // Generate receipt automatically
      const studentData = students?.find(s => s?.id === formData?.studentId);
      const invoiceData = selectedInvoice;
      const schoolConfig = {
        schoolName: 'EduFinance School',
        schoolAddress: 'School Address',
        schoolPhone: 'School Phone',
        schoolEmail: 'school@edufinance.com',
        brandingEnabled: true
      };

      const receipt = receiptService?.autoGenerateEnhancedReceiptOnPaymentSuccess(
        paymentData,
        studentData,
        invoiceData,
        schoolConfig
      );

      console.log('Cash payment recorded:', paymentData);
      console.log('Receipt generated:', receipt);

      // Notify parent component
      onPaymentRecorded?.(paymentData, receipt);

      // Reset form
      resetForm();
      
      // Close modal
      onClose();

      // Show success message
      alert(`Cash payment of ${formatAmount(paymentAmount)} recorded successfully! Receipt ${receipt?.id} has been generated.`);

    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      studentId: '',
      studentName: '',
      invoiceId: '',
      amount: '',
      paymentType: 'full',
      paymentDate: new Date()?.toISOString()?.split('T')?.[0],
      reference: `CASH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      notes: '',
      receivedBy: 'Finance Officer'
    });
    setErrors({});
    setSearchStudent('');
    setSelectedInvoice(null);
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Banknote" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Record Cash Payment</h2>
              <p className="text-sm text-muted-foreground">Manually record cash payment from students</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Student Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Student Search & Selection *
                </label>
                <Input
                  type="text"
                  placeholder="Search by name, admission number, or class..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e?.target?.value)}
                  error={errors?.studentId}
                />
                {errors?.studentId && (
                  <p className="text-sm text-destructive mt-1">{errors?.studentId}</p>
                )}
              </div>

              {/* Student Results */}
              {searchStudent && filteredStudents?.length > 0 && !formData?.studentId && (
                <div className="border border-border rounded-lg max-h-40 overflow-y-auto">
                  {filteredStudents?.slice(0, 5)?.map((student) => (
                    <button
                      key={student?.id}
                      type="button"
                      onClick={() => handleStudentSelect(student)}
                      className="w-full p-3 text-left hover:bg-muted/50 border-b border-border last:border-0 transition-colors"
                    >
                      <div className="font-medium text-foreground">{student?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {student?.class} • {student?.admissionNumber}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Student */}
              {formData?.studentId && (
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{formData?.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        Student ID: {formData?.studentId}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, studentId: '', studentName: '', invoiceId: '', amount: '' }));
                        setSearchStudent('');
                        setSelectedInvoice(null);
                      }}
                      iconName="X"
                      iconSize={16}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Selection */}
            {formData?.studentId && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Invoice *
                </label>
                <Select
                  value={formData?.invoiceId}
                  onChange={(value) => handleInvoiceSelect(value)}
                  error={errors?.invoiceId}
                >
                  <option value="">Select an invoice...</option>
                  {getStudentInvoices(formData?.studentId)?.map((invoice) => (
                    <option key={invoice?.id} value={invoice?.id}>
                      {invoice?.id} - {formatAmount(invoice?.remainingAmount)} remaining
                      {invoice?.status === 'partial' ? ' (Partial Payment)' : ''}
                    </option>
                  ))}
                </Select>
                {errors?.invoiceId && (
                  <p className="text-sm text-destructive mt-1">{errors?.invoiceId}</p>
                )}
              </div>
            )}

            {/* Invoice Details */}
            {selectedInvoice && (
              <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Invoice Details</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedInvoice?.status === 'unpaid' ?'bg-red-100 text-red-800' :'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedInvoice?.status?.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Amount:</span>
                    <div className="font-medium">{formatAmount(selectedInvoice?.totalAmount)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Paid Amount:</span>
                    <div className="font-medium">{formatAmount(selectedInvoice?.paidAmount)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Remaining:</span>
                    <div className="font-medium text-primary">{formatAmount(selectedInvoice?.remainingAmount)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <div className="font-medium">{new Date(selectedInvoice?.dueDate)?.toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Payment Amount (₦) *
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter payment amount"
                  value={formData?.amount}
                  onChange={(e) => handleInputChange('amount', e?.target?.value)}
                  error={errors?.amount}
                />
                {errors?.amount && (
                  <p className="text-sm text-destructive mt-1">{errors?.amount}</p>
                )}
                {selectedInvoice && formData?.amount && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Max: {formatAmount(selectedInvoice?.remainingAmount)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Payment Date *
                </label>
                <Input
                  type="date"
                  value={formData?.paymentDate}
                  onChange={(e) => handleInputChange('paymentDate', e?.target?.value)}
                  error={errors?.paymentDate}
                />
                {errors?.paymentDate && (
                  <p className="text-sm text-destructive mt-1">{errors?.paymentDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reference Number *
                </label>
                <Input
                  type="text"
                  placeholder="Payment reference"
                  value={formData?.reference}
                  onChange={(e) => handleInputChange('reference', e?.target?.value)}
                  error={errors?.reference}
                />
                {errors?.reference && (
                  <p className="text-sm text-destructive mt-1">{errors?.reference}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Received By *
                </label>
                <Input
                  type="text"
                  placeholder="Staff name"
                  value={formData?.receivedBy}
                  onChange={(e) => handleInputChange('receivedBy', e?.target?.value)}
                  error={errors?.receivedBy}
                />
                {errors?.receivedBy && (
                  <p className="text-sm text-destructive mt-1">{errors?.receivedBy}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Additional Notes
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows="3"
                placeholder="Optional notes about this payment..."
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
              />
            </div>

            {/* Payment Summary */}
            {formData?.amount && selectedInvoice && (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h4 className="font-medium text-foreground mb-3">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Amount:</span>
                    <span className="font-medium">{formatAmount(parseFloat(formData?.amount || 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium">Cash</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Type:</span>
                    <span className="font-medium">
                      {parseFloat(formData?.amount || 0) >= selectedInvoice?.remainingAmount ? 'Full Payment' : 'Partial Payment'}
                    </span>
                  </div>
                  {parseFloat(formData?.amount || 0) < selectedInvoice?.remainingAmount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining Balance:</span>
                      <span className="font-medium text-warning">
                        {formatAmount(selectedInvoice?.remainingAmount - parseFloat(formData?.amount || 0))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              iconName={isSubmitting ? "Loader2" : "Check"}
              iconSize={16}
              className={isSubmitting ? "animate-spin" : ""}
            >
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordPaymentModal;