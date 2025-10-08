import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import receiptService from '../../../services/receiptService';

const PaymentTable = ({ filters, searchTerm, onViewPayment }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Enhanced mock payment data with partial payment examples
  const mockPayments = [
    {
      id: 'PAY-2025-001',
      studentName: 'Emma Johnson',
      invoiceId: 'INV-2025-001',
      amount: 500000.00,
      paymentDate: '2025-01-10',
      method: 'bank_transfer',
      status: 'completed',
      reference: 'BT-2025-001-XYZ123',
      paymentType: 'full'
    },
    {
      id: 'PAY-2025-002',
      studentName: 'Michael Chen',
      invoiceId: 'INV-2025-002',
      amount: 300000.00,
      paymentDate: '2025-01-12',
      method: 'card',
      status: 'completed',
      reference: 'CD-2025-002-ABC456',
      paymentType: 'full'
    },
    {
      id: 'PAY-2025-003',
      studentName: 'Sarah Williams',
      invoiceId: 'INV-2025-003',
      amount: 250000.00,
      paymentDate: '2025-01-15',
      method: 'cash',
      status: 'pending',
      reference: 'CS-2025-003-DEF789',
      paymentType: 'full'
    },
    {
      id: 'PAY-2025-009',
      studentName: 'Alex Thompson',
      invoiceId: 'INV-2025-009',
      amount: 200000.00,
      totalInvoiceAmount: 600000.00,
      paymentDate: '2025-01-15',
      method: 'bank_transfer',
      status: 'completed',
      reference: 'BT-2025-009-001',
      paymentType: 'partial',
      installmentNumber: 1,
      totalInstallments: 3,
      remainingBalance: 400000.00
    },
    {
      id: 'PAY-2025-010',
      studentName: 'Maria Garcia',
      invoiceId: 'INV-2025-010',
      amount: 190000.00,
      totalInvoiceAmount: 950000.00,
      paymentDate: '2024-12-30',
      method: 'card',
      status: 'completed',
      reference: 'CD-2025-010-001',
      paymentType: 'partial',
      installmentNumber: 1,
      totalInstallments: 5,
      remainingBalance: 760000.00
    },
    {
      id: 'PAY-2025-011',
      studentName: 'Maria Garcia',
      invoiceId: 'INV-2025-010',
      amount: 190000.00,
      totalInvoiceAmount: 950000.00,
      paymentDate: '2025-01-12',
      method: 'bank_transfer',
      status: 'completed',
      reference: 'BT-2025-010-002',
      paymentType: 'partial',
      installmentNumber: 2,
      totalInstallments: 5,
      remainingBalance: 570000.00
    },
    {
      id: 'PAY-2025-012',
      studentName: 'Kevin Park',
      invoiceId: 'INV-2025-011',
      amount: 160000.00,
      totalInvoiceAmount: 480000.00,
      paymentDate: '2025-01-25',
      method: 'mobile_money',
      status: 'completed',
      reference: 'MM-2025-011-001',
      paymentType: 'partial',
      installmentNumber: 1,
      totalInstallments: 3,
      remainingBalance: 320000.00
    },
    {
      id: 'PAY-2025-013',
      studentName: 'Kevin Park',
      invoiceId: 'INV-2025-011',
      amount: 160000.00,
      totalInvoiceAmount: 480000.00,
      paymentDate: '2025-02-01',
      method: 'cash',
      status: 'completed',
      reference: 'CS-2025-011-002',
      paymentType: 'partial',
      installmentNumber: 2,
      totalInstallments: 3,
      remainingBalance: 160000.00
    },
    {
      id: 'PAY-2025-014',
      studentName: 'Sophie Chen',
      invoiceId: 'INV-2025-012',
      amount: 150000.00,
      totalInvoiceAmount: 750000.00,
      paymentDate: '2025-02-05',
      method: 'bank_transfer',
      status: 'completed',
      reference: 'BT-2025-012-001',
      paymentType: 'partial',
      installmentNumber: 1,
      totalInstallments: 5,
      remainingBalance: 600000.00
    },
    {
      id: 'PAY-2025-015',
      studentName: 'Sophie Chen',
      invoiceId: 'INV-2025-012',
      amount: 150000.00,
      totalInvoiceAmount: 750000.00,
      paymentDate: '2025-02-08',
      method: 'card',
      status: 'completed',
      reference: 'CD-2025-012-002',
      paymentType: 'partial',
      installmentNumber: 2,
      totalInstallments: 5,
      remainingBalance: 450000.00
    },
    {
      id: 'PAY-2025-016',
      studentName: 'Sophie Chen',
      invoiceId: 'INV-2025-012',
      amount: 150000.00,
      totalInvoiceAmount: 750000.00,
      paymentDate: '2025-02-09',
      method: 'mobile_money',
      status: 'completed',
      reference: 'MM-2025-012-003',
      paymentType: 'partial',
      installmentNumber: 3,
      totalInstallments: 5,
      remainingBalance: 300000.00
    },
    {
      id: 'PAY-2025-017',
      studentName: 'James Martinez',
      invoiceId: 'INV-2025-013',
      amount: 125000.00,
      totalInvoiceAmount: 500000.00,
      paymentDate: '2025-01-08',
      method: 'bank_transfer',
      status: 'completed',
      reference: 'BT-2025-013-001',
      paymentType: 'partial',
      installmentNumber: 1,
      totalInstallments: 4,
      remainingBalance: 375000.00
    },
    {
      id: 'PAY-2025-018',
      studentName: 'Ashley Davis',
      invoiceId: 'INV-2025-014',
      amount: 100000.00,
      totalInvoiceAmount: 400000.00,
      paymentDate: '2025-01-20',
      method: 'card',
      status: 'pending',
      reference: 'CD-2025-014-001',
      paymentType: 'partial',
      installmentNumber: 1,
      totalInstallments: 4,
      remainingBalance: 300000.00
    },
    {
      id: 'PAY-2025-004',
      studentName: 'David Rodriguez',
      invoiceId: 'INV-2025-004',
      amount: 480000.00,
      paymentDate: '2025-01-18',
      method: 'mobile_money',
      status: 'completed',
      reference: 'MM-2025-004-GHI012',
      paymentType: 'full'
    },
    {
      id: 'PAY-2025-005',
      studentName: 'Lisa Anderson',
      invoiceId: 'INV-2025-005',
      amount: 350000.00,
      paymentDate: '2025-01-20',
      method: 'bank_transfer',
      status: 'failed',
      reference: 'BT-2025-005-JKL345',
      paymentType: 'full'
    },
    {
      id: 'PAY-2025-006',
      studentName: 'James Wilson', 
      invoiceId: 'INV-2025-006',
      amount: 400000.00,
      paymentDate: '2025-01-22',
      method: 'card',
      status: 'refunded',
      reference: 'CD-2025-006-MNO678',
      paymentType: 'full'
    }
  ];

  // Filter and paginate payments
  let filteredPayments = mockPayments;
  
  if (searchTerm) {
    filteredPayments = filteredPayments?.filter(payment =>
      payment?.studentName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      payment?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      payment?.invoiceId?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  }

  if (filters?.status) {
    filteredPayments = filteredPayments?.filter(payment => payment?.status === filters?.status);
  }

  if (filters?.method) {
    filteredPayments = filteredPayments?.filter(payment => payment?.method === filters?.method);
  }

  const totalPages = Math.ceil(filteredPayments?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments?.slice(startIndex, startIndex + itemsPerPage);

  // Auto-generate receipts for completed payments
  useEffect(() => {
    mockPayments?.forEach(payment => {
      if (payment?.status === 'completed') {
        receiptService?.autoGenerateReceiptOnPaymentSuccess(payment);
      }
    });
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', className: 'bg-success/10 text-success border-success/20' },
      pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
      failed: { label: 'Failed', className: 'bg-error/10 text-error border-error/20' },
      refunded: { label: 'Refunded', className: 'bg-info/10 text-info border-info/20' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config?.className}`}>
        {config?.label}
      </span>
    );
  };

  // Enhanced payment type badge
  const getPaymentTypeBadge = (paymentType, installmentNumber, totalInstallments) => {
    if (paymentType === 'partial') {
      return (
        <div className="flex items-center space-x-1">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
            Partial ({installmentNumber}/{totalInstallments})
          </span>
        </div>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-green-50 text-green-700 border-green-200">
        Full Payment
      </span>
    );
  };

  // Enhanced amount display
  const getAmountDisplay = (payment) => {
    if (payment?.paymentType === 'partial') {
      return (
        <div>
          <div className="font-medium text-foreground">{formatAmount(payment?.amount)}</div>
          <div className="text-xs text-muted-foreground">
            of {formatAmount(payment?.totalInvoiceAmount)}
          </div>
          <div className="text-xs text-blue-600">
            Balance: {formatAmount(payment?.remainingBalance)}
          </div>
        </div>
      );
    }
    
    return <div className="font-medium text-foreground">{formatAmount(payment?.amount)}</div>;
  };

  const getMethodIcon = (method) => {
    const methodIcons = {
      cash: 'Banknote',
      bank_transfer: 'Building2',
      card: 'CreditCard',
      mobile_money: 'Smartphone'
    };
    return methodIcons?.[method] || 'Banknote';
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (column) => {
    if (!sortConfig || sortConfig?.key !== column) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPayments(paginatedPayments?.map(payment => payment?.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId, checked) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments?.filter(id => id !== paymentId));
    }
  };

  // Generate receipts for selected payments
  const handleGenerateReceipts = () => {
    let generatedCount = 0;
    selectedPayments?.forEach(paymentId => {
      const payment = paginatedPayments?.find(p => p?.id === paymentId);
      if (payment && payment?.status === 'completed') {
        const existingReceipts = receiptService?.getReceiptsByPaymentId(payment?.id);
        if (existingReceipts?.length === 0) {
          receiptService?.generateReceipt(payment, 'full');
          generatedCount++;
        }
      }
    });
    
    if (generatedCount > 0) {
      alert(`Generated ${generatedCount} receipt${generatedCount > 1 ? 's' : ''} successfully!`);
    } else {
      alert('No new receipts to generate. Receipts may already exist for selected payments.');
    }
  };

  // Download receipt for payment
  const handleDownloadReceipt = (payment) => {
    const receipts = receiptService?.getReceiptsByPaymentId(payment?.id);
    if (receipts?.length > 0) {
      const receiptData = receiptService?.generateReceiptForDownload(receipts?.[0]?.id);
      if (receiptData) {
        const receiptContent = `
PAYMENT RECEIPT - ${receiptData?.receiptNumber}
=====================================
${receiptData?.schoolInfo?.name}
${receiptData?.schoolInfo?.address}
Phone: ${receiptData?.schoolInfo?.phone}
Email: ${receiptData?.schoolInfo?.email}

Student: ${receiptData?.studentName}
Invoice: ${receiptData?.invoiceId}
Amount: ${formatAmount(receiptData?.amount)}
Date: ${formatDate(receiptData?.paymentDate)}
Method: ${receiptData?.paymentMethod?.replace('_', ' ')?.toUpperCase()}
=====================================
Generated: ${formatDate(receiptData?.generatedAt)}
        `?.trim();
        
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL?.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${receiptData?.receiptId}.txt`;
        document.body?.appendChild(link);
        link?.click();
        document.body?.removeChild(link);
        
        window.URL?.revokeObjectURL(url);
      }
    } else {
      // Generate receipt first if it doesn't exist
      if (payment?.status === 'completed') {
        receiptService?.generateReceipt(payment, 'full');
        alert('Receipt generated successfully! Please try downloading again.');
      } else {
        alert('Cannot generate receipt for incomplete payments.');
      }
    }
  };

  // Check if payment has receipt
  const hasReceipt = (paymentId) => {
    const receipts = receiptService?.getReceiptsByPaymentId(paymentId);
    return receipts?.length > 0;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedPayments?.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedPayments?.length} payment{selectedPayments?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleGenerateReceipts} iconName="FileText" iconSize={14}>
                Generate Receipts
              </Button>
              <Button variant="outline" size="sm" iconName="Download" iconSize={14}>
                Export Selected
              </Button>
              <Button variant="outline" size="sm" iconName="RefreshCw" iconSize={14}>
                Refund
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedPayments?.length === paginatedPayments?.length && paginatedPayments?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Payment ID</span>
                  <Icon name={getSortIcon('id')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('studentName')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Student</span>
                  <Icon name={getSortIcon('studentName')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <span className="text-sm font-medium text-foreground">Invoice</span>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('amount')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <span className="text-sm font-medium text-foreground">Type</span>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('paymentDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Date</span>
                  <Icon name={getSortIcon('paymentDate')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <span className="text-sm font-medium text-foreground">Method</span>
              </th>
              <th className="text-left px-6 py-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-left px-6 py-4">
                <span className="text-sm font-medium text-foreground">Receipt</span>
              </th>
              <th className="text-right px-6 py-4">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedPayments?.map((payment) => (
              <tr key={payment?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPayments?.includes(payment?.id)}
                    onChange={(e) => handleSelectPayment(payment?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{payment?.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{payment?.studentName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{payment?.invoiceId}</div>
                </td>
                <td className="px-6 py-4">
                  {getAmountDisplay(payment)}
                </td>
                <td className="px-6 py-4">
                  {getPaymentTypeBadge(payment?.paymentType, payment?.installmentNumber, payment?.totalInstallments)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{formatDate(payment?.paymentDate)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getMethodIcon(payment?.method)} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground capitalize">{payment?.method?.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(payment?.status)}
                </td>
                <td className="px-6 py-4">
                  {hasReceipt(payment?.id) ? (
                    <div className="flex items-center space-x-1">
                      <Icon name="CheckCircle" size={12} className="text-success" />
                      <span className="text-xs text-success">Receipt</span>
                    </div>
                  ) : payment?.status === 'completed' ? (
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={16} className="text-warning" />
                      <span className="text-xs text-warning">Pending</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Icon name="Minus" size={16} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">N/A</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onViewPayment(payment)}
                      iconName="Eye"
                      iconSize={14}
                    >
                      View
                    </Button>
                    {hasReceipt(payment?.id) ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        iconName="Download" 
                        iconSize={14}
                        onClick={() => handleDownloadReceipt(payment)}
                      >
                        Receipt
                      </Button>
                    ) : payment?.status === 'completed' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        iconName="FileText" 
                        iconSize={14}
                        onClick={() => {
                          receiptService?.generateReceipt(payment, payment?.paymentType || 'full');
                          alert('Receipt generated successfully!');
                        }}
                      >
                        Generate
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {paginatedPayments?.map((payment) => (
          <div key={payment?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedPayments?.includes(payment?.id)}
                  onChange={(e) => handleSelectPayment(payment?.id, e?.target?.checked)}
                  className="rounded border-border"
                />
                <div>
                  <div className="font-medium text-foreground">{payment?.id}</div>
                  <div className="text-sm text-muted-foreground">{payment?.studentName}</div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                {getStatusBadge(payment?.status)}
                {getPaymentTypeBadge(payment?.paymentType, payment?.installmentNumber, payment?.totalInstallments)}
                {hasReceipt(payment?.id) && (
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={12} className="text-success" />
                    <span className="text-xs text-success">Receipt</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Amount</div>
                {getAmountDisplay(payment)}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="text-sm text-foreground">{formatDate(payment?.paymentDate)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Method</div>
                <div className="flex items-center space-x-1">
                  <Icon name={getMethodIcon(payment?.method)} size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground capitalize">{payment?.method?.replace('_', ' ')}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Invoice</div>
                <div className="text-sm text-foreground">{payment?.invoiceId}</div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onViewPayment(payment)} iconName="Eye" iconSize={14}>
                View
              </Button>
              {hasReceipt(payment?.id) ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  iconName="Download" 
                  iconSize={14}
                  onClick={() => handleDownloadReceipt(payment)}
                >
                  Receipt
                </Button>
              ) : payment?.status === 'completed' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  iconName="FileText" 
                  iconSize={14}
                  onClick={() => {
                    receiptService?.generateReceipt(payment, payment?.paymentType || 'full');
                    alert('Receipt generated successfully!');
                  }}
                >
                  Generate
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPayments?.length)} of {filteredPayments?.length} payments
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                iconName="ChevronLeft"
                iconSize={14}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                iconName="ChevronRight"
                iconSize={14}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;