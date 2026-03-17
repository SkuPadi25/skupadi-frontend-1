import React from 'react';
import Icon from '../../../components/AppIcon';

const formatRelativeTime = (timestamp) => {
  const value = new Date(timestamp).getTime();
  const diffMinutes = Math.max(1, Math.floor((Date.now() - value) / (1000 * 60)));

  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const RecentActivity = ({ activities = [] }) => {
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
      </div>
      <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
        {activities?.length > 0 ? activities?.map((activity) => (
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
                  {formatRelativeTime(activity?.time)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {activity?.description}
              </p>
            </div>
          </div>
        )) : (
          <div className="py-8 text-center text-muted-foreground">
            No recent activity yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
