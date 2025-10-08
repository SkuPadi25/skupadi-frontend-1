import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import receiptService from '../../../services/receiptService';

const PaymentDetailsModal = ({ payment, onClose }) => {
  const [receipts, setReceipts] = useState([]);
  const [generatingReceipt, setGeneratingReceipt] = useState(false);

  // Load existing receipts for this payment
  useEffect(() => {
    if (payment?.id) {
      const paymentReceipts = receiptService?.getReceiptsByPaymentId(payment?.id);
      setReceipts(paymentReceipts);
    }
  }, [payment?.id]);

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', className: 'bg-success/10 text-success border-success/20' },
      pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
      failed: { label: 'Failed', className: 'bg-error/10 text-error border-error/20' },
      refunded: { label: 'Refunded', className: 'bg-info/10 text-info border-info/20' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${config?.className}`}>
        {config?.label}
      </span>
    );
  };

  const getMethodIcon = (method) => {
    const methodIcons = {
      cash: 'Banknote',
      bank_transfer: 'Building2',
      card: 'CreditCard',
      mobile_money: 'Smartphone'
    };
    return methodIcons?.[method] || 'DollarSign';
  };

  // Generate receipt manually
  const handleGenerateReceipt = async () => {
    setGeneratingReceipt(true);
    try {
      const newReceipt = receiptService?.generateReceipt(payment, 'full');
      setReceipts([...receipts, newReceipt]);
      console.log('Receipt generated successfully:', newReceipt?.id);
    } catch (error) {
      console.error('Error generating receipt:', error);
    } finally {
      setGeneratingReceipt(false);
    }
  };

  // Download existing receipt
  const handleDownloadReceipt = (receiptId) => {
    const receiptData = receiptService?.generateReceiptForDownload(receiptId);
    if (receiptData) {
      // Create downloadable content
      const receiptContent = `
PAYMENT RECEIPT - ${receiptData?.receiptNumber}
=====================================
${receiptData?.schoolInfo?.name}
${receiptData?.schoolInfo?.address}
Phone: ${receiptData?.schoolInfo?.phone}
Email: ${receiptData?.schoolInfo?.email}

Student: ${receiptData?.studentName}
Invoice: ${receiptData?.invoiceId}
Amount: ${formatAmount(receiptData?.amount)}
Date: ${formatDate(receiptData?.paymentDate)}
Method: ${receiptData?.paymentMethod?.replace('_', ' ')?.toUpperCase()}
=====================================
Generated: ${formatDate(receiptData?.generatedAt)}
      `?.trim();
      
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = window.URL?.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${receiptData?.receiptId}.txt`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      
      window.URL?.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Payment Details</h2>
            <p className="text-sm text-muted-foreground">Complete transaction information</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment Overview */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{formatAmount(payment?.amount)}</h3>
                <p className="text-sm text-muted-foreground">Payment Amount</p>
              </div>
              {getStatusBadge(payment?.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Payment ID</p>
                <p className="font-medium text-foreground">{payment?.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Reference</p>
                <p className="font-medium text-foreground">{payment?.reference}</p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Student Information</h4>
            <div className="bg-muted/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{payment?.studentName}</p>
                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Invoice ID</p>
                  <p className="text-sm text-foreground">{payment?.invoiceId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payment Date</p>
                  <p className="text-sm text-foreground">{formatDate(payment?.paymentDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Payment Method</h4>
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Icon name={getMethodIcon(payment?.method)} size={20} color="white" />
                </div>
                <div>
                  <p className="font-medium text-foreground capitalize">{payment?.method?.replace('_', ' ')}</p>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Transaction Reference</p>
                  <p className="text-sm text-foreground font-mono">{payment?.reference}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Processing Time</p>
                  <p className="text-sm text-foreground">Instant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Information */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Receipt Information</h4>
            <div className="bg-muted/20 rounded-lg p-4">
              {receipts?.length > 0 ? (
                <div className="space-y-3">
                  {receipts?.map((receipt, index) => (
                    <div key={receipt?.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                          <Icon name="FileText" size={16} color="white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{receipt?.id}</p>
                          <p className="text-sm text-muted-foreground">Generated {formatDate(receipt?.generatedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm px-2 py-1 bg-success/10 text-success rounded-md border border-success/20">
                          {receipt?.paymentType === 'full' ? 'Full Payment' : 'Partial Payment'}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadReceipt(receipt?.id)}
                          iconName="Download"
                          iconSize={14}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No receipt generated for this payment</p>
                  {payment?.status === 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateReceipt}
                      disabled={generatingReceipt}
                      iconName={generatingReceipt ? "Loader2" : "FileText"}
                      iconSize={14}
                    >
                      {generatingReceipt ? 'Generating...' : 'Generate Receipt'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Transaction Timeline */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Transaction Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Icon name="Check" size={16} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Payment Initiated</p>
                  <p className="text-xs text-muted-foreground">{formatDate(payment?.paymentDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Icon name="Check" size={16} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Payment Processed</p>
                  <p className="text-xs text-muted-foreground">{formatDate(payment?.paymentDate)}</p>
                </div>
              </div>
              
              {payment?.status === 'completed' && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <Icon name="Check" size={16} color="white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Payment Completed</p>
                    <p className="text-xs text-muted-foreground">{formatDate(payment?.paymentDate)}</p>
                  </div>
                </div>
              )}

              {receipts?.length > 0 && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <Icon name="FileText" size={16} color="white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Receipt Generated</p>
                    <p className="text-xs text-muted-foreground">{formatDate(receipts?.[0]?.generatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {receipts?.length > 0 ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadReceipt(receipts?.[0]?.id)}
                    iconName="FileText"
                    iconSize={14}
                  >
                    Download Receipt
                  </Button>
                  <Button variant="outline" size="sm" iconName="Printer" iconSize={14}>
                    Print Receipt
                  </Button>
                </>
              ) : payment?.status === 'completed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateReceipt}
                  disabled={generatingReceipt}
                  iconName={generatingReceipt ? "Loader2" : "FileText"}
                  iconSize={14}
                >
                  {generatingReceipt ? 'Generating...' : 'Generate Receipt'}
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              {payment?.status === 'completed' && (
                <Button variant="outline" size="sm" iconName="RefreshCw" iconSize={14}>
                  Refund Payment
                </Button>
              )}
              <Button variant="default" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;