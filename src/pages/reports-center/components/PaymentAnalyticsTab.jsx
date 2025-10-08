import React, { useState } from 'react';

import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ExportDropdown from '../../../components/ui/ExportDropdown';
import exportService from '../../../services/exportService';

const PaymentAnalyticsTab = ({ globalFilters, onGlobalFilterChange }) => {
  const [analyticsType, setAnalyticsType] = useState('patterns');
  const [period, setPeriod] = useState('monthly');

  // Mock transaction patterns data
  const transactionPatternsData = [
    { month: 'Jan', online: 120, bank: 85, cash: 45, transfer: 30 },
    { month: 'Feb', online: 135, bank: 92, cash: 38, transfer: 35 },
    { month: 'Mar', online: 142, bank: 88, cash: 42, transfer: 28 },
    { month: 'Apr', online: 158, bank: 95, cash: 35, transfer: 42 },
    { month: 'May', online: 165, bank: 102, cash: 28, transfer: 38 },
    { month: 'Jun', online: 172, bank: 108, cash: 32, transfer: 45 }
  ];

  // Mock payment methods data
  const paymentMethodsData = [
    { name: 'Online Payment', value: 45, color: '#3B82F6' },
    { name: 'Bank Transfer', value: 30, color: '#10B981' },
    { name: 'Cash Payment', value: 15, color: '#F59E0B' },
    { name: 'Mobile Money', value: 10, color: '#EF4444' }
  ];

  // Mock reconciliation data
  const reconciliationData = [
    { date: '2025-01-01', expected: 2500000, actual: 2450000, variance: -50000 },
    { date: '2025-01-02', expected: 3200000, actual: 3200000, variance: 0 },
    { date: '2025-01-03', expected: 2800000, actual: 2850000, variance: 50000 },
    { date: '2025-01-04', expected: 3500000, actual: 3400000, variance: -100000 },
    { date: '2025-01-05', expected: 4100000, actual: 4150000, variance: 50000 }
  ];

  const analyticsTypeOptions = [
    { value: 'patterns', label: 'Transaction Patterns' },
    { value: 'methods', label: 'Payment Methods' },
    { value: 'reconciliation', label: 'Reconciliation' },
    { value: 'trends', label: 'Payment Trends' }
  ];

  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const handleExportAnalytics = async (format) => {
    try {
      // Get current analytics data based on analyticsType
      let exportData = [];
      
      switch (analyticsType) {
        case 'patterns':
          exportData = transactionPatternsData?.map(item => ({
            'Month': item?.month,
            'Online Payments': item?.online,
            'Bank Transfers': item?.bank,
            'Cash Payments': item?.cash,
            'Mobile Transfers': item?.transfer,
            'Total Transactions': item?.online + item?.bank + item?.cash + item?.transfer,
            'Analytics Type': 'Transaction Patterns'
          }));
          break;
          
        case 'methods':
          exportData = paymentMethodsData?.map(item => ({
            'Payment Method': item?.name,
            'Usage Percentage': `${item?.value}%`,
            'Description': `${item?.value}% of all transactions`,
            'Analytics Type': 'Payment Methods'
          }));
          break;
          
        case 'reconciliation':
          exportData = reconciliationData?.map(item => ({
            'Date': new Date(item.date)?.toLocaleDateString('en-GB'),
            'Expected Amount': `₦${(item?.expected / 1000000)?.toFixed(2)}M`,
            'Actual Amount': `₦${(item?.actual / 1000000)?.toFixed(2)}M`,
            'Variance': `₦${(item?.variance / 1000000)?.toFixed(2)}M`,
            'Variance Percentage': `${((item?.variance / item?.expected) * 100)?.toFixed(2)}%`,
            'Status': item?.variance >= 0 ? 'Positive' : 'Negative',
            'Analytics Type': 'Reconciliation'
          }));
          break;
          
        default:
          exportData = [
            { 'Analytics': 'Payment Analytics Summary', 'Status': 'Please select a specific analytics type' }
          ];
      }

      let result;
      const filename = `Payment_${analyticsType?.charAt(0)?.toUpperCase() + analyticsType?.slice(1)}_Analytics`;
      
      switch (format?.toLowerCase()) {
        case 'excel':
          result = await exportService?.exportToExcel(exportData, { filename });
          break;
        case 'csv':
          result = await exportService?.exportToCSV(exportData, { filename });
          break;
        case 'pdf':
          // For PDF, create a summary format
          result = await exportService?.exportToExcel(exportData, { filename });
          alert('PDF export functionality will be enhanced in the next update. Excel export completed instead.');
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      if (result?.success) {
        alert(`Payment analytics exported successfully as ${format?.toUpperCase()}\nFile: ${result?.filename}`);
      } else {
        throw new Error(result?.error || 'Export failed');
      }
    } catch (error) {
      console.error('Payment analytics export error:', error);
      alert(`Export failed: ${error?.message}`);
    }
  };

  const renderChart = () => {
    switch (analyticsType) {
      case 'patterns':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Patterns by Payment Method</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={transactionPatternsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="online" fill="#3B82F6" name="Online Payment" />
                <Bar dataKey="bank" fill="#10B981" name="Bank Transfer" />
                <Bar dataKey="cash" fill="#F59E0B" name="Cash Payment" />
                <Bar dataKey="transfer" fill="#EF4444" name="Mobile Transfer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'methods':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method Preferences</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodsData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                {paymentMethodsData?.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: method?.color }}
                      ></div>
                      <span className="font-medium text-foreground">{method?.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{method?.value}%</div>
                      <div className="text-sm text-muted-foreground">of transactions</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'reconciliation':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Reconciliation Report</h3>
            <div className="space-y-4 mb-6">
              {reconciliationData?.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium text-foreground">
                      {new Date(item.date)?.toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Expected</div>
                    <div className="font-medium text-foreground">{formatCurrency(item?.expected)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Actual</div>
                    <div className="font-medium text-foreground">{formatCurrency(item?.actual)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Variance</div>
                    <div className={`font-medium ${item?.variance >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {item?.variance >= 0 ? '+' : ''}{formatCurrency(item?.variance)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">Total Variance</h4>
                  <p className="text-sm text-muted-foreground">This period</p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(reconciliationData?.reduce((sum, item) => sum + item?.variance, 0))}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white p-6 rounded-lg border border-border text-center">
            <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Select Analytics Type</h3>
            <p className="text-muted-foreground">Choose an analytics type to view payment data visualization</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Analytics Type"
            options={analyticsTypeOptions}
            value={analyticsType}
            onChange={setAnalyticsType}
          />
          <Select
            label="Period"
            options={periodOptions}
            value={period}
            onChange={setPeriod}
          />
          <Select
            label="Payment Status"
            options={[
              { value: '', label: 'All Payments' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' }
            ]}
            value=""
            onChange={() => {}}
          />
        </div>
      </div>

      {/* Payment Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold text-foreground">2,845</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="CreditCard" size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+12.5% this month</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold text-foreground">97.8%</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+1.2% improvement</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Transaction</p>
              <p className="text-2xl font-bold text-foreground">₦425K</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="DollarSign" size={24} className="text-warning" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">Per transaction</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed Payments</p>
              <p className="text-2xl font-bold text-foreground">62</p>
            </div>
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={24} className="text-destructive" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-destructive">-8.3% vs last month</span>
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      {renderChart()}

      {/* Real-time Payment Status */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Real-time Payment Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live updates</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Transaction ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Student</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Method</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-foreground">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/30">
                <td className="px-6 py-4 text-sm font-medium text-foreground">#TXN-001234</td>
                <td className="px-6 py-4 text-sm text-foreground">Emma Johnson</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">₦500,000</td>
                <td className="px-6 py-4 text-sm text-foreground">Online Payment</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success">
                    Success
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">2 min ago</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="px-6 py-4 text-sm font-medium text-foreground">#TXN-001235</td>
                <td className="px-6 py-4 text-sm text-foreground">Michael Chen</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">₦350,000</td>
                <td className="px-6 py-4 text-sm text-foreground">Bank Transfer</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning">
                    Processing
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">5 min ago</td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="px-6 py-4 text-sm font-medium text-foreground">#TXN-001236</td>
                <td className="px-6 py-4 text-sm text-foreground">Sarah Williams</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">₦420,000</td>
                <td className="px-6 py-4 text-sm text-foreground">Mobile Money</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-destructive/10 text-destructive">
                    Failed
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">8 min ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex justify-end space-x-3">
        <ExportDropdown
          onExport={handleExportAnalytics}
          variant="outline"
          size="default"
          exportTitle="Export Analytics"
          recordCount={
            analyticsType === 'patterns' ? transactionPatternsData?.length :
            analyticsType === 'methods' ? paymentMethodsData?.length :
            analyticsType === 'reconciliation' ? reconciliationData?.length : 0
          }
        />
      </div>
    </div>
  );
};

export default PaymentAnalyticsTab;