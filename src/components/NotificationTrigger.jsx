import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import Select from './ui/Select';
import Input from './ui/Input';
import notificationService from '../services/notificationService';

/**
 * NotificationTrigger Component
 * Provides UI controls to manually trigger notifications for testing
 * and integrates with invoice/payment workflows
 */
const NotificationTrigger = ({ 
  type = 'payment_reminder', // payment_reminder | payment_confirmation | overdue_notice | invoice_delivery
  title,
  onSuccess,
  onError,
  disabled = false,
  className = '',
  // Pre-filled data for automatic triggering
  invoiceData = null,
  studentData = null,
  paymentData = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    parentEmail: '',
    parentPhone: '',
    invoiceId: '',
    amount: '',
    dueDate: '',
    transactionId: '',
    paymentMethod: 'Bank Transfer',
    schoolName: 'Greenwood International School'
  });

  // Auto-populate form data when props change
  useEffect(() => {
    if (invoiceData || studentData || paymentData) {
      setFormData(prev => ({
        ...prev,
        ...(studentData && {
          studentName: studentData?.fullName || studentData?.name || '',
          parentEmail: studentData?.parentEmail || studentData?.contactEmail || '',
          parentPhone: studentData?.parentPhone || studentData?.phone || ''
        }),
        ...(invoiceData && {
          invoiceId: invoiceData?.invoiceId || invoiceData?.id || '',
          amount: invoiceData?.totalAmount || invoiceData?.amount || '',
          dueDate: invoiceData?.dueDate || '',
          totalAmount: invoiceData?.totalAmount || invoiceData?.amount || '',
          invoiceItems: invoiceData?.items || []
        }),
        ...(paymentData && {
          transactionId: paymentData?.transactionId || paymentData?.id || '',
          paymentMethod: paymentData?.method || 'Bank Transfer',
          paymentDate: paymentData?.paymentDate || new Date()?.toISOString()
        })
      }));
    }
  }, [invoiceData, studentData, paymentData]);

  // Handle form submission
  const handleSend = async () => {
    if (!formData?.studentName || !formData?.parentEmail) {
      onError?.('Student name and parent email are required');
      return;
    }

    setLoading(true);
    try {
      let result;
      const commonData = {
        studentName: formData?.studentName,
        parentEmail: formData?.parentEmail,
        parentPhone: formData?.parentPhone,
        schoolName: formData?.schoolName
      };

      switch (type) {
        case 'payment_reminder':
          result = await notificationService?.sendPaymentReminder({
            ...commonData,
            invoiceId: formData?.invoiceId,
            amount: parseFloat(formData?.amount) || 0,
            dueDate: formData?.dueDate,
            invoiceItems: formData?.invoiceItems || []
          });
          break;

        case 'payment_confirmation':
          result = await notificationService?.sendPaymentConfirmation({
            ...commonData,
            invoiceId: formData?.invoiceId,
            transactionId: formData?.transactionId,
            amount: parseFloat(formData?.amount) || 0,
            paymentDate: formData?.paymentDate || new Date(),
            paymentMethod: formData?.paymentMethod
          });
          break;

        case 'overdue_notice':
          const daysOverdue = Math?.floor(
            (new Date() - new Date(formData?.dueDate)) / (1000 * 60 * 60 * 24)
          );
          result = await notificationService?.sendOverdueNotice({
            ...commonData,
            invoiceId: formData?.invoiceId,
            amount: parseFloat(formData?.amount) || 0,
            dueDate: formData?.dueDate,
            daysOverdue: Math?.max(daysOverdue, 1),
            totalOwed: parseFloat(formData?.amount) || 0
          });
          break;

        case 'invoice_delivery':
          result = await notificationService?.sendInvoiceDelivery({
            ...commonData,
            invoiceId: formData?.invoiceId,
            invoiceItems: formData?.invoiceItems || [],
            totalAmount: parseFloat(formData?.totalAmount || formData?.amount) || 0,
            dueDate: formData?.dueDate
          });
          break;

        default:
          throw new Error(`Unknown notification type: ${type}`);
      }

      if (result?.success) {
        onSuccess?.(result);
        setIsOpen(false);
        
        // Show success notification
        if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
          new Notification('Notification Sent', {
            body: `${type?.replace('_', ' ')} sent successfully to ${formData?.studentName}'s parent`,
            icon: '/favicon.ico'
          });
        }
      } else {
        throw new Error(result?.error || 'Failed to send notification');
      }

    } catch (error) {
      console?.error('Notification send failed:', error);
      onError?.(error?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  // Auto-send notification if all required data is available
  const handleAutoSend = async () => {
    if (invoiceData && studentData && 
        formData?.studentName && formData?.parentEmail && 
        !loading) {
      await handleSend();
    }
  };

  // Get notification type info
  const getNotificationInfo = () => {
    switch (type) {
      case 'payment_reminder':
        return {
          icon: 'Clock',
          iconClass: 'text-warning',
          title: 'Send Payment Reminder',
          description: 'Send reminder notification for upcoming payment due date'
        };
      case 'payment_confirmation':
        return {
          icon: 'CheckCircle',
          iconClass: 'text-success',
          title: 'Send Payment Confirmation',
          description: 'Send confirmation notification for successful payment'
        };
      case 'overdue_notice':
        return {
          icon: 'AlertTriangle',
          iconClass: 'text-destructive',
          title: 'Send Overdue Notice',
          description: 'Send urgent notice for overdue payment'
        };
      case 'invoice_delivery':
        return {
          icon: 'FileText',
          iconClass: 'text-info',
          title: 'Deliver Invoice',
          description: 'Send new invoice notification to parent'
        };
      default:
        return {
          icon: 'Bell',
          iconClass: 'text-primary',
          title: 'Send Notification',
          description: 'Send system notification'
        };
    }
  };

  const notificationInfo = getNotificationInfo();

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={invoiceData && studentData ? handleAutoSend : () => setIsOpen(true)}
        loading={loading}
        disabled={disabled}
        className={`flex items-center space-x-2 ${className}`}
        title={title || notificationInfo?.description}
      >
        <Icon name={notificationInfo?.icon} size={14} className={notificationInfo?.iconClass} />
        <span className="hidden sm:inline">
          {title || notificationInfo?.title?.replace('Send ', '')}
        </span>
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 max-w-lg mx-auto bg-card border border-border rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e?.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name={notificationInfo?.icon} size={20} className={notificationInfo?.iconClass} />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{notificationInfo?.title}</h3>
                  <p className="text-sm text-muted-foreground">{notificationInfo?.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Student & Parent Info */}
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Student Name"
                  required
                  value={formData?.studentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentName: e?.target?.value }))}
                  placeholder="Enter student name"
                />
                <Input
                  label="Parent Email"
                  type="email"
                  required
                  value={formData?.parentEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e?.target?.value }))}
                  placeholder="parent@example.com"
                />
                <Input
                  label="Parent Phone (Optional)"
                  type="tel"
                  value={formData?.parentPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e?.target?.value }))}
                  placeholder="+234 801 234 5678"
                />
              </div>

              {/* Invoice/Payment Specific Fields */}
              {(type === 'payment_reminder' || type === 'overdue_notice' || type === 'invoice_delivery') && (
                <>
                  <Input
                    label="Invoice ID"
                    required
                    value={formData?.invoiceId}
                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceId: e?.target?.value }))}
                    placeholder="INV-2024-001"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Amount (₦)"
                      type="number"
                      required
                      value={formData?.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e?.target?.value }))}
                      placeholder="50000"
                    />
                    <Input
                      label="Due Date"
                      type="date"
                      required
                      value={formData?.dueDate?.split('T')?.[0] || formData?.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e?.target?.value }))}
                    />
                  </div>
                </>
              )}

              {type === 'payment_confirmation' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Invoice ID"
                      required
                      value={formData?.invoiceId}
                      onChange={(e) => setFormData(prev => ({ ...prev, invoiceId: e?.target?.value }))}
                      placeholder="INV-2024-001"
                    />
                    <Input
                      label="Transaction ID"
                      required
                      value={formData?.transactionId}
                      onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e?.target?.value }))}
                      placeholder="TXN-123456789"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Amount (₦)"
                      type="number"
                      required
                      value={formData?.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e?.target?.value }))}
                      placeholder="50000"
                    />
                    <Select
                      label="Payment Method"
                      options={[
                        { value: 'Bank Transfer', label: 'Bank Transfer' },
                        { value: 'Card Payment', label: 'Card Payment' },
                        { value: 'Cash', label: 'Cash' },
                        { value: 'Mobile Money', label: 'Mobile Money' }
                      ]}
                      value={formData?.paymentMethod}
                      onChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                    />
                  </div>
                </>
              )}

              {/* School Name */}
              <Input
                label="School Name"
                value={formData?.schoolName}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e?.target?.value }))}
                placeholder="Your School Name"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSend}
                loading={loading}
                disabled={!formData?.studentName || !formData?.parentEmail}
              >
                <Icon name="Send" size={14} className="mr-2" />
                Send Notification
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationTrigger;