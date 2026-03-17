import React from 'react';
import Icon from '../../../components/AppIcon';

const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN'
})?.format(Number(amount || 0));

const InvoiceSummaryCards = ({ summary }) => {
  const summaryData = [
    {
      id: 1,
      title: 'Total Invoices',
      value: summary?.totalInvoices ?? 0,
      icon: 'FileText',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Outstanding Amount',
      value: formatCurrency(summary?.outstandingAmount),
      icon: 'Banknote',
      color: 'bg-amber-500'
    },
    {
      id: 3,
      title: 'Collection Rate',
      value: `${Number(summary?.collectionRate || 0)?.toFixed(1)}%`,
      icon: 'TrendingUp',
      color: 'bg-green-500'
    },
    {
      id: 4,
      title: 'Overdue Invoices',
      value: summary?.overdueInvoices ?? 0,
      icon: 'AlertTriangle',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {summaryData?.map((item) => (
        <div key={item?.id} className="bg-card rounded-lg border border-border p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {item?.title}
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {item?.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${item?.color} rounded-lg flex items-center justify-center`}>
              <Icon name={item?.icon} size={24} color="white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceSummaryCards;
