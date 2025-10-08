import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      description: 'Sarah Johnson paid ₦1,200 for Q2 tuition',
      time: '2 minutes ago',
      icon: 'Banknote',
      color: 'success'
    },
    {
      id: 2,
      type: 'student',
      title: 'New Student Enrolled',
      description: 'Michael Chen added to Grade 10-A',
      time: '15 minutes ago',
      icon: 'UserPlus',
      color: 'primary'
    },
    {
      id: 3,
      type: 'invoice',
      title: 'Invoice Created',
      description: 'Monthly fees invoice for Grade 9 students',
      time: '1 hour ago',
      icon: 'FileText',
      color: 'accent'
    },
    {
      id: 4,
      type: 'overdue',
      title: 'Payment Overdue',
      description: 'Emma Wilson - Q2 tuition payment overdue',
      time: '2 hours ago',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      id: 5,
      type: 'bulk',
      title: 'Bulk Import Completed',
      description: '25 new students imported successfully',
      time: '3 hours ago',
      icon: 'Upload',
      color: 'success'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      accent: 'bg-accent text-accent-foreground',
      error: 'bg-error text-error-foreground'
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6 card-shadow h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest system activities and updates</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          View All
        </button>
      </div>
      <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getColorClasses(activity?.color)}`}>
              <Icon name={activity?.icon} size={14} color="white" className="sm:w-4 sm:h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {activity?.title}
                </h4>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {activity?.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {activity?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors font-medium py-2">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;