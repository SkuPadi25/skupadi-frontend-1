import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import exportService from '../../../services/exportService';
import ExportDropdown from '../../../components/ui/ExportDropdown';


const FinancialReportsTab = ({ globalFilters, onGlobalFilterChange }) => {
  const [reportType, setReportType] = useState('revenue');
  const [timeframe, setTimeframe] = useState('monthly');

  // Mock recent transaction data for export
  const recentTransactions = [
    {
      date: 'Jan 15, 2025',
      type: 'Fee Payment',
      description: 'Tuition - Grade 10 - Emma Johnson',
      amount: 500000,
      status: 'Completed'
    },
    {
      date: 'Jan 14, 2025',
      type: 'Expense',
      description: 'Office Supplies Purchase',
      amount: -85000,
      status: 'Processed'
    },
    {
      date: 'Jan 13, 2025',
      type: 'Fee Payment',
      description: 'Books - Grade 8 - Michael Chen',
      amount: 120000,
      status: 'Pending'
    },
    {
      date: 'Jan 12, 2025',
      type: 'Fee Payment',
      description: 'Uniform - Grade 5 - Sarah Wilson',
      amount: 75000,
      status: 'Completed'
    },
    {
      date: 'Jan 11, 2025',
      type: 'Expense',
      description: 'Maintenance - Science Lab Equipment',
      amount: -150000,
      status: 'Processed'
    },
    {
      date: 'Jan 10, 2025',
      type: 'Fee Payment',
      description: 'Extracurricular - Grade 12 - David Brown',
      amount: 45000,
      status: 'Completed'
    }
  ];

  // Mock revenue data
  const revenueData = [
    { month: 'Jan', revenue: 45000000, expenses: 18000000, profit: 27000000 },
    { month: 'Feb', revenue: 52000000, expenses: 19500000, profit: 32500000 },
    { month: 'Mar', revenue: 48000000, expenses: 17800000, profit: 30200000 },
    { month: 'Apr', revenue: 55000000, expenses: 20200000, profit: 34800000 },
    { month: 'May', revenue: 58000000, expenses: 21000000, profit: 37000000 },
    { month: 'Jun', revenue: 62000000, expenses: 22300000, profit: 39700000 }
  ];

  // Mock outstanding fees data
  const outstandingData = [
    { class: 'Grade 1', outstanding: 2500000, students: 45 },
    { class: 'Grade 2', outstanding: 3200000, students: 52 },
    { class: 'Grade 3', outstanding: 2800000, students: 48 },
    { class: 'Grade 4', outstanding: 3500000, students: 55 },
    { class: 'Grade 5', outstanding: 4100000, students: 62 },
    { class: 'Grade 6', outstanding: 3800000, students: 58 }
  ];

  // Mock collection rate data
  const collectionData = [
    { month: 'Jan', rate: 92.5, target: 95 },
    { month: 'Feb', rate: 94.2, target: 95 },
    { month: 'Mar', rate: 91.8, target: 95 },
    { month: 'Apr', rate: 96.1, target: 95 },
    { month: 'May', rate: 94.7, target: 95 },
    { month: 'Jun', rate: 97.3, target: 95 }
  ];

  const reportTypeOptions = [
    { value: 'revenue', label: 'Revenue Analysis' },
    { value: 'outstanding', label: 'Outstanding Fees' },
    { value: 'collection', label: 'Collection Rate' },
    { value: 'expense', label: 'Expense Breakdown' }
  ];

  const timeframeOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const handleExportTransactions = async (format) => {
    try {
      // Prepare transaction data for export
      let exportData = recentTransactions?.map(transaction => ({
        'Date': transaction?.date,
        'Transaction Type': transaction?.type,
        'Description': transaction?.description,
        'Amount': transaction?.amount >= 0 ? 
          `₦${transaction?.amount?.toLocaleString()}` : 
          `-₦${Math.abs(transaction?.amount)?.toLocaleString()}`,
        'Status': transaction?.status,
        'Transaction ID': `TXN-${Math.random()?.toString(36)?.substr(2, 9)?.toUpperCase()}`,
        'Export Date': new Date()?.toLocaleDateString('en-GB')
      }));

      let result;
      const filename = `Financial_Transactions_Report`;

      switch (format?.toLowerCase()) {
        case 'pdf':
          result = await exportService?.exportReportSummaryToPDF({
            financial: exportData
          }, { 
            filename,
            reportTitle: 'Recent Financial Transactions Report'
          });
          break;
        case 'excel':
          result = await exportService?.exportToExcel(exportData, { filename });
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      if (result?.success) {
        alert(`Financial transactions exported successfully as ${format?.toUpperCase()}\nFile: ${result?.filename}`);
      } else {
        throw new Error(result?.error || 'Export failed');
      }
    } catch (error) {
      console.error('Transaction export error:', error);
      alert(`Export failed: ${error?.message}`);
    }
  };

  const handleExportReport = async (format) => {
    try {
      // Get current report data based on reportType
      let exportData = [];
      
      switch (reportType) {
        case 'revenue':
          exportData = revenueData?.map(item => ({
            'Month': item?.month,
            'Revenue': `₦${(item?.revenue / 1000000)?.toFixed(1)}M`,
            'Expenses': `₦${(item?.expenses / 1000000)?.toFixed(1)}M`,
            'Profit': `₦${(item?.profit / 1000000)?.toFixed(1)}M`,
            'Profit Margin': `${((item?.profit / item?.revenue) * 100)?.toFixed(1)}%`,
            'Report Type': 'Revenue Analysis'
          }));
          break;
          
        case 'outstanding':
          exportData = outstandingData?.map(item => ({
            'Class': item?.class,
            'Outstanding Amount': `₦${(item?.outstanding / 1000000)?.toFixed(2)}M`,
            'Number of Students': item?.students,
            'Average Outstanding': `₦${(item?.outstanding / item?.students / 1000)?.toFixed(0)}K`,
            'Report Type': 'Outstanding Fees'
          }));
          break;
          
        case 'collection':
          exportData = collectionData?.map(item => ({
            'Month': item?.month,
            'Collection Rate': `${item?.rate}%`,
            'Target Rate': `${item?.target}%`,
            'Variance': `${(item?.rate - item?.target)?.toFixed(1)}%`,
            'Performance': item?.rate >= item?.target ? 'Above Target' : 'Below Target',
            'Report Type': 'Collection Rate'
          }));
          break;
          
        default:
          exportData = [
            { 'Report': 'Financial Summary', 'Status': 'Please select a specific report type' }
          ];
      }

      let result;
      const filename = `Financial_${reportType?.charAt(0)?.toUpperCase() + reportType?.slice(1)}_Report`;
      
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
        alert(`Financial report exported successfully as ${format?.toUpperCase()}\nFile: ${result?.filename}`);
      } else {
        throw new Error(result?.error || 'Export failed');
      }
    } catch (error) {
      console.error('Financial report export error:', error);
      alert(`Export failed: ${error?.message}`);
    }
  };

  const renderChart = () => {
    switch (reportType) {
      case 'revenue':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue vs Expenses Analysis</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₦${(value / 1000000)?.toFixed(0)}M`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  labelStyle={{ color: '#000' }}
                />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'outstanding':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Outstanding Fees by Class</h3>
            <div className="space-y-4">
              {outstandingData?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item?.class}</h4>
                    <p className="text-sm text-muted-foreground">{item?.students} students</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">{formatCurrency(item?.outstanding)}</div>
                    <div className="text-sm text-muted-foreground">Outstanding</div>
                  </div>
                  <div className="ml-4">
                    <Button size="sm" variant="outline">
                      Send Reminder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-warning/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">Total Outstanding</h4>
                  <p className="text-sm text-muted-foreground">Across all classes</p>
                </div>
                <div className="text-2xl font-bold text-warning">
                  {formatCurrency(outstandingData?.reduce((sum, item) => sum + item?.outstanding, 0))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'collection':
        return (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Collection Rate vs Target</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={collectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[85, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Collection Rate"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#EF4444" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return (
          <div className="bg-white p-6 rounded-lg border border-border text-center">
            <Icon name="Banknote" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Select a Financial Report</h3>
            <p className="text-muted-foreground">Choose a report type to view financial data visualization</p>
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
            label="Report Type"
            options={reportTypeOptions}
            value={reportType}
            onChange={setReportType}
          />
          <Select
            label="Timeframe"
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
          />
          <Select
            label="Academic Term"
            options={[
              { value: 'current', label: 'Current Term' },
              { value: 'term1', label: 'Term 1' },
              { value: 'term2', label: 'Term 2' },
              { value: 'term3', label: 'Term 3' }
            ]}
            value={globalFilters?.term || 'current'}
            onChange={(value) => onGlobalFilterChange?.('term', value)}
          />
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">₦320M</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-success" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+8.1% from last period</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Outstanding Fees</p>
              <p className="text-2xl font-bold text-foreground">₦19.9M</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={24} className="text-warning" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-destructive">-12.3% improvement</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold text-foreground">94.2%</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Target" size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+2.1% vs target</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className="text-2xl font-bold text-foreground">₦201M</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name="Banknote" size={24} className="text-accent" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-success">+15.4% profit margin</span>
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      {renderChart()}

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Financial Transactions</h3>
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportTransactions('pdf')}
              className="flex items-center space-x-2"
            >
              <Icon name="FileText" size={16} />
              <span>Export as PDF</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportTransactions('excel')}
              className="flex items-center space-x-2"
            >
              <Icon name="FileSpreadsheet" size={16} />
              <span>Export as Excel</span>
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">Description</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-foreground">Amount</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTransactions?.map((transaction, index) => (
                <tr key={index} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm text-foreground">{transaction?.date}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{transaction?.type}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{transaction?.description}</td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${
                    transaction?.amount >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction?.amount >= 0 ? 
                      `₦${transaction?.amount?.toLocaleString()}` : 
                      `-₦${Math.abs(transaction?.amount)?.toLocaleString()}`
                    }
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      transaction?.status === 'Completed' ? 'bg-success/10 text-success' :
                      transaction?.status === 'Pending'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                    }`}>
                      {transaction?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex justify-end space-x-3">
        <ExportDropdown
          onExport={handleExportReport}
          variant="outline"
          size="default"
          exportTitle="Export Report"
          recordCount={
            reportType === 'revenue' ? revenueData?.length :
            reportType === 'outstanding' ? outstandingData?.length :
            reportType === 'collection' ? collectionData?.length : 0
          }
        />
      </div>
    </div>
  );
};

export default FinancialReportsTab;