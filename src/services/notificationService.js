import { format } from 'date-fns';

/**
 * Mock Notification Service
 * Handles email, SMS, and push notifications for the school management system
 * Integrates with existing notification preferences from settings
 */
class NotificationService {
  constructor() {
    this.isEnabled = true;
    this.mockDelay = 1500; // Simulate network delay
    this.notificationHistory = [];
  }

  /**
   * Get notification preferences from localStorage (mock persistent storage)
   */
  getNotificationSettings() {
    const defaultSettings = {
      emailEnabled: true,
      paymentReminders: true,
      paymentConfirmations: true,
      overdueNotices: true,
      weeklyReports: false,
      monthlyReports: true,
      systemAlerts: true,
      securityNotifications: true,
      
      smsEnabled: false,
      smsPaymentReminders: false,
      smsPaymentConfirmations: false,
      smsOverdueNotices: false,
      smsSecurityAlerts: true,
      
      pushEnabled: true,
      pushPaymentReminders: true,
      pushPaymentConfirmations: false,
      pushSystemAlerts: true,
      pushSecurityAlerts: true,
      
      inAppNotifications: true,
      notificationSound: true,
      desktopNotifications: false,
      
      parentCommunication: true,
      staffCommunication: true,
      adminAlerts: true,
      
      reminderDays: 7,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      timezone: 'Africa/Lagos'
    };

    try {
      const saved = localStorage?.getItem('notificationSettings');
      return saved ? { ...defaultSettings, ...JSON?.parse(saved) } : defaultSettings;
    } catch (error) {
      console?.error('Error loading notification settings:', error);
      return defaultSettings;
    }
  }

  /**
   * Check if we're in quiet hours
   */
  isQuietTime() {
    const settings = this.getNotificationSettings();
    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    
    const { quietHoursStart, quietHoursEnd } = settings;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (quietHoursStart > quietHoursEnd) {
      return currentTime >= quietHoursStart || currentTime <= quietHoursEnd;
    }
    
    // Handle same-day quiet hours (e.g., 12:00 to 14:00)
    return currentTime >= quietHoursStart && currentTime <= quietHoursEnd;
  }

  /**
   * Log notification to history
   */
  logNotification(notification) {
    const logEntry = {
      ...notification,
      timestamp: new Date().toISOString(),
      id: `notif_${Date.now()}_${Math?.random().toString(36).substr(2, 9)}`
    };
    
    this.notificationHistory.unshift(logEntry);
    
    // Keep only last 100 notifications
    if (this.notificationHistory.length > 100) {
      this.notificationHistory = this.notificationHistory.slice(0, 100);
    }
    
    // Store in localStorage for persistence
    try {
      localStorage?.setItem('notificationHistory', JSON?.stringify(this.notificationHistory));
    } catch (error) {
      console?.error('Error saving notification history:', error);
    }
    
    return logEntry;
  }

  /**
   * Send Payment Reminder Notification
   */
  async sendPaymentReminder({ 
    invoiceId, 
    studentName, 
    parentEmail, 
    parentPhone, 
    amount, 
    dueDate, 
    invoiceItems = [], 
    schoolName = 'Your School' 
  }) {
    const settings = this.getNotificationSettings();
    const results = { email: null, sms: null, push: null };
    
    try {
      // Email Notification
      if (settings?.emailEnabled && settings?.paymentReminders) {
        await this.delay(this.mockDelay);
        
        const emailResult = await this.sendEmail({
          to: parentEmail,
          subject: `Payment Reminder - Invoice #${invoiceId}`,
          template: 'payment_reminder',
          data: {
            studentName,
            invoiceId,
            amount,
            dueDate: format(new Date(dueDate), 'MMMM dd, yyyy'),
            schoolName,
            invoiceItems,
            paymentLink: `${window?.location?.origin}/payments/invoice/${invoiceId}`
          }
        });
        
        results.email = emailResult;
      }

      // SMS Notification
      if (settings?.smsEnabled && settings?.smsPaymentReminders && parentPhone) {
        await this.delay(500);
        
        const smsResult = await this.sendSMS({
          to: parentPhone,
          message: `Payment Reminder: ${studentName}'s fees (Invoice #${invoiceId}) of ₦${amount?.toLocaleString()} is due ${format(new Date(dueDate), 'MMM dd')}. Pay at ${window?.location?.origin}/pay/${invoiceId}`
        });
        
        results.sms = smsResult;
      }

      // Push Notification
      if (settings?.pushEnabled && settings?.pushPaymentReminders) {
        await this.delay(200);
        
        const pushResult = await this.sendPushNotification({
          title: 'Payment Reminder',
          body: `${studentName}'s school fees are due on ${format(new Date(dueDate), 'MMM dd, yyyy')}`,
          data: { invoiceId, type: 'payment_reminder' }
        });
        
        results.push = pushResult;
      }

      // Log notification
      this.logNotification({
        type: 'payment_reminder',
        invoiceId,
        studentName,
        recipient: parentEmail,
        amount,
        dueDate,
        channels: Object?.keys(results)?.filter(key => results[key]?.success),
        status: 'sent'
      });

      return {
        success: true,
        message: 'Payment reminder sent successfully',
        results,
        channels: Object?.keys(results)?.filter(key => results[key]?.success)
      };

    } catch (error) {
      console?.error('Payment reminder failed:', error);
      
      this.logNotification({
        type: 'payment_reminder',
        invoiceId,
        studentName,
        recipient: parentEmail,
        error: error?.message,
        status: 'failed'
      });

      return {
        success: false,
        error: error?.message,
        results
      };
    }
  }

  /**
   * Send Payment Confirmation Notification
   */
  async sendPaymentConfirmation({ 
    invoiceId, 
    transactionId, 
    studentName, 
    parentEmail, 
    parentPhone, 
    amount, 
    paymentDate = new Date(), 
    paymentMethod = 'Bank Transfer',
    schoolName = 'Your School' 
  }) {
    const settings = this.getNotificationSettings();
    const results = { email: null, sms: null, push: null };
    
    try {
      // Email Notification
      if (settings?.emailEnabled && settings?.paymentConfirmations) {
        await this.delay(this.mockDelay);
        
        const emailResult = await this.sendEmail({
          to: parentEmail,
          subject: `Payment Confirmation - Invoice #${invoiceId}`,
          template: 'payment_confirmation',
          data: {
            studentName,
            invoiceId,
            transactionId,
            amount,
            paymentDate: format(new Date(paymentDate), 'MMMM dd, yyyy - hh:mm a'),
            paymentMethod,
            schoolName,
            receiptLink: `${window?.location?.origin}/receipts/${transactionId}`
          }
        });
        
        results.email = emailResult;
      }

      // SMS Notification
      if (settings?.smsEnabled && settings?.smsPaymentConfirmations && parentPhone) {
        await this.delay(500);
        
        const smsResult = await this.sendSMS({
          to: parentPhone,
          message: `Payment Confirmed: ₦${amount?.toLocaleString()} received for ${studentName} (Invoice #${invoiceId}). Transaction ID: ${transactionId}. Receipt: ${window?.location?.origin}/receipt/${transactionId}`
        });
        
        results.sms = smsResult;
      }

      // Push Notification
      if (settings?.pushEnabled && settings?.pushPaymentConfirmations) {
        await this.delay(200);
        
        const pushResult = await this.sendPushNotification({
          title: 'Payment Confirmed',
          body: `Payment of ₦${amount?.toLocaleString()} for ${studentName} has been confirmed`,
          data: { invoiceId, transactionId, type: 'payment_confirmation' }
        });
        
        results.push = pushResult;
      }

      // Log notification
      this.logNotification({
        type: 'payment_confirmation',
        invoiceId,
        transactionId,
        studentName,
        recipient: parentEmail,
        amount,
        paymentDate,
        channels: Object?.keys(results)?.filter(key => results[key]?.success),
        status: 'sent'
      });

      return {
        success: true,
        message: 'Payment confirmation sent successfully',
        results,
        channels: Object?.keys(results)?.filter(key => results[key]?.success)
      };

    } catch (error) {
      console?.error('Payment confirmation failed:', error);
      
      this.logNotification({
        type: 'payment_confirmation',
        invoiceId,
        transactionId,
        studentName,
        recipient: parentEmail,
        error: error?.message,
        status: 'failed'
      });

      return {
        success: false,
        error: error?.message,
        results
      };
    }
  }

  /**
   * Send Overdue Notice Notification
   */
  async sendOverdueNotice({ 
    invoiceId, 
    studentName, 
    parentEmail, 
    parentPhone, 
    amount, 
    dueDate, 
    daysOverdue, 
    totalOwed,
    schoolName = 'Your School' 
  }) {
    const settings = this.getNotificationSettings();
    const results = { email: null, sms: null, push: null };
    
    try {
      // Email Notification
      if (settings?.emailEnabled && settings?.overdueNotices) {
        await this.delay(this.mockDelay);
        
        const emailResult = await this.sendEmail({
          to: parentEmail,
          subject: `Overdue Payment Notice - Invoice #${invoiceId}`,
          template: 'overdue_notice',
          data: {
            studentName,
            invoiceId,
            amount,
            dueDate: format(new Date(dueDate), 'MMMM dd, yyyy'),
            daysOverdue,
            totalOwed,
            schoolName,
            paymentLink: `${window?.location?.origin}/payments/invoice/${invoiceId}`,
            contactPhone: '+234 123 456 7890',
            contactEmail: 'finance@yourschool.edu'
          }
        });
        
        results.email = emailResult;
      }

      // SMS Notification
      if (settings?.smsEnabled && settings?.smsOverdueNotices && parentPhone) {
        await this.delay(500);
        
        const smsResult = await this.sendSMS({
          to: parentPhone,
          message: `OVERDUE: ${studentName}'s payment (Invoice #${invoiceId}) of ₦${amount?.toLocaleString()} was due ${daysOverdue} days ago. Please pay immediately: ${window?.location?.origin}/pay/${invoiceId}`
        });
        
        results.sms = smsResult;
      }

      // Push Notification (System Alerts)
      if (settings?.pushEnabled && settings?.pushSystemAlerts) {
        await this.delay(200);
        
        const pushResult = await this.sendPushNotification({
          title: 'Overdue Payment',
          body: `${studentName} has an overdue payment of ₦${amount?.toLocaleString()} (${daysOverdue} days overdue)`,
          data: { invoiceId, type: 'overdue_notice' }
        });
        
        results.push = pushResult;
      }

      // Log notification
      this.logNotification({
        type: 'overdue_notice',
        invoiceId,
        studentName,
        recipient: parentEmail,
        amount,
        dueDate,
        daysOverdue,
        channels: Object?.keys(results)?.filter(key => results[key]?.success),
        status: 'sent'
      });

      return {
        success: true,
        message: 'Overdue notice sent successfully',
        results,
        channels: Object?.keys(results)?.filter(key => results[key]?.success)
      };

    } catch (error) {
      console?.error('Overdue notice failed:', error);
      
      this.logNotification({
        type: 'overdue_notice',
        invoiceId,
        studentName,
        recipient: parentEmail,
        error: error?.message,
        status: 'failed'
      });

      return {
        success: false,
        error: error?.message,
        results
      };
    }
  }

  /**
   * Send Invoice Delivery Notification
   */
  async sendInvoiceDelivery({ 
    invoiceId, 
    studentName, 
    parentEmail, 
    parentPhone, 
    invoiceItems = [], 
    totalAmount, 
    dueDate,
    schoolName = 'Your School' 
  }) {
    const settings = this.getNotificationSettings();
    const results = { email: null, sms: null, push: null };
    
    try {
      // Email Notification (Always send invoice delivery via email if enabled)
      if (settings?.emailEnabled) {
        await this.delay(this.mockDelay);
        
        const emailResult = await this.sendEmail({
          to: parentEmail,
          subject: `New Invoice - ${studentName} - Invoice #${invoiceId}`,
          template: 'invoice_delivery',
          data: {
            studentName,
            invoiceId,
            invoiceItems,
            totalAmount,
            dueDate: format(new Date(dueDate), 'MMMM dd, yyyy'),
            schoolName,
            invoiceLink: `${window?.location?.origin}/invoices/${invoiceId}`,
            paymentLink: `${window?.location?.origin}/payments/invoice/${invoiceId}`
          }
        });
        
        results.email = emailResult;
      }

      // SMS Notification for invoice delivery
      if (settings?.smsEnabled && parentPhone) {
        await this.delay(500);
        
        const smsResult = await this.sendSMS({
          to: parentPhone,
          message: `New Invoice: ${studentName} - ₦${totalAmount?.toLocaleString()} due ${format(new Date(dueDate), 'MMM dd')}. View: ${window?.location?.origin}/invoice/${invoiceId}`
        });
        
        results.sms = smsResult;
      }

      // Push Notification
      if (settings?.pushEnabled && settings?.inAppNotifications) {
        await this.delay(200);
        
        const pushResult = await this.sendPushNotification({
          title: 'New Invoice Created',
          body: `Invoice #${invoiceId} for ${studentName} - ₦${totalAmount?.toLocaleString()}`,
          data: { invoiceId, type: 'invoice_delivery' }
        });
        
        results.push = pushResult;
      }

      // Log notification
      this.logNotification({
        type: 'invoice_delivery',
        invoiceId,
        studentName,
        recipient: parentEmail,
        totalAmount,
        dueDate,
        channels: Object?.keys(results)?.filter(key => results[key]?.success),
        status: 'sent'
      });

      return {
        success: true,
        message: 'Invoice delivered successfully',
        results,
        channels: Object?.keys(results)?.filter(key => results[key]?.success)
      };

    } catch (error) {
      console?.error('Invoice delivery failed:', error);
      
      this.logNotification({
        type: 'invoice_delivery',
        invoiceId,
        studentName,
        recipient: parentEmail,
        error: error?.message,
        status: 'failed'
      });

      return {
        success: false,
        error: error?.message,
        results
      };
    }
  }

  /**
   * Mock Email Sending
   */
  async sendEmail({ to, subject, template, data }) {
    await this.delay(this.mockDelay);
    
    // Simulate email sending
    const mockTemplates = {
      payment_reminder: `
        Dear Parent/Guardian,
        
        This is a friendly reminder that payment for ${data?.studentName}'s school fees is due.
        
        Invoice Details:
        - Invoice #: ${data?.invoiceId}
        - Student: ${data?.studentName}
        - Amount: ₦${data?.amount?.toLocaleString()}
        - Due Date: ${data?.dueDate}
        
        Please make your payment before the due date to avoid late fees.
        
        Pay online: ${data?.paymentLink}
        
        Best regards,
        ${data?.schoolName}
      `,
      payment_confirmation: `
        Dear Parent/Guardian,
        
        We have successfully received your payment for ${data?.studentName}'s school fees.
        
        Payment Details:
        - Invoice #: ${data?.invoiceId}
        - Transaction #: ${data?.transactionId}
        - Student: ${data?.studentName}
        - Amount: ₦${data?.amount?.toLocaleString()}
        - Payment Date: ${data?.paymentDate}
        - Payment Method: ${data?.paymentMethod}
        
        View Receipt: ${data?.receiptLink}
        
        Thank you for your prompt payment.
        
        Best regards,
        ${data?.schoolName}
      `,
      overdue_notice: `
        URGENT: Overdue Payment Notice
        
        Dear Parent/Guardian,
        
        This is to notify you that payment for ${data?.studentName}'s school fees is now overdue.
        
        Invoice Details:
        - Invoice #: ${data?.invoiceId}
        - Student: ${data?.studentName}
        - Amount: ₦${data?.amount?.toLocaleString()}
        - Due Date: ${data?.dueDate}
        - Days Overdue: ${data?.daysOverdue}
        
        Please make immediate payment to avoid additional charges.
        
        Pay now: ${data?.paymentLink}
        
        For assistance, contact us at ${data?.contactPhone} or ${data?.contactEmail}
        
        ${data?.schoolName}
      `,
      invoice_delivery: `
        Dear Parent/Guardian,
        
        A new invoice has been generated for ${data?.studentName}.
        
        Invoice Details:
        - Invoice #: ${data?.invoiceId}
        - Student: ${data?.studentName}
        - Total Amount: ₦${data?.totalAmount?.toLocaleString()}
        - Due Date: ${data?.dueDate}
        
        Items:
        ${data?.invoiceItems?.map(item => `- ${item?.description}: ₦${item?.amount?.toLocaleString()}`).join('\n')}
        
        View Invoice: ${data?.invoiceLink}
        Pay Online: ${data?.paymentLink}
        
        Best regards,
        ${data?.schoolName}
      `
    };

    const emailContent = mockTemplates[template] || `Subject: ${subject}\n\nEmail content for ${template} template`;
    
    // Simulate success/failure (95% success rate)
    const success = Math?.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        messageId: `email_${Date.now()}_${Math?.random().toString(36).substr(2, 9)}`,
        to,
        subject,
        content: emailContent,
        sentAt: new Date().toISOString()
      };
    } else {
      throw new Error('Mock email delivery failed');
    }
  }

  /**
   * Mock SMS Sending
   */
  async sendSMS({ to, message }) {
    await this.delay(800);
    
    // Simulate SMS sending with 90% success rate
    const success = Math?.random() > 0.1;
    
    if (success) {
      return {
        success: true,
        messageId: `sms_${Date.now()}_${Math?.random().toString(36).substr(2, 9)}`,
        to,
        message,
        sentAt: new Date().toISOString()
      };
    } else {
      throw new Error('Mock SMS delivery failed');
    }
  }

  /**
   * Mock Push Notification
   */
  async sendPushNotification({ title, body, data = {} }) {
    await this.delay(300);
    
    // Check if browser supports notifications
    if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: data?.type || 'school-notification'
      });
      
      notification.onclick = () => {
        window?.focus();
        notification?.close();
        
        // Handle notification click based on type
        if (data?.invoiceId && data?.type === 'payment_reminder') {
          window.location.href = `/invoices-management?highlight=${data?.invoiceId}`;
        } else if (data?.transactionId && data?.type === 'payment_confirmation') {
          window.location.href = `/payments-management?highlight=${data?.transactionId}`;
        }
      };
      
      // Auto-close after 5 seconds
      setTimeout(() => notification?.close(), 5000);
    }
    
    // Simulate push notification with 98% success rate
    const success = Math?.random() > 0.02;
    
    if (success) {
      return {
        success: true,
        notificationId: `push_${Date.now()}_${Math?.random().toString(36).substr(2, 9)}`,
        title,
        body,
        data,
        sentAt: new Date().toISOString()
      };
    } else {
      throw new Error('Mock push notification failed');
    }
  }

  /**
   * Get notification history
   */
  getNotificationHistory(limit = 50, type = null) {
    try {
      const saved = localStorage?.getItem('notificationHistory');
      let history = saved ? JSON?.parse(saved) : [];
      
      if (type) {
        history = history?.filter(notif => notif?.type === type);
      }
      
      return history?.slice(0, limit);
    } catch (error) {
      console?.error('Error loading notification history:', error);
      return [];
    }
  }

  /**
   * Clear notification history
   */
  clearNotificationHistory() {
    this.notificationHistory = [];
    try {
      localStorage?.removeItem('notificationHistory');
      return true;
    } catch (error) {
      console?.error('Error clearing notification history:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   */
  async requestNotificationPermission() {
    if (typeof Notification === 'undefined') {
      return { success: false, error: 'Notifications not supported' };
    }

    if (Notification?.permission === 'granted') {
      return { success: true, permission: 'granted' };
    }

    if (Notification?.permission !== 'denied') {
      const permission = await Notification?.requestPermission();
      return { 
        success: permission === 'granted', 
        permission 
      };
    }

    return { 
      success: false, 
      error: 'Notification permission denied',
      permission: Notification?.permission 
    };
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Bulk send notifications (for batch operations)
   */
  async sendBulkNotifications(notifications = []) {
    const results = [];
    const batchSize = 5; // Process 5 notifications at a time
    
    for (let i = 0; i < notifications?.length; i += batchSize) {
      const batch = notifications?.slice(i, i + batchSize);
      const batchPromises = batch?.map(async (notif) => {
        try {
          switch (notif?.type) {
            case 'payment_reminder':
              return await this.sendPaymentReminder(notif?.data);
            case 'payment_confirmation':
              return await this.sendPaymentConfirmation(notif?.data);
            case 'overdue_notice':
              return await this.sendOverdueNotice(notif?.data);
            case 'invoice_delivery':
              return await this.sendInvoiceDelivery(notif?.data);
            default:
              throw new Error(`Unknown notification type: ${notif?.type}`);
          }
        } catch (error) {
          return { success: false, error: error?.message, data: notif?.data };
        }
      });
      
      const batchResults = await Promise?.allSettled(batchPromises);
      results?.push(...batchResults?.map(result => 
        result?.status === 'fulfilled' ? result?.value : result?.reason
      ));
      
      // Add delay between batches to avoid overwhelming the system
      if (i + batchSize < notifications?.length) {
        await this.delay(1000);
      }
    }
    
    return results;
  }
}

// Create and export singleton instance
const notificationService = new NotificationService();

export default notificationService;