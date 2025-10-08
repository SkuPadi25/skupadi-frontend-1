import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import notificationService from '../../../services/notificationService';
import pdfGenerationService from '../../../services/pdfGenerationService';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import PDFPreviewModal from './PDFPreviewModal';

const InvoiceActionMenu = ({ invoice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [isLoadingNotification, setIsLoadingNotification] = useState(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const [notificationSuccess, setNotificationSuccess] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  // Mock parent contact information - in a real app, this would come from the student/parent database
  const getParentContact = (invoice) => {
    // Mock data mapping for demonstration
    const parentContacts = {
      'INV-2025-001': { email: 'emma.johnson@parent.com', phone: '+2348123456701' },
      'INV-2025-002': { email: 'michael.chen@parent.com', phone: '+2348123456702' },
      'INV-2025-003': { email: 'sarah.williams@parent.com', phone: '+2348123456703' },
      'INV-2025-004': { email: 'david.rodriguez@parent.com', phone: '+2348123456704' },
      'INV-2025-005': { email: 'lisa.anderson@parent.com', phone: '+2348123456705' },
      'INV-2025-006': { email: 'james.wilson@parent.com', phone: '+2348123456706' },
      'INV-2025-007': { email: 'maria.garcia@parent.com', phone: '+2348123456707' },
      'INV-2025-008': { email: 'robert.taylor@parent.com', phone: '+2348123456708' }
    };
    
    return parentContacts?.[invoice?.id] || {
      email: 'parent@example.com',
      phone: '+2348123456789'
    };
  };

  const handleViewDetails = () => {
    setShowInvoiceDetails(true);
    setIsOpen(false);
  };

  const handleRecordPayment = () => {
    console.log('Record payment for invoice:', invoice?.id);
    setIsOpen(false);
  };

  const handleDownloadPDF = async () => {
    setIsLoadingPDF(true);
    setPdfError(null);
    setIsOpen(false);

    try {
      const result = await pdfGenerationService?.downloadInvoicePDF(invoice);
      
      if (result?.success) {
        setNotificationSuccess(`Invoice ${invoice?.id} downloaded as ${result?.filename}`);
        
        // Show browser notification if available
        if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
          new Notification('Invoice Downloaded', {
            body: `Invoice ${invoice?.id} has been downloaded successfully`,
            icon: '/favicon.ico'
          });
        }
      } else {
        throw new Error(result?.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      setPdfError(error?.message || 'Failed to generate PDF');
    } finally {
      setIsLoadingPDF(false);
    }
  };

  const handlePreviewPDF = async () => {
    setIsLoadingPDF(true);
    setPdfError(null);
    setIsOpen(false);

    try {
      setShowPDFPreview(true);
    } catch (error) {
      console.error('PDF preview error:', error);
      setPdfError(error?.message || 'Failed to preview PDF');
    } finally {
      setIsLoadingPDF(false);
    }
  };

  const handleSendReminder = async () => {
    setIsLoadingNotification(true);
    setNotificationError(null);
    setNotificationSuccess(null);

    try {
      const parentContact = getParentContact(invoice);
      
      // Determine notification type based on invoice status
      let notificationResult;
      
      if (invoice?.status === 'overdue') {
        // Calculate days overdue
        const dueDate = new Date(invoice?.dueDate);
        const today = new Date();
        const daysOverdue = Math?.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        
        notificationResult = await notificationService?.sendOverdueNotice({
          invoiceId: invoice?.id,
          studentName: invoice?.studentName,
          parentEmail: parentContact?.email,
          parentPhone: parentContact?.phone,
          amount: invoice?.amount,
          dueDate: invoice?.dueDate,
          daysOverdue: Math?.max(daysOverdue, 1),
          totalOwed: invoice?.amount,
          schoolName: 'Greenwood High School'
        });
      } else if (invoice?.status === 'pending') {
        notificationResult = await notificationService?.sendPaymentReminder({
          invoiceId: invoice?.id,
          studentName: invoice?.studentName,
          parentEmail: parentContact?.email,
          parentPhone: parentContact?.phone,
          amount: invoice?.amount,
          dueDate: invoice?.dueDate,
          invoiceItems: [
            { description: 'Tuition Fee', amount: invoice?.amount * 0.7 },
            { description: 'Activity Fee', amount: invoice?.amount * 0.2 },
            { description: 'Technology Fee', amount: invoice?.amount * 0.1 }
          ],
          schoolName: 'Greenwood High School'
        });
      } else {
        // For paid invoices, send receipt/confirmation
        notificationResult = await notificationService?.sendInvoiceDelivery({
          invoiceId: invoice?.id,
          studentName: invoice?.studentName,
          parentEmail: parentContact?.email,
          parentPhone: parentContact?.phone,
          totalAmount: invoice?.amount,
          dueDate: invoice?.dueDate,
          invoiceItems: [
            { description: 'Tuition Fee', amount: invoice?.amount * 0.7 },
            { description: 'Activity Fee', amount: invoice?.amount * 0.2 },
            { description: 'Technology Fee', amount: invoice?.amount * 0.1 }
          ],
          schoolName: 'Greenwood High School'
        });
      }

      if (notificationResult?.success) {
        setNotificationSuccess(`Notification sent successfully via ${notificationResult?.channels?.join(', ')}`);
        console.log(`Notification sent successfully for invoice ${invoice?.id}:`, notificationResult);
        
        // Show browser notification if available
        if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
          new Notification('Notification Sent', {
            body: `Reminder sent to ${invoice?.studentName}'s parent successfully`,
            icon: '/favicon.ico'
          });
        }
      } else {
        throw new Error(notificationResult?.error || 'Failed to send notification');
      }

    } catch (error) {
      console.error('Notification error:', error);
      setNotificationError(error?.message || 'Failed to send notification');
    } finally {
      setIsLoadingNotification(false);
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setIsOpen(false);
  };

  const confirmDelete = () => {
    console.log('Delete invoice:', invoice?.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          iconName="MoreHorizontal"
          iconSize={16}
        />

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-8 z-20 w-56 bg-popover border border-border rounded-lg shadow-lg py-1">
              <button
                onClick={handleViewDetails}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Icon name="Eye" size={14} />
                <span>View Details</span>
              </button>
              
              {/* PDF Generation Options */}
              <div className="border-t border-border my-1" />
              <button
                onClick={handlePreviewPDF}
                disabled={isLoadingPDF}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Icon name={isLoadingPDF ? "Loader2" : "FileText"} size={14} className={isLoadingPDF ? "animate-spin" : ""} />
                <span>{isLoadingPDF ? 'Loading...' : 'Preview PDF'}</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isLoadingPDF}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Icon name={isLoadingPDF ? "Loader2" : "Download"} size={14} className={isLoadingPDF ? "animate-spin" : ""} />
                <span>{isLoadingPDF ? 'Generating...' : 'Download PDF'}</span>
              </button>
              
              <div className="border-t border-border my-1" />
              
              {invoice?.status !== 'paid' && (
                <button
                  onClick={handleRecordPayment}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Icon name="CreditCard" size={14} />
                  <span>Record Payment</span>
                </button>
              )}
              
              <button
                onClick={handleSendReminder}
                disabled={isLoadingNotification}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Icon name={isLoadingNotification ? "Loader2" : "Mail"} size={14} className={isLoadingNotification ? "animate-spin" : ""} />
                <span>{isLoadingNotification ? 'Sending...' : 'Send Reminder'}</span>
              </button>
              
              <div className="border-t border-border my-1" />
              
              <button
                onClick={handleDelete}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Icon name="Trash2" size={14} />
                <span>Delete Invoice</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Invoice Details Modal */}
      {showInvoiceDetails && (
        <InvoiceDetailsModal 
          invoice={invoice} 
          onClose={() => setShowInvoiceDetails(false)} 
        />
      )}

      {/* PDF Preview Modal */}
      {showPDFPreview && (
        <PDFPreviewModal 
          invoice={invoice} 
          onClose={() => setShowPDFPreview(false)} 
        />
      )}

      {/* Notification Status */}
      {notificationSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg max-w-sm">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} color="#22c55e" />
            <span className="text-sm text-green-700">{notificationSuccess}</span>
          </div>
        </div>
      )}
      {(notificationError || pdfError) && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg max-w-sm">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} color="#ef4444" />
            <span className="text-sm text-red-700">{notificationError || pdfError}</span>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={cancelDelete} />
          <div className="relative bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4 modal-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} color="#ef4444" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Delete Invoice</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-foreground mb-6">
              Are you sure you want to delete invoice <strong>{invoice?.id}</strong> for {invoice?.studentName}?
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceActionMenu;