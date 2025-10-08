import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentSummaryCards = () => {
  const summaryData = [
    {
      title: 'Total Payments Received',
      value: '₦24,850,000',
      change: '+15.2%',
      changeType: 'positive',
      icon: 'Banknote',
      color: 'success'
    },
    {
      title: 'Pending Payments',
      value: '₦3,240,000',
      change: '-8.5%',
      changeType: 'positive',
      icon: 'Clock',
      color: 'warning'
    },
    {
      title: 'Monthly Collections',
      value: '₦8,750,000',
      change: '+12.8%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'primary'
    },
    {
      title: 'Payment Success Rate',
      value: '96.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Target',
      color: 'accent'
    }
  ];

  const getColorClasses = (colorType) => {
    const colors = {
      primary: "bg-primary text-primary-foreground",
      success: "bg-success text-success-foreground", 
      warning: "bg-warning text-warning-foreground",
      accent: "bg-accent text-accent-foreground"
    };
    return colors?.[colorType] || colors?.primary;
  };

  const getChangeColor = (type) => {
    if (type === 'positive') return 'text-success';
    if (type === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {summaryData?.map((item, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-6 card-shadow h-full min-h-[140px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(item?.color)}`}>
              <Icon name={item?.icon} size={20} color="white" />
            </div>
            {item?.change && (
              <div className={`flex items-center space-x-1 ${getChangeColor(item?.changeType)}`}>
                <Icon 
                  name={item?.changeType === 'positive' ? 'TrendingUp' : item?.changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                  size={16} 
                />
                <span className="text-sm font-medium">{item?.change}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-end">
            <h3 className="text-2xl font-bold text-foreground mb-1 leading-tight">{item?.value}</h3>
            <p className="text-sm text-muted-foreground">{item?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentSummaryCards;