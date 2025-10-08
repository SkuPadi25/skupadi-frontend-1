import React from 'react';
import Icon from '../../../components/AppIcon';

const InvoiceSummaryCards = () => {
  const summaryData = [
    {
      id: 1,
      title: "Total Invoices",
      value: "1,247",
      change: "+12%",
      changeType: "positive",
      icon: "FileText",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Outstanding Amount",
      value: "₦45,280",
      change: "-8%",
      changeType: "negative",
      icon: "Banknote",
      color: "bg-amber-500"
    },
    {
      id: 3,
      title: "Collection Rate",
      value: "87.5%",
      change: "+5%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "bg-green-500"
    },
    {
      id: 4,
      title: "Overdue Invoices",
      value: "156",
      change: "-15%",
      changeType: "positive",
      icon: "AlertTriangle",
      color: "bg-red-500"
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
              <div className="flex items-center mt-2">
                <Icon 
                  name={item?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                  color={item?.changeType === 'positive' ? '#10b981' : '#ef4444'} 
                />
                <span className={`text-sm ml-1 ${
                  item?.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item?.change}
                </span>
                <span className="text-sm text-muted-foreground ml-1">vs last month</span>
              </div>
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