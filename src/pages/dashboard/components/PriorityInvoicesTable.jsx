import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import InvoiceStatusBadge from '../../invoices-management/components/InvoiceStatusBadge';
import PriorityInvoicesActionMenu from './PriorityInvoicesActionMenu';

const PriorityInvoicesTable = ({ invoices = [] }) => {
  const [activeFilter, setActiveFilter] = useState('Urgent');
  const navigate = useNavigate();

  const filterOptions = ['Urgent', 'Overdue', 'Due Today'];

  const categorizeInvoiceByDueDate = (invoice) => {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const daysDifference = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (daysDifference < 0) {
      return 'Overdue';
    }
    if (daysDifference === 0) {
      return 'Due Today';
    }
    if (daysDifference <= 7) {
      return 'Urgent';
    }

    return null;
  };

  const filteredInvoices = invoices?.filter(invoice => categorizeInvoiceByDueDate(invoice) === activeFilter) || [];

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

  const getDueDateDisplay = (dueDate, invoiceData) => {
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
    }

    if (category === 'Due Today') {
      return (
        <div>
          <div className="text-sm text-foreground">{formatDate(dueDate)}</div>
          <div className="text-xs text-yellow-600 font-medium">
            (Due today)
          </div>
        </div>
      );
    }

    if (category === 'Urgent') {
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

  const handleViewAllInvoices = () => {
    navigate('/invoices-management');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Priority Invoices</h3>
          <p className="text-sm text-muted-foreground">Invoices requiring attention in the next 7 days or already overdue</p>
        </div>
      </div>

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

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Invoice #</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Student</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Amount</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Due Date</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-foreground">Status</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredInvoices?.length > 0 ? (
              filteredInvoices?.map((invoice) => (
                <tr key={invoice?.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{invoice?.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">{invoice?.studentName}</div>
                      <div className="text-sm text-muted-foreground">{invoice?.class}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{formatAmount(invoice?.amount)}</div>
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

      <div className="lg:hidden divide-y divide-border">
        {filteredInvoices?.length > 0 ? (
          filteredInvoices?.map((invoice) => (
            <div key={invoice?.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium text-foreground">{invoice?.id}</div>
                  <div className="text-sm text-muted-foreground">{invoice?.studentName}</div>
                  <div className="text-xs text-muted-foreground">{invoice?.class}</div>
                </div>
                <InvoiceStatusBadge status={invoice?.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="font-medium text-foreground">{formatAmount(invoice?.amount)}</div>
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
