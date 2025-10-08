import React from 'react';
import Icon from '../AppIcon';

const PageHeader = ({ 
  title, 
  subtitle, 
  actions, 
  icon,
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ${className}`}>
      {/* Title Section */}
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} color="white" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Actions Section */}
      {actions && (
        <div className="flex items-center space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;