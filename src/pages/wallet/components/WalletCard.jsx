import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import SchoolContext from 'contexts/SchoolContext';

// const schl_name = SchoolContext.currentSchool
// console.log(schl_name);

const WalletCard = ({SchoolContext}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);


  // Mock wallet data
  const walletData = {
    accName: "schl_name",
    accNumber: '1234567890',
    bankName: 'First Bank Nigeria',
    walletBalance: '₦2,450,000'
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    // You could add a toast notification here if needed
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formatMaskedBalance = (balance) => {
    // Convert ₦2,450,000 to ₦XXX,XXX
    if (!balance) return '₦XXX,XXX';
    const parts = balance?.split('₦');
    if (parts?.length > 1) {
      const numberPart = parts?.[1];
      const maskedNumber = numberPart?.replace(/\d/g, 'X');
      return `₦${maskedNumber}`;
    }
    return '₦XXX,XXX';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow ">
      {/* Account Name with Copy Icon */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Acc Name - <span className='space-x-2'> </span> 
              <span className="flex items-center space-x-2">
                <span className="text-lg font-medium text-foreground">{walletData?.accName}</span>
                <button
                  onClick={() => copyToClipboard(walletData?.accName)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Copy account name"
                >
                  <Icon name="Copy" size={16} className="text-muted-foreground hover:text-foreground" />
                </button>
              </span>
            </p>
          </div>
        </div>

        {/* Account Number
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Acc Number</p>
          <p className="text-base font-mono text-foreground">{walletData?.accNumber}</p>
        </div> */}

        {/* Bank Name */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Bank Name -<span className='space-x-2'> </span> 
            {walletData?.bankName}</p>
        </div>
      </div>

      {/* Wallet Balance Section */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
           <p className="text-2xl font-bold text-foreground">
          {isBalanceVisible ? walletData?.walletBalance : formatMaskedBalance(walletData?.walletBalance)}
          </p>
          <button
            onClick={toggleBalanceVisibility}
            className="p-1 hover:bg-muted rounded transition-colors"
            title={isBalanceVisible ? "Hide balance" : "Show balance"}
          >
            <Icon 
              name={isBalanceVisible ? "EyeOff" : "Eye"} 
              size={16} 
              className="text-muted-foreground hover:text-foreground" 
            />
          </button>
        </div>
       
        <p className="text-sm text-muted-foreground">Account Balance</p>
      </div>
    </div>
  );
};

export default WalletCard;