import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, color = "primary" }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: "bg-primary text-primary-foreground",
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
      accent: "bg-accent text-accent-foreground",
      error: "bg-error/10 text-error"
    };
    return colors[colorType] || colors.primary;
  };

  const getChangeColor = (type) => {
    if (type === 'positive') return 'text-success';
    if (type === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border p-4 h-full min-h-[120px] flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-[3px] flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={15} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 pt-1 ${getChangeColor(changeType)}`}>
            <Icon 
              name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
              size={12} 
            />
            <span className="text-[11px] font-semibold leading-none">{change}</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-foreground mb-1 leading-tight tracking-normal">{value}</h3>
        <p className="text-xs text-muted-foreground leading-tight">{title}</p>
      </div>
    </div>
  );
};

export default KPICard;
