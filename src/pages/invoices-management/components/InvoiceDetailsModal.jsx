import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import InvoiceStatusBadge from './InvoiceStatusBadge';

const InvoiceDetailsModal = ({ invoice, onClose, fromPriorityInvoices = false }) => {
  const [actionLoading, setActionLoading] = useState(false);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDueDateStatus = (dueDate, status) => {
    if (status === 'overdue') {
      const dueDateObj = new Date(dueDate);
      const today = new Date();
      const overdueDays = Math?.ceil((today - dueDateObj) / (1000 * 60 * 60 * 24));
      
      return {
        text: `${Math?.max(overdueDays, 1)} days overdue`,
        className: 'text-red-600 font-medium'
      };
    } else if (status === 'pending') {
      const dueDateObj = new Date(dueDate);
      const today = new Date();
      const daysUntilDue = Math?.ceil((dueDateObj - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 7 && daysUntilDue > 0) {
        return {
          text: `Due in ${daysUntilDue} days`,
          className: 'text-orange-600 font-medium'
        };
      } else if (daysUntilDue > 7) {
        return {
          text: `Due in ${daysUntilDue} days`,
          className: 'text-foreground'
        };
      }
    }
    
    return {
      text: status === 'paid' ? 'Paid on time' : '',
      className: 'text-green-600 font-medium'
    };
  };

  // Mock invoice line items - in a real app, this would come from the database
  const getInvoiceItems = (invoice) => {
    const mockItems = [
      { description: 'Tuition Fee', amount: invoice?.amount * 0.65 },
      { description: 'Technology Fee', amount: invoice?.amount * 0.15 },
      { description: 'Activity Fee', amount: invoice?.amount * 0.10 },
      { description: 'Library Fee', amount: invoice?.amount * 0.05 },
      { description: 'Sports Fee', amount: invoice?.amount * 0.05 }
    ];
    
    return mockItems?.filter(item => item?.amount > 0);
  };

  const handleRecordPayment = () => {
    setActionLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Recording payment for invoice:', invoice?.id);
      setActionLoading(false);
      onClose();
    }, 1500);
  };

  const handleSendReminder = () => {
    setActionLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Sending reminder for invoice:', invoice?.id);
      setActionLoading(false);
    }, 1000);
  };

  const invoiceItems = getInvoiceItems(invoice);
  const dueDateStatus = getDueDateStatus(invoice?.dueDate, invoice?.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Invoice Details</h2>
            <p className="text-sm text-muted-foreground">Complete invoice information and payment status</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Invoice Overview */}
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{invoice?.id}</h3>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground mb-2">{formatAmount(invoice?.amount)}</div>
                <InvoiceStatusBadge status={invoice?.status} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Issue Date</p>
                <p className="font-medium text-foreground">{formatDate(invoice?.issueDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                <div>
                  <p className="font-medium text-foreground">{formatDate(invoice?.dueDate)}</p>
                  {dueDateStatus?.text && (
                    <p className={`text-xs ${dueDateStatus?.className}`}>{dueDateStatus?.text}</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Payment Date</p>
                <p className="font-medium text-foreground">
                  {invoice?.paymentDate ? formatDate(invoice?.paymentDate) : 'Not paid yet'}
                </p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Student Information</h4>
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} color="white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{invoice?.studentName}</p>
                  <p className="text-sm text-muted-foreground">{invoice?.class} • Student ID: {invoice?.studentId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Class</p>
                  <p className="text-sm font-medium text-foreground">{invoice?.class}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Student ID</p>
                  <p className="text-sm font-medium text-foreground">{invoice?.studentId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Line Items */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Invoice Items</h4>
            <div className="bg-muted/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Description</th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoiceItems?.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-foreground">{item?.description}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-medium text-foreground">{formatAmount(item?.amount)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">Total Amount</td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-foreground">
                        {formatAmount(invoice?.amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Payment Information</h4>
            <div className="bg-muted/20 rounded-lg p-4">
              {invoice?.status === 'paid' ? (
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon name="Check" size={20} color="white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Payment Received</p>
                    <p className="text-sm text-muted-foreground">
                      Paid on {formatDateTime(invoice?.paymentDate)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Icon name="Clock" size={20} color="white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Payment Pending</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice?.status === 'overdue' ? 'Payment overdue' : 'Awaiting payment'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Amount Due</p>
                  <p className="text-sm font-bold text-foreground">
                    {invoice?.status === 'paid' ? '₦0.00' : formatAmount(invoice?.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                  <p className="text-sm text-foreground">
                    {invoice?.status === 'paid' ? 'Bank Transfer' : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">Transaction Timeline</h4>
            <div className="space-y-4">
              {/* Invoice Created */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Icon name="FileText" size={16} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Invoice Created</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(invoice?.issueDate)}</p>
                </div>
              </div>
              
              {/* Invoice Sent */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Icon name="Send" size={16} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Invoice Sent</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(invoice?.issueDate)}</p>
                </div>
              </div>

              {/* Payment Status */}
              {invoice?.status === 'paid' ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon name="Check" size={16} color="white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Payment Received</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(invoice?.paymentDate)}</p>
                  </div>
                </div>
              ) : invoice?.status === 'overdue' ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Icon name="AlertTriangle" size={16} color="white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Payment Overdue</p>
                    <p className="text-xs text-muted-foreground">
                      Due date: {formatDateTime(invoice?.dueDate)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Icon name="Clock" size={16} color="white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Awaiting Payment</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {formatDateTime(invoice?.dueDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                iconName="Download"
                iconSize={14}
              >
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                iconName="Printer"
                iconSize={14}
              >
                Print Invoice
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSendReminder}
                disabled={actionLoading}
                iconName={actionLoading ? "Loader2" : "Mail"}
                iconSize={14}
              >
                {actionLoading ? 'Sending...' : 'Send Reminder'}
              </Button>
            </div>
            
            <div className="flex gap-2">
              {invoice?.status !== 'paid' && !fromPriorityInvoices && (
                <Button 
                  variant="default" 
                  onClick={handleRecordPayment}
                  disabled={actionLoading}
                  iconName={actionLoading ? "Loader2" : "CreditCard"}
                  iconSize={14}
                >
                  {actionLoading ? 'Processing...' : 'Record Payment'}
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;