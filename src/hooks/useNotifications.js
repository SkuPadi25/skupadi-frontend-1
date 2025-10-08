import { useState, useEffect, useCallback, useRef } from 'react';
import notificationService from '../services/notificationService';

/**
 * Custom hook for managing notifications throughout the application
 * Provides utilities for sending notifications, managing history, and handling permissions
 */
export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [lastError, setLastError] = useState(null);
  
  // Use ref to avoid infinite re-renders
  const notificationQueue = useRef([]);
  const processingQueue = useRef(false);

  // Load notification settings on mount
  useEffect(() => {
    const loadSettings = () => {
      const notificationSettings = notificationService?.getNotificationSettings();
      setSettings(notificationSettings);
    };
    
    loadSettings();
    
    // Check notification permission status
    if (typeof Notification !== 'undefined') {
      setPermissionStatus(Notification?.permission || 'default');
    }
  }, []);

  // Load notification history
  const loadHistory = useCallback(async (limit = 50, type = null) => {
    try {
      const notificationHistory = notificationService?.getNotificationHistory(limit, type);
      setHistory(notificationHistory);
      return notificationHistory;
    } catch (error) {
      console?.error('Failed to load notification history:', error);
      setLastError(error?.message);
      return [];
    }
  }, []);

  // Request notification permissions
  const requestPermission = useCallback(async () => {
    try {
      const result = await notificationService?.requestNotificationPermission();
      setPermissionStatus(result?.permission || 'denied');
      return result;
    } catch (error) {
      console?.error('Failed to request notification permission:', error);
      setLastError(error?.message);
      return { success: false, error: error?.message };
    }
  }, []);

  // Send payment reminder
  const sendPaymentReminder = useCallback(async (data) => {
    setLoading(true);
    setLastError(null);
    
    try {
      const result = await notificationService?.sendPaymentReminder(data);
      
      if (result?.success) {
        // Refresh history
        await loadHistory();
      } else {
        setLastError(result?.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error?.message || 'Failed to send payment reminder';
      setLastError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadHistory]);

  // Send payment confirmation
  const sendPaymentConfirmation = useCallback(async (data) => {
    setLoading(true);
    setLastError(null);
    
    try {
      const result = await notificationService?.sendPaymentConfirmation(data);
      
      if (result?.success) {
        await loadHistory();
      } else {
        setLastError(result?.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error?.message || 'Failed to send payment confirmation';
      setLastError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadHistory]);

  // Send overdue notice
  const sendOverdueNotice = useCallback(async (data) => {
    setLoading(true);
    setLastError(null);
    
    try {
      const result = await notificationService?.sendOverdueNotice(data);
      
      if (result?.success) {
        await loadHistory();
      } else {
        setLastError(result?.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error?.message || 'Failed to send overdue notice';
      setLastError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadHistory]);

  // Send invoice delivery notification
  const sendInvoiceDelivery = useCallback(async (data) => {
    setLoading(true);
    setLastError(null);
    
    try {
      const result = await notificationService?.sendInvoiceDelivery(data);
      
      if (result?.success) {
        await loadHistory();
      } else {
        setLastError(result?.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error?.message || 'Failed to deliver invoice';
      setLastError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadHistory]);

  // Queue notification for batch processing
  const queueNotification = useCallback((notificationType, data) => {
    notificationQueue?.current?.push({
      type: notificationType,
      data,
      timestamp: new Date()?.toISOString()
    });
  }, []);

  // Process notification queue
  const processQueue = useCallback(async () => {
    if (processingQueue?.current || notificationQueue?.current?.length === 0) {
      return { success: true, processed: 0 };
    }

    processingQueue.current = true;
    setLoading(true);
    setLastError(null);

    try {
      const notifications = [...notificationQueue?.current];
      notificationQueue.current = []; // Clear queue

      const results = await notificationService?.sendBulkNotifications(notifications);
      
      const successCount = results?.filter(result => result?.success)?.length;
      const failCount = results?.length - successCount;

      if (failCount > 0) {
        setLastError(`${failCount} notifications failed to send`);
      }

      // Refresh history
      await loadHistory();

      return {
        success: true,
        processed: results?.length,
        successful: successCount,
        failed: failCount,
        results
      };

    } catch (error) {
      const errorMessage = error?.message || 'Failed to process notification queue';
      setLastError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      processingQueue.current = false;
    }
  }, [loadHistory]);

  // Clear notification history
  const clearHistory = useCallback(() => {
    const success = notificationService?.clearNotificationHistory();
    if (success) {
      setHistory([]);
    }
    return success;
  }, []);

  // Get notification statistics
  const getStats = useCallback(() => {
    const stats = {
      total: history?.length,
      sent: history?.filter(n => n?.status === 'sent')?.length,
      failed: history?.filter(n => n?.status === 'failed')?.length,
      byType: {
        payment_reminder: history?.filter(n => n?.type === 'payment_reminder')?.length,
        payment_confirmation: history?.filter(n => n?.type === 'payment_confirmation')?.length,
        overdue_notice: history?.filter(n => n?.type === 'overdue_notice')?.length,
        invoice_delivery: history?.filter(n => n?.type === 'invoice_delivery')?.length
      },
      byChannel: {
        email: history?.filter(n => n?.channels?.includes('email'))?.length,
        sms: history?.filter(n => n?.channels?.includes('sms'))?.length,
        push: history?.filter(n => n?.channels?.includes('push'))?.length
      }
    };

    // Calculate success rate
    stats.successRate = stats?.total > 0 ? ((stats?.sent / stats?.total) * 100)?.toFixed(1) : 0;

    return stats;
  }, [history]);

  // Auto-trigger notifications based on invoice/payment events
  const autoTrigger = useCallback(async (eventType, eventData) => {
    switch (eventType) {
      case 'invoice_created':
        if (eventData?.autoSendNotification !== false) {
          return await sendInvoiceDelivery({
            invoiceId: eventData?.invoiceId,
            studentName: eventData?.studentName,
            parentEmail: eventData?.parentEmail,
            parentPhone: eventData?.parentPhone,
            invoiceItems: eventData?.items || [],
            totalAmount: eventData?.totalAmount,
            dueDate: eventData?.dueDate,
            schoolName: eventData?.schoolName
          });
        }
        break;

      case 'payment_received':
        if (eventData?.autoSendConfirmation !== false) {
          return await sendPaymentConfirmation({
            invoiceId: eventData?.invoiceId,
            transactionId: eventData?.transactionId,
            studentName: eventData?.studentName,
            parentEmail: eventData?.parentEmail,
            parentPhone: eventData?.parentPhone,
            amount: eventData?.amount,
            paymentDate: eventData?.paymentDate,
            paymentMethod: eventData?.paymentMethod,
            schoolName: eventData?.schoolName
          });
        }
        break;

      case 'payment_overdue':
        return await sendOverdueNotice({
          invoiceId: eventData?.invoiceId,
          studentName: eventData?.studentName,
          parentEmail: eventData?.parentEmail,
          parentPhone: eventData?.parentPhone,
          amount: eventData?.amount,
          dueDate: eventData?.dueDate,
          daysOverdue: eventData?.daysOverdue,
          totalOwed: eventData?.totalOwed,
          schoolName: eventData?.schoolName
        });

      case 'payment_reminder_due':
        return await sendPaymentReminder({
          invoiceId: eventData?.invoiceId,
          studentName: eventData?.studentName,
          parentEmail: eventData?.parentEmail,
          parentPhone: eventData?.parentPhone,
          amount: eventData?.amount,
          dueDate: eventData?.dueDate,
          invoiceItems: eventData?.items || [],
          schoolName: eventData?.schoolName
        });

      default:
        console?.warn(`Unknown event type for auto-trigger: ${eventType}`);
        return { success: false, error: 'Unknown event type' };
    }

    return { success: true, message: 'Auto-trigger disabled for this event' };
  }, [sendInvoiceDelivery, sendPaymentConfirmation, sendOverdueNotice, sendPaymentReminder]);

  return {
    // State
    loading,
    history,
    settings,
    permissionStatus,
    lastError,
    queueSize: notificationQueue?.current?.length,

    // Actions
    sendPaymentReminder,
    sendPaymentConfirmation,
    sendOverdueNotice,
    sendInvoiceDelivery,
    
    // Queue management
    queueNotification,
    processQueue,
    
    // Utilities
    loadHistory,
    clearHistory,
    requestPermission,
    getStats,
    autoTrigger,
    
    // Clear error
    clearError: () => setLastError(null)
  };
};

export default useNotifications;