import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const InvoiceStatusChart = () => {
  const data = [
    { name: 'Paid', value: 65, count: 324, color: 'var(--color-success)' },
    { name: 'Pending', value: 25, count: 125, color: 'var(--color-warning)' },
    { name: 'Overdue', value: 10, count: 48, color: 'var(--color-error)' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">{`${data.count} invoices (${data.value}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-foreground">{entry.value}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {data.find(d => d.name === entry.value)?.count} invoices
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Invoice Status</h3>
        <p className="text-sm text-muted-foreground">Distribution of invoice statuses</p>
      </div>
      
      <div className="w-full h-80" aria-label="Invoice Status Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">497</p>
          <p className="text-sm text-muted-foreground">Total Invoices</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusChart;