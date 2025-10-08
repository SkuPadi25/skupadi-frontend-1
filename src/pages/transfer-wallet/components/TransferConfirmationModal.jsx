import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TransferConfirmationModal = ({ isOpen, onClose, transferData, onConfirm }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    if (!amount) return '₦0';
    const numAmount = parseFloat(amount?.toString()?.replace(/[₦,]/g, ''));
    return '₦' + numAmount?.toLocaleString();
  };

  const totalAmount = () => {
    const amount = parseFloat(transferData?.amount?.replace(/[₦,]/g, '')) || 0;
    const fees = transferData?.fees || 0;
    return amount + fees;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Confirm Transfer</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transfer Summary */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">You're sending</p>
              <p className="text-3xl font-bold text-foreground">{transferData?.amount}</p>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Recipient Details</h3>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                  <Icon name="Building2" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{transferData?.recipient?.accountName}</p>
                  <p className="text-sm text-muted-foreground">{transferData?.recipient?.bankName}</p>
                  <p className="text-sm text-muted-foreground font-mono">{transferData?.recipient?.accountNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Transaction Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium text-foreground">{transferData?.amount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transfer Fee</span>
                <span className="font-medium text-foreground">{formatCurrency(transferData?.fees)}</span>
              </div>
              
              <hr className="border-border" />
              
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Total Debit</span>
                <span className="font-semibold text-foreground text-lg">{formatCurrency(totalAmount())}</span>
              </div>
            </div>
          </div>

          {/* Description & Purpose */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description</span>
              <span className="font-medium text-foreground text-right flex-1 ml-4">{transferData?.description}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Purpose</span>
              <span className="font-medium text-foreground capitalize">{transferData?.purpose}</span>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">Important Notice</p>
                <p className="text-amber-700 dark:text-amber-300">
                  Please ensure all details are correct. This transaction cannot be reversed once completed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={onConfirm}
          >
            <Icon name="Lock" size={16} className="mr-2" />
            Confirm Transfer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferConfirmationModal;