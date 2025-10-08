import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import Icon from './AppIcon';
import Button from './ui/Button';
import notificationService from '../services/notificationService';

const NotificationCenter = ({ 
  isOpen = false, 
  onClose = () => {}, 
  maxHeight = '400px' 
}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, payment_reminder, payment_confirmation, overdue_notice, invoice_delivery
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const filterType = filter === 'all' ? null : filter;
      const history = notificationService?.getNotificationHistory(50, filterType);
      setNotifications(history);
      
      // Count unread notifications (notifications from last 24 hours that user hasn't seen)
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const unread = history?.filter(notif => 
        new Date(notif?.timestamp) > dayAgo && notif?.status === 'sent'
      );
      setUnreadCount(unread?.length);
      
    } catch (error) {
      console?.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  // Clear all notifications
  const handleClearAll = () => {
    if (window?.confirm('Are you sure you want to clear all notification history?')) {
      notificationService?.clearNotificationHistory();
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type, status) => {
    if (status === 'failed') {
      return { name: 'AlertCircle', className: 'text-destructive' };
    }

    switch (type) {
      case 'payment_reminder':
        return { name: 'Clock', className: 'text-warning' };
      case 'payment_confirmation':
        return { name: 'CheckCircle', className: 'text-success' };
      case 'overdue_notice':
        return { name: 'AlertTriangle', className: 'text-destructive' };
      case 'invoice_delivery':
        return { name: 'FileText', className: 'text-info' };
      default:
        return { name: 'Bell', className: 'text-muted-foreground' };
    }
  };

  // Get notification title based on type
  const getNotificationTitle = (notification) => {
    const { type, status, studentName, amount, invoiceId } = notification;
    
    if (status === 'failed') {
      return `Failed to send ${type?.replace('_', ' ')}`;
    }

    switch (type) {
      case 'payment_reminder':
        return `Payment reminder sent - ${studentName}`;
      case 'payment_confirmation':
        return `Payment confirmed - ${studentName}`;
      case 'overdue_notice':
        return `Overdue notice sent - ${studentName}`;
      case 'invoice_delivery':
        return `Invoice delivered - ${studentName}`;
      default:
        return 'Notification';
    }
  };

  // Get notification description
  const getNotificationDescription = (notification) => {
    const { type, amount, invoiceId, transactionId, channels = [], error } = notification;
    
    if (notification?.status === 'failed') {
      return `Error: ${error}`;
    }

    const channelText = channels?.length > 0 ? ` via ${channels?.join(', ')}` : '';
    
    switch (type) {
      case 'payment_reminder':
        return `Invoice #${invoiceId} - ₦${amount?.toLocaleString()}${channelText}`;
      case 'payment_confirmation':
        return `₦${amount?.toLocaleString()} payment confirmed${channelText}`;
      case 'overdue_notice':
        return `Invoice #${invoiceId} overdue${channelText}`;
      case 'invoice_delivery':
        return `Invoice #${invoiceId} sent${channelText}`;
      default:
        return 'System notification';
    }
  };

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Notifications', count: notifications?.length },
    { value: 'payment_reminder', label: 'Payment Reminders', count: notifications?.filter(n => n?.type === 'payment_reminder')?.length },
    { value: 'payment_confirmation', label: 'Confirmations', count: notifications?.filter(n => n?.type === 'payment_confirmation')?.length },
    { value: 'overdue_notice', label: 'Overdue Notices', count: notifications?.filter(n => n?.type === 'overdue_notice')?.length },
    { value: 'invoice_delivery', label: 'Invoice Deliveries', count: notifications?.filter(n => n?.type === 'invoice_delivery')?.length }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={onClose}>
      <div 
        className="fixed right-4 top-20 w-96 bg-card border border-border rounded-lg shadow-lg"
        onClick={e => e?.stopPropagation()}
        style={{ maxHeight }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-foreground" />
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs"
            >
              Clear All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            {filterOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => setFilter(option?.value)}
                className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  filter === option?.value
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {option?.label}
                {option?.count > 0 && (
                  <span className="ml-1 bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-xs">
                    {option?.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications?.length === 0 ? (
            <div className="text-center p-8">
              <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications?.map((notification) => {
                const icon = getNotificationIcon(notification?.type, notification?.status);
                const isRecent = new Date(notification?.timestamp) > new Date(Date.now() - 60 * 60 * 1000); // Last hour
                
                return (
                  <div
                    key={notification?.id}
                    className={`p-4 hover:bg-muted/50 transition-colors ${
                      isRecent ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon 
                          name={icon?.name} 
                          size={16} 
                          className={icon?.className} 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground truncate">
                            {getNotificationTitle(notification)}
                          </p>
                          {isRecent && (
                            <span className="ml-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                              New
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {getNotificationDescription(notification)}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(notification?.timestamp), 'MMM dd, hh:mm a')}
                          </span>
                          
                          {notification?.channels && notification?.channels?.length > 0 && (
                            <div className="flex items-center space-x-1">
                              {notification?.channels?.includes('email') && (
                                <Icon name="Mail" size={12} className="text-muted-foreground" />
                              )}
                              {notification?.channels?.includes('sms') && (
                                <Icon name="MessageSquare" size={12} className="text-muted-foreground" />
                              )}
                              {notification?.channels?.includes('push') && (
                                <Icon name="Smartphone" size={12} className="text-muted-foreground" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications?.length > 0 && (
          <div className="border-t border-border p-3 bg-muted/30">
            <p className="text-xs text-center text-muted-foreground">
              Showing {notifications?.length} notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;