import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import Select from '../../../components/ui/Select';
import { Plus, Users, AlertCircle, CheckCircle, Clock, FileText, Filter, Eye } from 'lucide-react';
import { specialInvoiceService } from '../../../services/specialInvoiceService';
import { SERVICE_TYPE_LABELS, INVOICE_SCOPE_LABELS } from '../../../constants/specialInvoice';
import SpecialInvoiceCreationModal from './SpecialInvoiceCreationModal';
import SpecialInvoiceReportModal from './SpecialInvoiceReportModal';
import ExportDropdown from '../../../components/ui/ExportDropdown';
import exportService from '../../../services/exportService';


const SpecialInvoiceTab = () => {
  const [specialInvoices, setSpecialInvoices] = useState([]);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [serviceConfigurations, setServiceConfigurations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    serviceType: '',
    status: '',
    term: '',
    dateRange: '',
    search: ''
  });

  useEffect(() => {
    loadSpecialInvoicesData();
  }, [filters]);

  const loadSpecialInvoicesData = async () => {
    setIsLoading(true);
    try {
      const [invoices, history, configs] = await Promise.all([
        specialInvoiceService?.getSpecialInvoices(filters),
        specialInvoiceService?.getSpecialInvoiceGenerations({ limit: 10 }),
        specialInvoiceService?.getServiceConfigurations()
      ]);

      setSpecialInvoices(invoices);
      setGenerationHistory(history);
      setServiceConfigurations(configs);
    } catch (error) {
      console.error('Error loading special invoices data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCreateSpecialInvoice = () => {
    setShowCreationModal(true);
  };

  const handleInvoiceCreated = () => {
    setShowCreationModal(false);
    loadSpecialInvoicesData();
  };

  const handleViewReport = (generation) => {
    setSelectedGeneration(generation);
    setShowReportModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-success" />;
      case 'overdue':
        return <AlertCircle size={16} className="text-error" />;
      default:
        return <Clock size={16} className="text-warning" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'overdue':
        return 'bg-error/10 text-error border-error/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate summary statistics
  const summary = {
    totalInvoices: specialInvoices?.length || 0,
    totalAmount: specialInvoices?.reduce((sum, inv) => sum + (inv?.amount || 0), 0) || 0,
    paidCount: specialInvoices?.filter(inv => inv?.status === 'paid')?.length || 0,
    pendingCount: specialInvoices?.filter(inv => inv?.status === 'pending')?.length || 0,
    overdueCount: specialInvoices?.filter(inv => inv?.status === 'overdue')?.length || 0
  };

  const handleExport = async (format) => {
    try {
      const result = await exportService?.exportSpecialInvoices(specialInvoices, format, {
        filename: 'Special_Invoices',
        includeTimestamp: true
      });

      if (result?.success) {
        // Show success notification
        if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
          new Notification('Export Complete', {
            body: `Successfully exported ${result?.recordCount} special invoices as ${format?.toUpperCase()}`,
            icon: '/favicon.ico'
          });
        }
        console.log('Special invoices export completed:', result);
      } else {
        console.error('Special invoices export failed:', result?.error);
        alert(`Export failed: ${result?.error}`);
      }
    } catch (error) {
      console.error('Special invoices export error:', error);
      alert(`Export error: ${error?.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Special Invoices</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage bulk invoices for optional services like Transportation, Hostel, Excursions, etc.
          </p>
        </div>
        <Button
          onClick={handleCreateSpecialInvoice}
          iconName="Plus"
          iconPosition="left"
        >
          Create Special Invoice
        </Button>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileText size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Total Invoices</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{summary?.totalInvoices}</div>
          <div className="text-xs text-muted-foreground">{formatCurrency(summary?.totalAmount)}</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Paid</span>
          </div>
          <div className="text-2xl font-bold text-success">{summary?.paidCount}</div>
          <div className="text-xs text-muted-foreground">
            {summary?.totalInvoices > 0 ? Math.round((summary?.paidCount / summary?.totalInvoices) * 100) : 0}% completion
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Pending</span>
          </div>
          <div className="text-2xl font-bold text-warning">{summary?.pendingCount}</div>
          <div className="text-xs text-muted-foreground">Awaiting payment</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle size={16} className="text-error" />
            <span className="text-sm font-medium text-foreground">Overdue</span>
          </div>
          <div className="text-2xl font-bold text-error">{summary?.overdueCount}</div>
          <div className="text-xs text-muted-foreground">Requires attention</div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={16} className="text-muted-foreground" />
          <span className="font-medium text-foreground">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            placeholder="Service Type"
            value={filters?.serviceType}
            onChange={(value) => handleFilterChange('serviceType', value)}
            options={serviceConfigurations?.map(config => ({
              value: config?.service_type,
              label: config?.name
            }))}
          />
          
          <Select
            placeholder="Status"
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
          />
          
          <Input
            placeholder="Term (e.g., 2024/2025 First)"
            value={filters?.term}
            onChange={(e) => handleFilterChange('term', e?.target?.value)}
          />
          
          <Select
            placeholder="Date Range"
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' }
            ]}
          />
          
          <Input
            placeholder="Search invoices..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
          />
        </div>
      </div>
      {/* Recent Generation History */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Recent Special Invoice Generations</h3>
            <Button variant="outline" size="sm" iconName="Eye">
              View All
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          {generationHistory?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No special invoice generations yet</p>
              <p className="text-sm">Create your first special invoice to see history here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {generationHistory?.slice(0, 5)?.map((generation) => (
                <div
                  key={generation?.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">
                        {SERVICE_TYPE_LABELS?.[generation?.service_type] || generation?.service_type}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {INVOICE_SCOPE_LABELS?.[generation?.scope] || generation?.scope}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {generation?.total_students_affected} students • {formatCurrency(generation?.total_amount)}
                      {generation?.target_class?.name && ` • ${generation?.target_class?.name}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(generation?.created_at)} by {generation?.created_by_profile?.full_name}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReport(generation)}
                    iconName="Eye"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Special Invoices Table */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Special Invoices</h3>
            <div className="flex items-center space-x-2">
              <ExportDropdown
                onExport={handleExport}
                recordCount={specialInvoices?.length}
                exportTitle="Export"
                variant="outline"
                size="sm"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading special invoices...</p>
            </div>
          ) : specialInvoices?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No special invoices found</p>
              <p className="text-sm">Create special invoices for optional services</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-3 font-medium text-foreground">Invoice</th>
                  <th className="text-left p-3 font-medium text-foreground">Student</th>
                  <th className="text-left p-3 font-medium text-foreground">Service</th>
                  <th className="text-left p-3 font-medium text-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-foreground">Due Date</th>
                  <th className="text-left p-3 font-medium text-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {specialInvoices?.map((invoice) => (
                  <tr key={invoice?.id} className="border-b border-border">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-foreground">{invoice?.invoice_number}</div>
                        <div className="text-xs text-muted-foreground">{invoice?.term}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-foreground">
                          {invoice?.student?.first_name} {invoice?.student?.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {invoice?.student?.student_id} • {invoice?.student?.class?.name}
                          {invoice?.student?.subclass?.name && ` ${invoice?.student?.subclass?.name}`}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-medium text-foreground">
                        {SERVICE_TYPE_LABELS?.[invoice?.service_type] || invoice?.service_type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-foreground">
                        {formatCurrency(invoice?.amount)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-foreground">{formatDate(invoice?.due_date)}</div>
                      {invoice?.payment_date && (
                        <div className="text-xs text-success">
                          Paid: {formatDate(invoice?.payment_date)}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(invoice?.status)}`}
                      >
                        {getStatusIcon(invoice?.status)}
                        <span className="capitalize">{invoice?.status}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Eye"
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Modals */}
      {showCreationModal && (
        <SpecialInvoiceCreationModal
          isOpen={showCreationModal}
          onClose={() => setShowCreationModal(false)}
          onInvoiceCreated={handleInvoiceCreated}
          serviceConfigurations={serviceConfigurations}
        />
      )}
      {showReportModal && selectedGeneration && (
        <SpecialInvoiceReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          generation={selectedGeneration}
        />
      )}
    </div>
  );
};

export default SpecialInvoiceTab;