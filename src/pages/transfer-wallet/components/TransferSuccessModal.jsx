import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TransferSuccessModal = ({ isOpen, onClose, transferData }) => {
  if (!isOpen) return null;

  const generateTransactionRef = () => {
    return 'TXN' + Date.now()?.toString()?.slice(-8);
  };

  const transactionRef = generateTransactionRef();
  const transactionDate = new Date()?.toLocaleString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleSaveReceipt = () => {
    // Mock save receipt functionality
    console.log('Saving receipt for transaction:', transactionRef);
    // In a real app, this would generate and download a PDF receipt
  };

  const handleNewTransfer = () => {
    onClose?.();
    // In a real app, this would reset the form for a new transfer
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
            <Icon name="CheckCircle" size={40} />
          </div>

          {/* Success Message */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Transfer Successful!</h2>
            <p className="text-muted-foreground">
              Your transfer has been completed successfully
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-secondary/50 rounded-lg p-4 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction Reference</span>
              <span className="font-medium text-foreground font-mono">{transactionRef}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Sent</span>
              <span className="font-medium text-foreground">{transferData?.amount}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-medium text-foreground text-right">
                {transferData?.recipient?.accountName}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank</span>
              <span className="font-medium text-foreground">
                {transferData?.recipient?.bankName}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-medium text-foreground text-right text-sm">
                {transactionDate}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSaveReceipt}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Save Receipt
            </Button>
            
            <Button
              className="w-full"
              onClick={handleNewTransfer}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Make Another Transfer
            </Button>
            
            <Button
              variant="ghost"
              className="w-full"
              onClick={onClose}
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Wallet
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              You will receive a confirmation email shortly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferSuccessModal;