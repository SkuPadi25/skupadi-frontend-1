import React, { useEffect, useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import TableEmptyState from '../../TableEmptyState'

const TransactionsTable = ({ searchTerm, filters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Mock transaction data
  const mockTransactions = [
    {
      id: 1,
      amount: '₦250,000',
      balanceBefore: '₦2,200,000',
      balanceAfter: '₦2,450,000',
      type: 'Credit',
      date: '2025-01-20',
      time: '14:30',
      reference: 'TXN-2025-001',
      status: 'Success',
      description: 'School fees payment - JSS 1 students'
    },
    {
      id: 2,
      amount: '₦75,000',
      balanceBefore: '₦2,450,000',
      balanceAfter: '₦2,375,000',
      type: 'Debit',
      date: '2025-01-19',
      time: '10:15',
      reference: 'TXN-2025-002',
      status: 'Success',
      description: 'Staff salary payment'
    },
    {
      id: 3,
      amount: '₦180,000',
      balanceBefore: '₦2,195,000',
      balanceAfter: '₦2,375,000',
      type: 'Credit',
      date: '2025-01-19',
      time: '09:45',
      reference: 'TXN-2025-003',
      status: 'Success',
      description: 'Uniform and books payment'
    },
    {
      id: 4,
      amount: '₦50,000',
      balanceBefore: '₦2,245,000',
      balanceAfter: '₦2,195,000',
      type: 'Debit',
      date: '2025-01-18',
      time: '16:20',
      reference: 'TXN-2025-004',
      status: 'Pending',
      description: 'Utility bills payment'
    },
    {
      id: 5,
      amount: '₦320,000',
      balanceBefore: '₦1,925,000',
      balanceAfter: '₦2,245,000',
      type: 'Credit',
      date: '2025-01-18',
      time: '11:00',
      reference: 'TXN-2025-005',
      status: 'Success',
      description: 'Bulk payment from parents'
    },
    {
      id: 6,
      amount: '₦95,000',
      balanceBefore: '₦2,020,000',
      balanceAfter: '₦1,925,000',
      type: 'Debit',
      date: '2025-01-17',
      time: '13:30',
      reference: 'TXN-2025-006',
      status: 'Failed',
      description: 'Equipment purchase'
    }
  ];


  // Filter and search logic
  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(transaction =>
        transaction?.reference?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        transaction?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Type filter
    if (filters?.type) {
      filtered = filtered?.filter(transaction =>
        transaction?.type?.toLowerCase() === filters?.type?.toLowerCase()
      );
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(transaction =>
        transaction?.status?.toLowerCase() === filters?.status?.toLowerCase()
      );
    }

    // Date range filter (simplified)
    if (filters?.dateRange) {
      const today = new Date();
      const transactionDate = new Date();
      
      switch (filters?.dateRange) {
        case 'today':
          filtered = filtered?.filter(transaction => {
            const txDate = new Date(transaction?.date);
            return txDate?.toDateString() === today?.toDateString();
          });
          break;
        case 'last7days':
          const last7Days = new Date(today?.getTime() - (7 * 24 * 60 * 60 * 1000));
          filtered = filtered?.filter(transaction => {
            const txDate = new Date(transaction?.date);
            return txDate >= last7Days;
          });
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [searchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions?.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'failed':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getTypeColor = (type) => {
    return type?.toLowerCase() === 'credit' ?'text-success' :'text-error';
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Balance Before</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Balance After</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reference</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
          {currentTransactions.length > 0 ? (
            currentTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                {/* rows unchanged */}
              </tr>
            ))
          ) : filteredTransactions.length === 0 && !searchTerm ? (
            <TableEmptyState
              title="No transactions yet"
              description="Make your first transfer to start tracking wallet activity."
              actionLabel="Make a transfer"
              onAction={() => console.log('Open transfer modal')}
              colSpan={7}
            />
          ) : (
            <TableEmptyState
              title="No results found"
              description="Try adjusting your search or filters."
              colSpan={7}
            />
          )}
        </tbody>

        </table>
      </div>

      {/* Pagination */}
      {filteredTransactions?.length > itemsPerPage && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions?.length)} of {filteredTransactions?.length} transactions
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;