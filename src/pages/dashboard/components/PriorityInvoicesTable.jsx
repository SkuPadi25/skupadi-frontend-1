import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import InvoiceStatusBadge from '../../invoices-management/components/InvoiceStatusBadge';
import PriorityInvoicesActionMenu from './PriorityInvoicesActionMenu';

const PriorityInvoicesTable = () => {
  const [activeFilter, setActiveFilter] = useState('Urgent');
  const navigate = useNavigate();

  // Updated mock data with partial payment examples
  const priorityInvoices = [
    {
      id: "INV-2025-001",
      studentName: "Eleanor Pena",
      studentId: "STU-001",
      amount: 347000.00,
      paidAmount: 0.00,
      dueDate: "2025-01-24",
      issueDate: "2024-12-24",
      status: "overdue",
      class: "Grade 2",
      paymentDate: null,
      priority: "Overdue"
    },
    {
      id: "INV-2025-002",
      studentName: "Dianne Russell",
      studentId: "STU-002",
      amount: 700000.00,
      paidAmount: 0.00,
      dueDate: "2025-01-19",
      issueDate: "2024-12-19",
      status: "overdue",
      class: "Grade 4",
      paymentDate: null,
      priority: "Overdue"
    },
    {
      id: "INV-2025-003",
      studentName: "Esther Howard",
      studentId: "STU-003",
      amount: 497000.00,
      paidAmount: 0.00,
      dueDate: "2025-01-24",
      issueDate: "2024-12-24",
      status: "overdue",
      class: "Grade 7",
      paymentDate: null,
      priority: "Overdue"
    },
    {
      id: "INV-2025-004",
      studentName: "Wade Warren",
      studentId: "STU-004",
      amount: 747000.00,
      paidAmount: 0.00,
      dueDate: "2025-02-01",
      issueDate: "2025-01-01",
      status: "overdue",
      class: "Grade 1",
      paymentDate: null,
      priority: "Overdue"
    },
    {
      id: "INV-2025-005",
      studentName: "Cameron Williamson",
      studentId: "STU-005",
      amount: 830000.00,
      paidAmount: 0.00,
      dueDate: "2025-01-20",
      issueDate: "2024-12-20",
      status: "overdue",
      class: "Grade 2",
      paymentDate: null,
      priority: "Overdue"
    },
    {
      id: "INV-2025-009",
      studentName: "Alex Thompson",
      studentId: "STU-009",
      amount: 600000.00,
      paidAmount: 200000.00,
      dueDate: "2025-02-10",
      issueDate: "2025-01-10",
      status: "partial",
      class: "Grade 8",
      paymentDate: "2025-01-15",
      priority: "Urgent",
      installmentStatus: "active",
      nextInstallmentDate: "2025-02-15",
      nextInstallmentAmount: 200000.00,
      paymentHistory: [
        { date: "2025-01-15", amount: 200000.00, method: "bank_transfer", reference: "BT-2025-009-001" }
      ]
    },
    {
      id: "INV-2025-010",
      studentName: "Maria Garcia",
      studentId: "STU-010",
      amount: 950000.00,
      paidAmount: 380000.00,
      dueDate: "2025-01-25",
      issueDate: "2024-12-25",
      status: "partial",
      class: "Grade 9",
      paymentDate: "2024-12-30",
      priority: "Overdue",
      installmentStatus: "behind",
      nextInstallmentDate: "2025-01-25",
      nextInstallmentAmount: 190000.00,
      paymentHistory: [
        { date: "2024-12-30", amount: 190000.00, method: "card", reference: "CD-2025-010-001" },
        { date: "2025-01-12", amount: 190000.00, method: "bank_transfer", reference: "BT-2025-010-002" }
      ]
    },
    {
      id: "INV-2025-011",
      studentName: "Kevin Park",
      studentId: "STU-011",
      amount: 480000.00,
      paidAmount: 320000.00,
      dueDate: "2025-02-20",
      issueDate: "2025-01-20",
      status: "partial",
      class: "Grade 6",
      paymentDate: "2025-01-25",
      priority: "Urgent",
      installmentStatus: "on_track",
      nextInstallmentDate: "2025-02-25",
      nextInstallmentAmount: 160000.00,
      paymentHistory: [
        { date: "2025-01-25", amount: 160000.00, method: "mobile_money", reference: "MM-2025-011-001" },
        { date: "2025-02-01", amount: 160000.00, method: "cash", reference: "CS-2025-011-002" }
      ]
    },
    {
      id: "INV-2025-012",
      studentName: "Sophie Chen",
      studentId: "STU-012",
      amount: 750000.00,
      paidAmount: 450000.00,
      dueDate: "2025-02-28",
      issueDate: "2025-01-28",
      status: "partial",
      class: "Grade 10",
      paymentDate: "2025-02-05",
      priority: "Urgent",
      installmentStatus: "ahead",
      nextInstallmentDate: "2025-03-05",
      nextInstallmentAmount: 150000.00,
      paymentHistory: [
        { date: "2025-02-05", amount: 150000.00, method: "bank_transfer", reference: "BT-2025-012-001" },
        { date: "2025-02-08", amount: 150000.00, method: "card", reference: "CD-2025-012-002" },
        { date: "2025-02-09", amount: 150000.00, method: "mobile_money", reference: "MM-2025-012-003" }
      ]
    },
    {
      id: "INV-2025-006",
      studentName: "Jenny Wilson",
      studentId: "STU-006",
      amount: 455000.00,
      paidAmount: 0.00,
      dueDate: "2025-02-15",
      issueDate: "2025-01-15",
      status: "pending",
      class: "Grade 3",
      paymentDate: null,
      priority: "Urgent"
    },
    {
      id: "INV-2025-007",
      studentName: "Robert Fox",
      studentId: "STU-007",
      amount: 628000.00,
      paidAmount: 0.00,
      dueDate: "2025-02-28",
      issueDate: "2025-01-28",
      status: "pending",
      class: "Grade 5",
      paymentDate: null,
      priority: "Pending"
    },
    {
      id: "INV-2025-008",
      studentName: "Brooklyn Simmons",
      studentId: "STU-008",
      amount: 520000.00,
      paidAmount: 0.00,
      dueDate: "2025-03-05",
      issueDate: "2025-02-05",
      status: "pending",
      class: "Grade 6",
      paymentDate: null,
      priority: "Pending"
    }
  ];

  // Updated filter options to include "Partial" filter
  const filterOptions = ['Urgent', 'Overdue', 'Due Today', 'Partial'];

  // Helper function to categorize invoices based on Reminder Module logic
  const categorizeInvoiceByDueDate = (invoice) => {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const daysDifference = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    // First Overdue Notice: Invoices past due date
    if (daysDifference < 0) {
      return 'Overdue';
    }
    // Due Date Reminder: Invoices due today - changed to "Due Today"
    else if (daysDifference === 0) {
      return 'Due Today';
    }
    // Pre-Due Reminder: Invoices approaching due date (within next 7 days)
    else if (daysDifference <= 7) {
      return 'Urgent';
    }
    
    return null; // Don't show in priority table if more than 7 days away
  };

  // Filter invoices based on due date logic and active filter
  const filteredInvoices = priorityInvoices?.filter(invoice => {
    // Handle Partial filter specifically
    if (activeFilter === 'Partial') {
      return invoice?.status === 'partial';
    }
    
    const category = categorizeInvoiceByDueDate(invoice);
    
    // Only show invoices that fall into one of our priority categories
    if (!category || !['Urgent', 'Overdue', 'Due Today']?.includes(category)) {
      return false;
    }
    
    // Filter by active filter
    return category === activeFilter;
  }) || [];

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    })?.format(amount);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Overdue':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Urgent':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getDueDateDisplay = (dueDate, invoiceData) => {
    // Special handling for partial payments
    if (invoiceData?.status === 'partial') {
      const remainingAmount = invoiceData?.amount - (invoiceData?.paidAmount || 0);
      const progressPercentage = ((invoiceData?.paidAmount || 0) / invoiceData?.amount * 100)?.toFixed(1);
      
      return (
        <div>
          <div className="text-sm text-foreground">{formatDate(dueDate)}</div>
          <div className="text-xs text-blue-600 font-medium">
            {progressPercentage}% paid (₦{formatAmount(remainingAmount)?.replace('₦', '')} remaining)
          </div>
          {invoiceData?.nextInstallmentDate && (
            <div className="text-xs text-muted-foreground">
              Next: {formatDate(invoiceData?.nextInstallmentDate)}
            </div>
          )}
        </div>
      );
    }

    const today = new Date();
    const dueDateObj = new Date(dueDate);
    const daysDifference = Math.ceil((dueDateObj - today) / (1000 * 60 * 60 * 24));
    const category = categorizeInvoiceByDueDate(invoiceData);

    if (category === 'Overdue') {
      const overdueDays = Math.abs(daysDifference);
      return (
        <div>
          <div className="text-sm text-foreground">{formatDate(dueDate)}</div>
          <div className="text-xs text-red-600 font-medium">
            ({overdueDays} days overdue)
          </div>
        </div>
      );
    } else if (category === 'Due Today') {
      return (
        <div>
          <div className="text-sm text-foreground">{formatDate(dueDate)}</div>
          <div className="text-xs text-yellow-600 font-medium">
            (Due today)
          </div>
        </div>
      );
    } else if (category === 'Urgent') {
      return (
        <div>
          <div className="text-sm text-foreground">{formatDate(dueDate)}</div>
          <div className="text-xs text-orange-600 font-medium">
            (Due in {daysDifference} days)
          </div>
        </div>
      );
    }
    
    return <div className="text-sm text-foreground">{formatDate(dueDate)}</div>;
  };

  // Enhanced amount display for partial payments
  const getAmountDisplay = (invoice) => {
    if (invoice?.status === 'partial') {
      return (
        <div>
          <div className="font-medium text-foreground">{formatAmount(invoice?.amount)}</div>
          <div className="text-xs text-blue-600">
            Paid: {formatAmount(invoice?.paidAmount)}
          </div>
          <div className="text-xs text-muted-foreground">
            Balance: {formatAmount(invoice?.amount - invoice?.paidAmount)}
          </div>
        </div>
      );
    }
    
    return <div className="font-medium text-foreground">{formatAmount(invoice?.amount)}</div>;
  };

  // Navigation handler for "View all invoices" button
  const handleViewAllInvoices = () => {
    navigate('/invoices-management');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Priority Invoices</h3>
          <p className="text-sm text-muted-foreground">Monitor urgent, overdue, and partial payment invoices requiring attention</p>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions?.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                Invoice #
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                Student
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                Amount
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                Due Date / Progress
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">
                Status
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredInvoices?.length > 0 ? (
              filteredInvoices?.map((invoice) => (
                <tr key={invoice?.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{invoice?.id}</div>
                    {invoice?.status === 'partial' && invoice?.installmentStatus && (
                      <div className={`text-xs mt-1 ${
                        invoice?.installmentStatus === 'on_track' ? 'text-success' :
                        invoice?.installmentStatus === 'ahead' ? 'text-info' :
                        invoice?.installmentStatus === 'behind'? 'text-error' : 'text-warning'
                      }`}>
                        {invoice?.installmentStatus?.replace('_', ' ')?.toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">{invoice?.studentName}</div>
                      <div className="text-sm text-muted-foreground">{invoice?.class}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getAmountDisplay(invoice)}
                  </td>
                  <td className="px-6 py-4">
                    {getDueDateDisplay(invoice?.dueDate, invoice)}
                  </td>
                  <td className="px-6 py-4">
                    <InvoiceStatusBadge status={invoice?.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <PriorityInvoicesActionMenu invoice={invoice} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 px-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="FileText" size={32} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      No {activeFilter?.toLowerCase()} invoices found
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {filteredInvoices?.length > 0 ? (
          filteredInvoices?.map((invoice) => (
            <div key={invoice?.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium text-foreground">{invoice?.id}</div>
                  <div className="text-sm text-muted-foreground">{invoice?.studentName}</div>
                  <div className="text-xs text-muted-foreground">{invoice?.class}</div>
                  {invoice?.status === 'partial' && invoice?.installmentStatus && (
                    <div className={`text-xs mt-1 ${
                      invoice?.installmentStatus === 'on_track' ? 'text-success' :
                      invoice?.installmentStatus === 'ahead' ? 'text-info' :
                      invoice?.installmentStatus === 'behind'? 'text-error' : 'text-warning'
                    }`}>
                      {invoice?.installmentStatus?.replace('_', ' ')?.toUpperCase()}
                    </div>
                  )}
                </div>
                <InvoiceStatusBadge status={invoice?.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                  {getAmountDisplay(invoice)}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Due Date</div>
                  {getDueDateDisplay(invoice?.dueDate, invoice)}
                </div>
              </div>
              
              <div className="flex justify-end">
                <PriorityInvoicesActionMenu invoice={invoice} />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <Icon name="FileText" size={32} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                No {activeFilter?.toLowerCase()} invoices found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* View All Link */}
      {filteredInvoices?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <button 
            onClick={handleViewAllInvoices}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View all invoices
            <Icon name="ChevronRight" size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PriorityInvoicesTable;