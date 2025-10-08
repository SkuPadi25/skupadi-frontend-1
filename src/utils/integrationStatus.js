// Integration Status Tracking Utilities
// Provides utilities for tracking and managing integration status between payment structures and invoice creation

export const integrationStatusUtils = {
  // Integration status constants
  STATUS_TYPES: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    ERROR: 'error',
    SYNCING: 'syncing'
  },

  // Integration status colors for UI
  STATUS_COLORS: {
    active: 'success',
    inactive: 'muted',
    pending: 'warning',
    error: 'error',
    syncing: 'info'
  },

  // Integration status labels
  STATUS_LABELS: {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    error: 'Error',
    syncing: 'Syncing'
  },

  // Get status badge configuration
  getStatusBadgeConfig(status) {
    return {
      label: this.STATUS_LABELS?.[status] || 'Unknown',
      color: this.STATUS_COLORS?.[status] || 'muted',
      status
    };
  },

  // Calculate integration health score
  calculateIntegrationHealth(paymentStructures, integrationStatus) {
    if (!paymentStructures || !integrationStatus) return 0;
    
    let totalClasses = 0;
    let healthyClasses = 0;
    
    Object.entries(paymentStructures)?.forEach(([classId, structures]) => {
      totalClasses++;
      const classStatus = integrationStatus?.[classId];
      
      if (classStatus?.isConfigured && classStatus?.activeFees > 0) {
        healthyClasses++;
      }
    });
    
    return totalClasses === 0 ? 0 : Math.round((healthyClasses / totalClasses) * 100);
  },

  // Get integration summary statistics
  getIntegrationSummary(paymentStructures, integrationStatus) {
    let totalFees = 0;
    let activeFees = 0;
    let configuredClasses = 0;
    let totalPendingInvoices = 0;
    let lastUpdated = null;
    
    Object.entries(paymentStructures || {})?.forEach(([classId, structures]) => {
      const classStatus = integrationStatus?.[classId];
      
      if (classStatus?.isConfigured) {
        configuredClasses++;
      }
      
      structures?.forEach(structure => {
        totalFees++;
        if (structure?.integrationStatus === this.STATUS_TYPES?.ACTIVE) {
          activeFees++;
        }
        totalPendingInvoices += structure?.pendingInvoices || 0;
      });
      
      if (classStatus?.lastUpdated) {
        const updatedDate = new Date(classStatus.lastUpdated);
        if (!lastUpdated || updatedDate > lastUpdated) {
          lastUpdated = updatedDate;
        }
      }
    });
    
    const healthScore = this.calculateIntegrationHealth(paymentStructures, integrationStatus);
    
    return {
      totalFees,
      activeFees,
      inactiveFees: totalFees - activeFees,
      configuredClasses,
      totalClasses: Object.keys(paymentStructures || {})?.length,
      totalPendingInvoices,
      healthScore,
      lastUpdated: lastUpdated?.toISOString() || null,
      integrationRate: totalFees === 0 ? 0 : Math.round((activeFees / totalFees) * 100)
    };
  },

  // Track fee usage in invoices
  trackFeeUsage(feeId, classId, invoiceId, amount) {
    const usageData = {
      feeId,
      classId,
      invoiceId,
      amount,
      timestamp: new Date()?.toISOString(),
      type: 'invoice_creation'
    };
    
    // In real implementation, this would send to analytics service
    console.log('Fee usage tracked:', usageData);
    
    return usageData;
  },

  // Update integration status after invoice creation
  updateIntegrationStatusAfterInvoice(paymentStructureContext, lineItems) {
    if (!paymentStructureContext || !lineItems?.length) return;
    
    const updatedStatus = {};
    
    lineItems?.forEach(item => {
      if (item?.feeType?.startsWith('payment_structure_')) {
        const structureId = parseInt(item?.feeType?.replace('payment_structure_', ''));
        const classId = item?.classId;
        
        if (classId) {
          // Update pending invoices count (would be real API call)
          paymentStructureContext?.updatePaymentStructure(classId, structureId, {
            pendingInvoices: (item?.pendingInvoices || 0) + 1,
            lastUsed: new Date()?.toISOString()
          });
          
          // Track in local status
          updatedStatus[classId] = {
            lastInvoiceCreated: new Date()?.toISOString(),
            invoiceCount: (updatedStatus?.[classId]?.invoiceCount || 0) + 1
          };
        }
      }
    });
    
    return updatedStatus;
  },

  // Generate integration warnings
  generateIntegrationWarnings(paymentStructures, integrationStatus) {
    const warnings = [];
    
    Object.entries(paymentStructures || {})?.forEach(([classId, structures]) => {
      const classStatus = integrationStatus?.[classId];
      const className = this.getClassNameFromId(classId);
      
      // Check for unconfigured classes
      if (!classStatus?.isConfigured) {
        warnings?.push({
          type: 'warning',
          message: `${className} has no configured payment structures`,
          classId,
          action: 'configure_payment_structure'
        });
      }
      
      // Check for inactive fees
      const inactiveFees = structures?.filter(fee => fee?.integrationStatus !== 'active')?.length || 0;
      if (inactiveFees > 0) {
        warnings?.push({
          type: 'info',
          message: `${className} has ${inactiveFees} inactive fee${inactiveFees > 1 ? 's' : ''}`,
          classId,
          action: 'review_fee_status'
        });
      }
      
      // Check for stale data
      if (classStatus?.lastUpdated) {
        const daysSinceUpdate = Math.floor((Date.now() - new Date(classStatus.lastUpdated)?.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceUpdate > 30) {
          warnings?.push({
            type: 'warning',
            message: `${className} payment structures haven't been updated in ${daysSinceUpdate} days`,
            classId,
            action: 'review_and_update'
          });
        }
      }
    });
    
    return warnings;
  },

  // Sync payment structures with invoice system
  async syncPaymentStructures(paymentStructureContext) {
    // This would be a real API call to sync data
    console.log('Syncing payment structures with invoice system...');
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update sync timestamp
      const syncTimestamp = new Date()?.toISOString();
      
      // In real implementation, update all relevant structures
      console.log('Payment structures synced successfully at:', syncTimestamp);
      
      return {
        success: true,
        syncedAt: syncTimestamp,
        message: 'Payment structures synchronized successfully'
      };
      
    } catch (error) {
      console.error('Error syncing payment structures:', error);
      return {
        success: false,
        error: error?.message,
        message: 'Failed to sync payment structures'
      };
    }
  },

  // Helper function to get class name from ID
  getClassNameFromId(classId) {
    const classMapping = {
      nursery_1: 'Nursery 1',
      nursery_2: 'Nursery 2',
      primary_1: 'Primary 1',
      primary_2: 'Primary 2',
      primary_3: 'Primary 3',
      primary_4: 'Primary 4',
      primary_5: 'Primary 5',
      primary_6: 'Primary 6',
      jss_1: 'JSS 1',
      jss_2: 'JSS 2',
      jss_3: 'JSS 3',
      ss_1: 'SS 1',
      ss_2: 'SS 2',
      ss_3: 'SS 3'
    };
    return classMapping?.[classId] || classId;
  },

  // Format status for display
  formatStatusDisplay(status, includeIcon = true) {
    const config = this.getStatusBadgeConfig(status);
    const iconMap = {
      active: '✅',
      inactive: '⭕',
      pending: '⏳',
      error: '❌',
      syncing: '🔄'
    };
    
    return includeIcon 
      ? `${iconMap?.[status] || '❔'} ${config?.label}`
      : config?.label;
  }
};

export default integrationStatusUtils;