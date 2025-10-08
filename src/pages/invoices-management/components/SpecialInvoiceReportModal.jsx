import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { X, Download, FileText, CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { specialInvoiceService } from '../../../services/specialInvoiceService';
import { SERVICE_TYPE_LABELS, INVOICE_SCOPE_LABELS } from '../../../constants/specialInvoice';

const SpecialInvoiceReportModal = ({ isOpen, onClose, generation }) => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedInvoices, setRelatedInvoices] = useState([]);

  useEffect(() => {
    if (isOpen && generation) {
      loadReportData();
    }
  }, [isOpen, generation]);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      // Load related invoices for this generation
      const invoices = await specialInvoiceService?.getSpecialInvoices({
        serviceType: generation?.service_type,
        term: generation?.term,
        dateRange: {
          startDate: generation?.created_at,
          endDate: new Date(new Date(generation?.created_at).getTime() + 24 * 60 * 60 * 1000)?.toISOString()
        }
      });

      setRelatedInvoices(invoices);
      
      // Calculate report statistics
      const reportStats = calculateReportStats(invoices);
      setReportData(reportStats);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateReportStats = (invoices) => {
    const total = invoices?.length || 0;
    const paid = invoices?.filter(inv => inv?.status === 'paid')?.length || 0;
    const pending = invoices?.filter(inv => inv?.status === 'pending')?.length || 0;
    const overdue = invoices?.filter(inv => inv?.status === 'overdue')?.length || 0;

    const totalAmount = invoices?.reduce((sum, inv) => sum + (inv?.amount || 0), 0) || 0;
    const paidAmount = invoices
      ?.filter(inv => inv?.status === 'paid')
      ?.reduce((sum, inv) => sum + (inv?.amount || 0), 0) || 0;

    return {
      total,
      paid,
      pending,
      overdue,
      totalAmount,
      paidAmount,
      pendingAmount: totalAmount - paidAmount,
      collectionRate: total > 0 ? (paid / total) * 100 : 0
    };
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportReport = () => {
    // Create CSV content
    const headers = ['Invoice Number', 'Student Name', 'Student ID', 'Class', 'Amount', 'Due Date', 'Status', 'Payment Date'];
    const csvContent = [
      headers?.join(','),
      ...relatedInvoices?.map(invoice => [
        invoice?.invoice_number,
        `"${invoice?.student?.first_name} ${invoice?.student?.last_name}"`,
        invoice?.student?.student_id,
        `"${invoice?.student?.class?.name} ${invoice?.student?.subclass?.name || ''}"`?.trim(),
        invoice?.amount,
        invoice?.due_date,
        invoice?.status,
        invoice?.payment_date || 'Not Paid'
      ]?.join(','))
    ]?.join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `special-invoice-report-${generation?.id}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  if (!isOpen || !generation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Special Invoice Generation Report
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {SERVICE_TYPE_LABELS?.[generation?.service_type]} • {generation?.term}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              iconName="Download"
              iconPosition="left"
            >
              Export CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading report data...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Generation Summary */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <FileText size={20} className="mr-2" />
                  Generation Summary
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Service Type</div>
                    <div className="font-medium text-foreground">
                      {SERVICE_TYPE_LABELS?.[generation?.service_type]}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Scope</div>
                    <div className="font-medium text-foreground">
                      {INVOICE_SCOPE_LABELS?.[generation?.scope]}
                      {generation?.target_class?.name && (
                        <div className="text-xs text-muted-foreground">
                          {generation?.target_class?.name}
                          {generation?.target_subclass?.name && ` - ${generation?.target_subclass?.name}`}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Created By</div>
                    <div className="font-medium text-foreground">
                      {generation?.created_by_profile?.full_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(generation?.created_at)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Due Date</div>
                    <div className="font-medium text-foreground">
                      {new Date(generation?.due_date)?.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {generation?.notes && (
                  <div className="mt-4 p-3 bg-card border border-border rounded">
                    <div className="text-sm text-muted-foreground mb-1">Notes</div>
                    <div className="text-sm text-foreground">{generation?.notes}</div>
                  </div>
                )}
              </div>

              {/* Statistics Cards */}
              {reportData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">Total Invoices</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{reportData?.total}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(reportData?.totalAmount)}
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle size={16} className="text-success" />
                      <span className="text-sm font-medium text-foreground">Paid</span>
                    </div>
                    <div className="text-2xl font-bold text-success">{reportData?.paid}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(reportData?.paidAmount)}
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock size={16} className="text-warning" />
                      <span className="text-sm font-medium text-foreground">Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-warning">{reportData?.pending}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(reportData?.pendingAmount)}
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 size={16} className="text-info" />
                      <span className="text-sm font-medium text-foreground">Collection Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-info">
                      {reportData?.collectionRate?.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {reportData?.paid} of {reportData?.total} collected
                    </div>
                  </div>
                </div>
              )}

              {/* Invoice Details Table */}
              <div className="bg-card border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-foreground">Generated Invoices</h3>
                </div>
                
                <div className="overflow-x-auto">
                  {relatedInvoices?.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No invoices found for this generation</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="text-left p-3 font-medium text-foreground">Invoice #</th>
                          <th className="text-left p-3 font-medium text-foreground">Student</th>
                          <th className="text-left p-3 font-medium text-foreground">Class</th>
                          <th className="text-left p-3 font-medium text-foreground">Amount</th>
                          <th className="text-left p-3 font-medium text-foreground">Status</th>
                          <th className="text-left p-3 font-medium text-foreground">Payment Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {relatedInvoices?.map((invoice) => (
                          <tr key={invoice?.id} className="border-b border-border">
                            <td className="p-3">
                              <div className="font-medium text-foreground text-sm">
                                {invoice?.invoice_number}
                              </div>
                            </td>
                            <td className="p-3">
                              <div>
                                <div className="font-medium text-foreground text-sm">
                                  {invoice?.student?.first_name} {invoice?.student?.last_name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {invoice?.student?.student_id}
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="text-sm text-foreground">
                                {invoice?.student?.class?.name}
                                {invoice?.student?.subclass?.name && (
                                  <div className="text-xs text-muted-foreground">
                                    {invoice?.student?.subclass?.name}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-medium text-foreground text-sm">
                                {formatCurrency(invoice?.amount)}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${
                                  invoice?.status === 'paid' ?'bg-success/10 text-success border-success/20'
                                    : invoice?.status === 'overdue' ?'bg-error/10 text-error border-error/20' :'bg-warning/10 text-warning border-warning/20'
                                }`}
                              >
                                {invoice?.status === 'paid' ? (
                                  <CheckCircle size={12} />
                                ) : invoice?.status === 'overdue' ? (
                                  <AlertCircle size={12} />
                                ) : (
                                  <Clock size={12} />
                                )}
                                <span className="capitalize">{invoice?.status}</span>
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="text-sm text-foreground">
                                {invoice?.payment_date
                                  ? new Date(invoice?.payment_date)?.toLocaleDateString()
                                  : '-'
                                }
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default SpecialInvoiceReportModal;