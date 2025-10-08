import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, color = "primary" }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: "bg-primary text-primary-foreground",
      success: "bg-success text-success-foreground", 
      warning: "bg-warning text-warning-foreground",
      accent: "bg-accent text-accent-foreground"
    };
    return colors[colorType] || colors.primary;
  };

  const getChangeColor = (type) => {
    if (type === 'positive') return 'text-success';
    if (type === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow h-full min-h-[140px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={20} color="white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor(changeType)}`}>
            <Icon 
              name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
              size={16} 
            />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-end">
        <h3 className="text-2xl font-bold text-foreground mb-1 leading-tight">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default KPICard;