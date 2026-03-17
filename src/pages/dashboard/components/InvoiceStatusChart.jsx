import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const InvoiceStatusChart = ({ data = [] }) => {
  const chartData = data?.map((item) => ({
    ...item,
    color:
      item?.name === 'Paid'
        ? 'var(--color-success)'
        : item?.name === 'Pending'
          ? 'var(--color-warning)'
          : 'var(--color-error)'
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{point.name}</p>
          <p className="text-sm text-muted-foreground">{`${point.count} invoices (${point.value}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="flex flex-col space-y-2 mt-4">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm text-foreground">{entry.value}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {chartData.find(d => d.name === entry.value)?.count} invoices
          </div>
        </div>
      ))}
    </div>
  );

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
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
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
          <p className="text-2xl font-bold text-foreground">{chartData?.reduce((sum, item) => sum + (item?.count || 0), 0)}</p>
          <p className="text-sm text-muted-foreground">Total Invoices</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusChart;
