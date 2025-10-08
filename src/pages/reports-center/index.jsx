import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ExportDropdown from '../../components/ui/ExportDropdown';
import exportService from '../../services/exportService';

// Import reports center components
import FinancialReportsTab from './components/FinancialReportsTab';
import PaymentAnalyticsTab from './components/PaymentAnalyticsTab';
import ReportBuilderModal from './components/ReportBuilderModal';

const ReportsCenter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('financial');
  const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);
  const [globalFilters, setGlobalFilters] = useState({
    dateRange: '30days',
    class: '',
    term: 'current'
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleGlobalFilterChange = (filterType, value) => {
    setGlobalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleExportAll = async (format) => {
    try {
      // Get mock data for all reports - this would normally come from API
      const allReportsData = {
        financial: [
          { reportType: 'Revenue Analysis', amount: 320000000, period: 'Current Term', status: 'Generated' },
          { reportType: 'Outstanding Fees', amount: 19900000, period: 'Current Term', status: 'Pending' },
          { reportType: 'Collection Rate', percentage: 94.2, target: 95.0, status: 'On Track' },
          { reportType: 'Net Profit', amount: 201000000, margin: 62.8, status: 'Healthy' }
        ],
        analytics: [
          { metric: 'Total Transactions', value: 2845, growth: 12.5, status: 'Increasing' },
          { metric: 'Success Rate', value: 97.8, target: 95.0, status: 'Above Target' },
          { metric: 'Average Transaction', value: 425000, currency: 'NGN', status: 'Stable' },
          { metric: 'Failed Payments', value: 62, reduction: -8.3, status: 'Improving' }
        ]
      };

      // Combine all report data for tabular formats
      const combinedData = [
        ...allReportsData?.financial?.map(item => ({
          'Report Category': 'Financial Reports',
          'Report Type': item?.reportType,
          'Value': typeof item?.amount !== 'undefined' ? `₦${(item?.amount / 1000000)?.toFixed(1)}M` : 
                 typeof item?.percentage !== 'undefined' ? `${item?.percentage}%` : 'N/A',
          'Additional Info': item?.margin ? `${item?.margin}% margin` : 
                           item?.target ? `Target: ${item?.target}%` : '',
          'Status': item?.status,
          'Period': item?.period || 'Current Term',
          'Generated Date': new Date()?.toLocaleDateString('en-GB')
        })),
        ...allReportsData?.analytics?.map(item => ({
          'Report Category': 'Payment Analytics',
          'Report Type': item?.metric,
          'Value': typeof item?.value === 'number' ? 
                  (item?.currency === 'NGN' ? `₦${item?.value?.toLocaleString()}` : 
                   item?.metric?.includes('Rate') || item?.metric?.includes('Percentage') ? `${item?.value}%` : 
                   item?.value?.toLocaleString()) : item?.value,
          'Additional Info': item?.growth ? `+${item?.growth}% growth` : 
                           item?.reduction ? `${item?.reduction}% change` : 
                           item?.target ? `Target: ${item?.target}%` : '',
          'Status': item?.status,
          'Period': 'Current Term',
          'Generated Date': new Date()?.toLocaleDateString('en-GB')
        }))
      ];

      let result;

      // Handle different export formats
      switch (format?.toLowerCase()) {
        case 'pdf':
          result = await exportService?.exportReportSummaryToPDF(allReportsData, { 
            filename: 'All_Reports_Summary',
            includeTimestamp: true,
            reportTitle: 'Financial Reports Center - Complete Summary'
          });
          break;
        case 'excel':
          result = await exportService?.exportToExcel(combinedData, { 
            filename: 'All_Reports_Summary',
            includeTimestamp: true 
          });
          break;
        case 'csv':
          result = await exportService?.exportToCSV(combinedData, { 
            filename: 'All_Reports_Summary',
            includeTimestamp: true 
          });
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      if (result?.success) {
        alert(`Successfully exported all reports as ${format?.toUpperCase()}\nFile: ${result?.filename}`);
      } else {
        throw new Error(result?.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error?.message}`);
    }
  };

  const handleOpenReportBuilder = () => {
    setIsReportBuilderOpen(true);
  };

  const handleCloseReportBuilder = () => {
    setIsReportBuilderOpen(false);
  };

  // Mock user data
  const currentUser = {
    name: 'Sarah Mitchell',
    role: 'School Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  const tabs = [
    {
      id: 'financial',
      label: 'Financial Reports',
      icon: 'DollarSign',
      component: FinancialReportsTab
    },
    {
      id: 'payment',
      label: 'Payment Analytics',
      icon: 'CreditCard',
      component: PaymentAnalyticsTab
    }
  ];

  const ActiveTabComponent = tabs?.find(tab => tab?.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <Breadcrumb customItems={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Reports', href: '/reports' },
              { label: 'Financial Reports Center' }
            ]} />
            
            <PageHeader
              title="Financial Reports Center"
              subtitle="Comprehensive financial analytics hub providing detailed insights into revenue, payments, and financial performance"
              icon="BarChart3"
              actions={
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <ExportDropdown
                    onExport={handleExportAll}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    exportTitle="Export All"
                    recordCount={8}
                  />
                  <Button size="sm" className="w-full sm:w-auto" onClick={handleOpenReportBuilder}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Create Custom Report
                  </Button>
                </div>
              }
            />

            {/* Tab Navigation */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="border-b border-border">
                <nav className="flex space-x-0" aria-label="Tabs">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`
                        relative flex items-center space-x-2 px-4 sm:px-6 py-4 text-sm font-medium transition-colors duration-200
                        ${activeTab === tab?.id
                          ? 'text-primary bg-primary/5 border-b-2 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }
                      `}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="hidden sm:inline">{tab?.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {ActiveTabComponent && (
                  <ActiveTabComponent 
                    globalFilters={globalFilters}
                    onGlobalFilterChange={handleGlobalFilterChange}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Report Builder Modal */}
      {isReportBuilderOpen && (
        <ReportBuilderModal onClose={handleCloseReportBuilder} />
      )}
    </div>
  );
};

export default ReportsCenter;