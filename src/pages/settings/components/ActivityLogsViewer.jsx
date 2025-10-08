import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityLogsViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7_days');

  // Mock activity logs data
  const mockLogs = [
    {
      id: 1,
      user: {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@school.edu',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'Super Admin'
      },
      action: 'user_created',
      actionLabel: 'User Created',
      description: 'Created user account for Emily Rodriguez',
      details: {
        targetUser: 'Emily Rodriguez',
        targetEmail: 'emily.rodriguez@school.edu',
        assignedRole: 'Bursar'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2025-01-04T09:30:15Z'
    },
    {
      id: 2,
      user: {
        name: 'Michael Johnson',
        email: 'michael.johnson@school.edu',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'Finance Manager'
      },
      action: 'invoice_created',
      actionLabel: 'Invoice Created',
      description: 'Created bulk invoices for Grade 10 students',
      details: {
        invoiceCount: 45,
        totalAmount: '₦2,250,000',
        grade: 'Grade 10',
        term: 'Second Term'
      },
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      timestamp: '2025-01-04T08:45:30Z'
    },
    {
      id: 3,
      user: {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@school.edu',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'Bursar'
      },
      action: 'payment_recorded',
      actionLabel: 'Payment Recorded',
      description: 'Recorded payment for student John Doe',
      details: {
        studentName: 'John Doe',
        studentId: 'STU-2024-001',
        amount: '₦50,000',
        method: 'Bank Transfer'
      },
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2025-01-04T07:20:45Z'
    },
    {
      id: 4,
      user: {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@school.edu',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'Super Admin'
      },
      action: 'password_reset',
      actionLabel: 'Password Reset',
      description: 'Reset password for user David Thompson',
      details: {
        targetUser: 'David Thompson',
        targetEmail: 'david.thompson@school.edu',
        method: 'Email Reset Link'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2025-01-03T16:15:20Z'
    },
    {
      id: 5,
      user: {
        name: 'Michael Johnson',
        email: 'michael.johnson@school.edu',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'Finance Manager'
      },
      action: 'payment_structure_updated',
      actionLabel: 'Payment Structure Updated',
      description: 'Updated fee structure for Grade 11',
      details: {
        grade: 'Grade 11',
        changes: ['Tuition Fee: ₦45,000 → ₦50,000', 'Development Levy: Added ₦5,000']
      },
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      timestamp: '2025-01-03T14:30:10Z'
    },
    {
      id: 6,
      user: {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@school.edu',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'Super Admin'
      },
      action: 'user_deactivated',
      actionLabel: 'User Deactivated',
      description: 'Deactivated user account for David Thompson',
      details: {
        targetUser: 'David Thompson',
        targetEmail: 'david.thompson@school.edu',
        reason: 'Administrative request'
      },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2025-01-03T11:45:55Z'
    },
    {
      id: 7,
      user: {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@school.edu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        role: 'Bursar'
      },
      action: 'receipt_issued',
      actionLabel: 'Receipt Issued',
      description: 'Issued payment receipt for Mary Johnson',
      details: {
        studentName: 'Mary Johnson',
        studentId: 'STU-2024-002',
        receiptNumber: 'RCT-2025-0001',
        amount: '₦75,000'
      },
      ipAddress: '192.168.1.115',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2025-01-02T15:20:30Z'
    }
  ];

  const actionOptions = [
    { value: 'all', label: 'All Actions' },
    { value: 'user_created', label: 'User Created' },
    { value: 'user_updated', label: 'User Updated' },
    { value: 'user_deactivated', label: 'User Deactivated' },
    { value: 'password_reset', label: 'Password Reset' },
    { value: 'invoice_created', label: 'Invoice Created' },
    { value: 'payment_recorded', label: 'Payment Recorded' },
    { value: 'receipt_issued', label: 'Receipt Issued' },
    { value: 'payment_structure_updated', label: 'Payment Structure Updated' }
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'sarah.mitchell@school.edu', label: 'Sarah Mitchell' },
    { value: 'michael.johnson@school.edu', label: 'Michael Johnson' },
    { value: 'emily.rodriguez@school.edu', label: 'Emily Rodriguez' },
    { value: 'lisa.anderson@school.edu', label: 'Lisa Anderson' }
  ];

  const dateRangeOptions = [
    { value: '1_day', label: 'Last 24 hours' },
    { value: '7_days', label: 'Last 7 days' },
    { value: '30_days', label: 'Last 30 days' },
    { value: '90_days', label: 'Last 90 days' }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = [...logs];

    // Search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase()?.trim();
      filtered = filtered?.filter(log => 
        log?.user?.name?.toLowerCase()?.includes(query) ||
        log?.actionLabel?.toLowerCase()?.includes(query) ||
        log?.description?.toLowerCase()?.includes(query)
      );
    }

    // Action filter
    if (actionFilter && actionFilter !== 'all') {
      filtered = filtered?.filter(log => log?.action === actionFilter);
    }

    // User filter
    if (userFilter && userFilter !== 'all') {
      filtered = filtered?.filter(log => log?.user?.email === userFilter);
    }

    // Date range filter
    const now = new Date();
    const filterDate = new Date();
    switch (dateRange) {
      case '1_day':
        filterDate?.setDate(now?.getDate() - 1);
        break;
      case '7_days':
        filterDate?.setDate(now?.getDate() - 7);
        break;
      case '30_days':
        filterDate?.setDate(now?.getDate() - 30);
        break;
      case '90_days':
        filterDate?.setDate(now?.getDate() - 90);
        break;
    }
    
    filtered = filtered?.filter(log => new Date(log?.timestamp) >= filterDate);

    setFilteredLogs(filtered);
  }, [logs, searchQuery, actionFilter, userFilter, dateRange]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math?.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math?.floor(diffInMinutes / 60)}h ago`;
    
    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'user_created': return 'UserPlus';
      case 'user_updated': return 'UserCog';
      case 'user_deactivated': return 'UserX';
      case 'password_reset': return 'Key';
      case 'invoice_created': return 'FileText';
      case 'payment_recorded': return 'CreditCard';
      case 'receipt_issued': return 'Receipt';
      case 'payment_structure_updated': return 'Settings';
      default: return 'Activity';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'user_created': return 'text-green-600 bg-green-100';
      case 'user_updated': return 'text-blue-600 bg-blue-100';
      case 'user_deactivated': return 'text-red-600 bg-red-100';
      case 'password_reset': return 'text-orange-600 bg-orange-100';
      case 'invoice_created': return 'text-purple-600 bg-purple-100';
      case 'payment_recorded': return 'text-green-600 bg-green-100';
      case 'receipt_issued': return 'text-blue-600 bg-blue-100';
      case 'payment_structure_updated': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportLogs = () => {
    // In a real implementation, this would generate and download a CSV or PDF
    const csvContent = filteredLogs?.map(log => 
      [
        log?.timestamp,
        log?.user?.name,
        log?.user?.role,
        log?.actionLabel,
        log?.description,
        log?.ipAddress
      ]?.join(',')
    )?.join('\n');
    
    const header = 'Timestamp,User,Role,Action,Description,IP Address\n';
    const csv = header + csvContent;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window?.URL?.createObjectURL(blob);
    const link = document?.createElement('a');
    link.href = url;
    link.download = `activity-logs-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    link?.click();
    window?.URL?.revokeObjectURL(url);
  };

  if (loading && logs?.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Activity Logs</h3>
          <p className="text-sm text-muted-foreground">
            Track all user activities and system changes with timestamps
          </p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Icon name="Download" size={16} className="mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          icon={<Icon name="Search" size={16} />}
        />
        
        <Select
          options={actionOptions}
          value={actionFilter}
          onChange={(value) => setActionFilter(value)}
          placeholder="Filter by action"
        />
        
        <Select
          options={userOptions}
          value={userFilter}
          onChange={(value) => setUserFilter(value)}
          placeholder="Filter by user"
        />
        
        <Select
          options={dateRangeOptions}
          value={dateRange}
          onChange={(value) => setDateRange(value)}
          placeholder="Date range"
        />
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLogs?.length} of {logs?.length} activities
        </p>
        {(searchQuery || actionFilter !== 'all' || userFilter !== 'all' || dateRange !== '7_days') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setActionFilter('all');
              setUserFilter('all');
              setDateRange('7_days');
            }}
          >
            <Icon name="X" size={14} className="mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {filteredLogs?.length > 0 ? (
          filteredLogs?.map((log) => (
            <div key={log?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Action Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(log?.action)}`}>
                  <Icon name={getActionIcon(log?.action)} size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          <Image 
                            src={log?.user?.avatar}
                            alt={log?.user?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {log?.user?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log?.user?.role}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(log?.action)}`}>
                          {log?.actionLabel}
                        </span>
                      </div>

                      {/* Action Description */}
                      <p className="text-sm text-foreground mb-2">
                        {log?.description}
                      </p>

                      {/* Details */}
                      {log?.details && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-2">
                          <div className="text-xs space-y-1">
                            {Object?.entries(log?.details)?.map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <span className="font-medium text-muted-foreground capitalize">
                                  {key?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str?.toUpperCase())}:
                                </span>
                                <span className="text-foreground">
                                  {Array?.isArray(value) ? value?.join(', ') : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>{formatTimestamp(log?.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={12} />
                          <span>{log?.ipAddress}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-muted-foreground">
                      {new Date(log?.timestamp)?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Icon name="Activity" size={32} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-sm font-medium text-foreground mb-2">No activities found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || actionFilter !== 'all' || userFilter !== 'all' ?'Try adjusting your filters to see more results' :'No user activities have been recorded yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsViewer;