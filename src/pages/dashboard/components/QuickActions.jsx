import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const actions = [
    {
      title: 'Add New Student',
      description: 'Register a new student to the system',
      icon: 'UserPlus',
      color: 'primary',
      path: '/add-edit-student'
    },
    {
      title: 'Create Invoice',
      description: 'Generate invoice for student fees',
      icon: 'Plus',
      color: 'accent',
      path: '/create-invoice'
    },
    {
      title: 'Bulk Import',
      description: 'Import multiple students via CSV',
      icon: 'Upload',
      color: 'success',
      path: '/bulk-student-import'
    },
    {
      title: 'View Reports',
      description: 'Access financial and student reports',
      icon: 'BarChart3',
      color: 'warning',
      path: '/reports-center'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      accent: 'bg-accent text-accent-foreground'
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6 card-shadow h-full">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Frequently used operations</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {actions?.map((action, index) => (
          <Link
            key={index}
            to={action?.path}
            className="group block p-3 sm:p-4 rounded-lg border border-border hover:border-primary/20 hover:bg-muted/30 transition-all duration-200"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClasses(action?.color)} group-hover:scale-105 transition-transform`}>
                <Icon name={action?.icon} size={18} color="white" className="sm:w-5 sm:h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {action?.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {action?.description}
                </p>
              </div>
              
              <Icon 
                name="ArrowRight" 
                size={14} 
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 sm:w-4 sm:h-4" 
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Need help getting started?
          </div>
          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
            <Icon name="HelpCircle" size={16} className="mr-2" />
            Help Center
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;