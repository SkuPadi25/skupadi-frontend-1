import React from 'react';
import Icon from '../../../components/AppIcon';
import WalletCard from './WalletCard';
import SchoolContext from 'contexts/SchoolContext';

const WalletSummary = ({SchoolContext}) => {
  // Mock summary data
  const summaryData = {
    totalMoneyIn: {
      amount: '₦18,500,000',
      change: '+12.5%',
      changeType: 'positive'
    },
    totalMoneyOut: {
      amount: '₦16,050,000',
      change: '-8.2%',
      changeType: 'positive'
    }
  };

  const getChangeColor = (type) => {
    if (type === 'positive') return 'text-success';
    if (type === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (type) => {
    if (type === 'positive') return 'TrendingUp';
    if (type === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
      {/* Wallet Card */}
      <WalletCard />
      {/* Money In/Out Cards */}
        {/* Total Money In */}
        <div className="bg-card rounded-lg border border-border p-6 card-shadow h-full min-h-[140px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-success text-success-foreground flex items-center justify-center">
              <Icon name="ArrowDownLeft" size={20} color="white" />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(summaryData?.totalMoneyIn?.changeType)}`}>
              <Icon 
                name={getChangeIcon(summaryData?.totalMoneyIn?.changeType)} 
                size={16} 
              />
              <span className="text-sm font-medium">{summaryData?.totalMoneyIn?.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{summaryData?.totalMoneyIn?.amount}</h3>
            <p className="text-sm text-muted-foreground">Total Money In</p>
          </div>
        </div>

        {/* Total Money Out */}
        <div className="bg-card rounded-lg border border-border p-6 card-shadow h-full min-h-[140px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-error text-error-foreground flex items-center justify-center">
              <Icon name="ArrowUpRight" size={20} color="white" />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(summaryData?.totalMoneyOut?.changeType)}`}>
              <Icon 
                name={getChangeIcon(summaryData?.totalMoneyOut?.changeType)} 
                size={16} 
              />
              <span className="text-sm font-medium">{summaryData?.totalMoneyOut?.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{summaryData?.totalMoneyOut?.amount}</h3>
            <p className="text-sm text-muted-foreground">Total Money Out</p>
          </div>
        </div>
      
    </div>
  );
};

export default WalletSummary;