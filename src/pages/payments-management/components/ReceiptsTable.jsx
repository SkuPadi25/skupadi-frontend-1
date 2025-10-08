import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import receiptService from '../../../services/receiptService';

const ReceiptsTable = ({ filters, searchTerm, onViewReceipt }) => {
  const [receipts, setReceipts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedReceipts, setSelectedReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Load receipts
  useEffect(() => {
    loadReceipts();
  }, [currentPage, filters, searchTerm]);

  const loadReceipts = () => {
    setLoading(true);
    try {
      const receiptFilters = {
        ...filters,
        studentName: searchTerm
      };
      
      const result = receiptService?.getAllReceipts(currentPage, itemsPerPage, receiptFilters);
      setReceipts(result?.receipts || []);
      setPagination(result);
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setLoading(false);
    }
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentTypeLabel = (type) => {
    return type === 'full' ? 'Full Payment' : 'Partial Payment';
  };

  const getPaymentTypeBadge = (type) => {
    const badgeClass = type === 'full' ?'bg-success/10 text-success border-success/20' :'bg-warning/10 text-warning border-warning/20';
      
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${badgeClass}`}>
        {getPaymentTypeLabel(type)}
      </span>
    );
  };

  const getMethodIcon = (method) => {
    const methodIcons = {
      cash: 'Banknote',
      bank_transfer: 'Building2',
      card: 'CreditCard',
      mobile_money: 'Smartphone'
    };
    return methodIcons?.[method] || 'DollarSign';
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
      setSelectedReceipts(receipts?.map(receipt => receipt?.id));
    } else {
      setSelectedReceipts([]);
    }
  };

  const handleSelectReceipt = (receiptId, checked) => {
    if (checked) {
      setSelectedReceipts([...selectedReceipts, receiptId]);
    } else {
      setSelectedReceipts(selectedReceipts?.filter(id => id !== receiptId));
    }
  };

  const handleBulkDownload = () => {
    // Mock bulk download functionality
    console.log('Downloading receipts:', selectedReceipts);
    alert(`Downloading ${selectedReceipts?.length} receipt${selectedReceipts?.length > 1 ? 's' : ''}`);
  };

  const handleBulkExport = () => {
    // Mock bulk export functionality
    console.log('Exporting receipts:', selectedReceipts);
    alert(`Exporting ${selectedReceipts?.length} receipt${selectedReceipts?.length > 1 ? 's' : ''}`);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="flex items-center justify-center">
          <Icon name="Loader2" size={24} className="animate-spin text-muted-foreground mr-2" />
          <span className="text-muted-foreground">Loading receipts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedReceipts?.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedReceipts?.length} receipt{selectedReceipts?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleBulkDownload} iconName="Download" iconSize={14}>
                Download Selected
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkExport} iconName="FileOutput" iconSize={14}>
                Export Selected
              </Button>
            </div>
          </div>
        </div>
      )}
      {receipts?.length === 0 ? (
        <div className="p-8 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Receipts Found</h3>
          <p className="text-muted-foreground">
            {searchTerm || Object.values(filters)?.some(Boolean) 
              ? 'No receipts match your current filters.' :'Receipts will appear here once payments are completed.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedReceipts?.length === receipts?.length && receipts?.length > 0}
                      onChange={(e) => handleSelectAll(e?.target?.checked)}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort('id')}
                      className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                    >
                      <span>Receipt ID</span>
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
                    <span className="text-sm font-medium text-foreground">Payment ID</span>
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
                    <span className="text-sm font-medium text-foreground">Payment Type</span>
                  </th>
                  <th className="text-left px-6 py-4">
                    <span className="text-sm font-medium text-foreground">Method</span>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort('generatedAt')}
                      className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                    >
                      <span>Generated</span>
                      <Icon name={getSortIcon('generatedAt')} size={14} />
                    </button>
                  </th>
                  <th className="text-right px-6 py-4">
                    <span className="text-sm font-medium text-foreground">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {receipts?.map((receipt) => (
                  <tr key={receipt?.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReceipts?.includes(receipt?.id)}
                        onChange={(e) => handleSelectReceipt(receipt?.id, e?.target?.checked)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{receipt?.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{receipt?.studentName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">{receipt?.paymentId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{formatAmount(receipt?.amount)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentTypeBadge(receipt?.paymentType)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Icon name={getMethodIcon(receipt?.paymentMethod)} size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground capitalize">{receipt?.paymentMethod?.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">{formatDate(receipt?.generatedAt)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onViewReceipt(receipt)}
                          iconName="Eye"
                          iconSize={14}
                        >
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          iconName="Download" 
                          iconSize={14}
                          onClick={() => {
                            const receiptData = receiptService?.generateReceiptForDownload(receipt?.id);
                            console.log('Download receipt:', receiptData);
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-border">
            {receipts?.map((receipt) => (
              <div key={receipt?.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedReceipts?.includes(receipt?.id)}
                      onChange={(e) => handleSelectReceipt(receipt?.id, e?.target?.checked)}
                      className="rounded border-border"
                    />
                    <div>
                      <div className="font-medium text-foreground">{receipt?.id}</div>
                      <div className="text-sm text-muted-foreground">{receipt?.studentName}</div>
                    </div>
                  </div>
                  {getPaymentTypeBadge(receipt?.paymentType)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Amount</div>
                    <div className="font-medium text-foreground">{formatAmount(receipt?.amount)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Generated</div>
                    <div className="text-sm text-foreground">{formatDate(receipt?.generatedAt)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Method</div>
                    <div className="flex items-center space-x-1">
                      <Icon name={getMethodIcon(receipt?.paymentMethod)} size={14} className="text-muted-foreground" />
                      <span className="text-sm text-foreground capitalize">{receipt?.paymentMethod?.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Payment ID</div>
                    <div className="text-sm text-foreground">{receipt?.paymentId}</div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onViewReceipt(receipt)} iconName="Eye" iconSize={14}>
                    View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    iconName="Download" 
                    iconSize={14}
                    onClick={() => {
                      const receiptData = receiptService?.generateReceiptForDownload(receipt?.id);
                      console.log('Download receipt:', receiptData);
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div className="border-t border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination?.currentPage - 1) * itemsPerPage) + 1} to {Math.min(pagination?.currentPage * itemsPerPage, pagination?.totalCount)} of {pagination?.totalCount} receipts
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination?.hasPrevious}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    iconName="ChevronLeft"
                    iconSize={14}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: pagination?.totalPages }, (_, i) => i + 1)?.map((page) => (
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
                    disabled={!pagination?.hasNext}
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
        </>
      )}
    </div>
  );
};

export default ReceiptsTable;