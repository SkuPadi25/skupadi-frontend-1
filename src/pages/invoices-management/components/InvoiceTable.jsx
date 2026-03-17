import React, { useState, useEffect } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import InvoiceActionMenu from './InvoiceActionMenu';
import notificationService from '../../../services/notificationService';

const InvoiceTable = ({ invoices, onSort, sortConfig, onBulkAction }) => {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingBulkNotification, setIsLoadingBulkNotification] = useState(false);
  const [bulkNotificationStatus, setBulkNotificationStatus] = useState(null);
  const [isLoadingBulkPDF, setIsLoadingBulkPDF] = useState(false);
  const [bulkPDFStatus, setBulkPDFStatus] = useState(null);
  const itemsPerPage = 10;

  const displayInvoices = invoices || [];

  const totalPages = Math?.ceil(displayInvoices?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = displayInvoices?.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when invoices change (due to filtering)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [invoices]);

  const getParentContact = (invoice) => {
    return {
      email: invoice?.parentEmail || '',
      phone: invoice?.parentPhone || ''
    };
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedInvoices(paginatedInvoices?.map(invoice => invoice?.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId, checked) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices?.filter(id => id !== invoiceId));
    }
  };

  const handleSort = (column) => {
    if (onSort) {
      onSort(column);
    }
  };

  const handleBulkSendReminders = async () => {
    if (selectedInvoices?.length === 0) return;

    setIsLoadingBulkNotification(true);
    setBulkNotificationStatus(null);

    try {
      // Get selected invoice data
      const selectedInvoiceData = paginatedInvoices?.filter(invoice => 
        selectedInvoices?.includes(invoice?.id)
      );

      // Filter only unpaid invoices for reminders
      const unpaidInvoices = selectedInvoiceData?.filter(invoice => 
        invoice?.status !== 'paid'
      );

      if (unpaidInvoices?.length === 0) {
        setBulkNotificationStatus({
          type: 'warning',
          message: 'No unpaid invoices selected. Only unpaid invoices can receive payment reminders.'
        });
        return;
      }

      // Prepare notification data for bulk sending
      const notifications = unpaidInvoices?.map(invoice => {
        const parentContact = getParentContact(invoice);
        
        if (invoice?.status === 'overdue') {
          const dueDate = new Date(invoice?.dueDate);
          const today = new Date();
          const daysOverdue = Math?.ceil((today - dueDate) / (1000 * 60 * 60 * 24));

          return {
            type: 'overdue_notice',
            data: {
              invoiceId: invoice?.id,
              studentName: invoice?.studentName,
              parentEmail: parentContact?.email,
              parentPhone: parentContact?.phone,
              amount: invoice?.amount,
              dueDate: invoice?.dueDate,
              daysOverdue: Math?.max(daysOverdue, 1),
              totalOwed: invoice?.amount,
              schoolName: 'Greenwood High School'
            }
          };
        } else {
          return {
            type: 'payment_reminder',
            data: {
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
            }
          };
        }
      });

      // Send bulk notifications
      const results = await notificationService?.sendBulkNotifications(notifications);
      
      // Count successful and failed notifications
      const successful = results?.filter(result => result?.success)?.length || 0;
      const failed = results?.length - successful;

      setBulkNotificationStatus({
        type: successful > 0 ? 'success' : 'error',
        message: `Bulk notification complete: ${successful} sent successfully${failed > 0 ? `, ${failed} failed` : ''}`
      });

      // Show browser notification if available
      if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
        new Notification('Bulk Notifications Sent', {
          body: `${successful} reminders sent to parents successfully`,
          icon: '/favicon.ico'
        });
      }

      // Clear selection after successful bulk operation
      if (successful > 0) {
        setSelectedInvoices([]);
      }

    } catch (error) {
      console.error('Bulk notification error:', error);
      setBulkNotificationStatus({
        type: 'error',
        message: error?.message || 'Failed to send bulk notifications'
      });
    } finally {
      setIsLoadingBulkNotification(false);
    }
  };

  const handleBulkPDFGeneration = async () => {
    if (selectedInvoices?.length === 0) return;

    setIsLoadingBulkPDF(true);
    setBulkPDFStatus(null);

    try {
      // Import PDF service
      const { default: pdfGenerationService } = await import('../../../services/pdfGenerationService');
      
      // Get selected invoice data
      const selectedInvoiceData = paginatedInvoices?.filter(invoice => 
        selectedInvoices?.includes(invoice?.id)
      );

      // Generate bulk PDFs
      const result = await pdfGenerationService?.generateBulkInvoicePDFs(selectedInvoiceData, {
        download: true
      });

      if (result?.success) {
        setBulkPDFStatus({
          type: 'success',
          message: `Successfully generated ${result?.successCount} PDFs out of ${result?.totalProcessed} invoices`
        });

        // Show browser notification if available
        if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
          new Notification('Bulk PDF Generation Complete', {
            body: `${result?.successCount} invoice PDFs generated successfully`,
            icon: '/favicon.ico'
          });
        }

        // Clear selection after successful generation
        setSelectedInvoices([]);
      } else {
        throw new Error(result?.error || 'Some PDFs failed to generate');
      }

    } catch (error) {
      console.error('Bulk PDF generation error:', error);
      setBulkPDFStatus({
        type: 'error',
        message: error?.message || 'Failed to generate PDFs'
      });
    } finally {
      setIsLoadingBulkPDF(false);
    }
  };

  const getSortIcon = (column) => {
    if (!sortConfig || sortConfig?.key !== column) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    })?.format(amount);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Show results count */}
      <div className="px-6 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {displayInvoices?.length > 0 ? startIndex + 1 : 0} to {Math?.min(startIndex + itemsPerPage, displayInvoices?.length)} of {displayInvoices?.length} invoices
          </span>
          {displayInvoices?.length === 0 && (
            <span className="text-sm text-muted-foreground">
              No invoices match your current filters
            </span>
          )}
        </div>
      </div>

      {/* Bulk Notification Status */}
      {bulkNotificationStatus && (
        <div className={`px-6 py-3 border-b border-border ${
          bulkNotificationStatus?.type === 'success' ? 'bg-green-50 text-green-700' :
          bulkNotificationStatus?.type === 'warning'? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon 
              name={bulkNotificationStatus?.type === 'success' ? 'CheckCircle' : 
                    bulkNotificationStatus?.type === 'warning' ? 'AlertTriangle' : 'AlertCircle'} 
              size={16} 
            />
            <span className="text-sm">{bulkNotificationStatus?.message}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBulkNotificationStatus(null)}
              className="ml-auto"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      )}
      {/* Bulk PDF Status */}
      {bulkPDFStatus && (
        <div className={`px-6 py-3 border-b border-border ${
          bulkPDFStatus?.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon 
              name={bulkPDFStatus?.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
              size={16} 
            />
            <span className="text-sm">{bulkPDFStatus?.message}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBulkPDFStatus(null)}
              className="ml-auto"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      )}
      {/* Bulk Actions Bar */}
      {selectedInvoices?.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedInvoices?.length} invoice{selectedInvoices?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                iconName={isLoadingBulkNotification ? "Loader2" : "Mail"} 
                iconSize={14}
                onClick={handleBulkSendReminders}
                disabled={isLoadingBulkNotification}
                className={isLoadingBulkNotification ? "animate-spin" : ""}
              >
                {isLoadingBulkNotification ? 'Sending...' : 'Send Reminders'}
              </Button>
              <Button variant="outline" size="sm" iconName="CreditCard" iconSize={14}>
                Record Payments
              </Button>
              <Button variant="outline" size="sm" iconName="Download" iconSize={14}>
                Export Selected
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                iconName="FileText" 
                iconSize={14}
                onClick={handleBulkPDFGeneration}
                disabled={isLoadingBulkPDF}
                className={isLoadingBulkPDF ? "animate-spin" : ""}
              >
                {isLoadingBulkPDF ? 'Generating PDFs...' : 'Generate PDFs'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedInvoices?.length === paginatedInvoices?.length && paginatedInvoices?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Invoice #</span>
                  <Icon name={getSortIcon('id')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('studentName')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Student</span>
                  <Icon name={getSortIcon('studentName')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('amount')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Due Date</span>
                  <Icon name={getSortIcon('dueDate')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-right px-6 py-4">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedInvoices?.map((invoice) => (
              <tr key={invoice?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedInvoices?.includes(invoice?.id)}
                    onChange={(e) => handleSelectInvoice(invoice?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{invoice?.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{invoice?.studentName}</div>
                    <div className="text-sm text-muted-foreground">{invoice?.class}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{formatAmount(invoice?.amount)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{formatDate(invoice?.dueDate)}</div>
                </td>
                <td className="px-6 py-4">
                  <InvoiceStatusBadge status={invoice?.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <InvoiceActionMenu invoice={invoice} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {paginatedInvoices?.map((invoice) => (
          <div key={invoice?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedInvoices?.includes(invoice?.id)}
                  onChange={(e) => handleSelectInvoice(invoice?.id, e?.target?.checked)}
                  className="rounded border-border"
                />
                <div>
                  <div className="font-medium text-foreground">{invoice?.id}</div>
                  <div className="text-sm text-muted-foreground">{invoice?.studentName}</div>
                </div>
              </div>
              <InvoiceStatusBadge status={invoice?.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Amount</div>
                <div className="font-medium text-foreground">{formatAmount(invoice?.amount)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Due Date</div>
                <div className="text-sm text-foreground">{formatDate(invoice?.dueDate)}</div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <InvoiceActionMenu invoice={invoice} />
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, displayInvoices?.length)} of {displayInvoices?.length} invoices
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                iconName="ChevronLeft"
                iconSize={14}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                iconName="ChevronRight"
                iconSize={14}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
