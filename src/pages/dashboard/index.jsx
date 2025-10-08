import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import dashboard components
import KPICard from './components/KPICard';
import MonthlyRevenueChart from './components/MonthlyRevenueChart';
import PayByClassChart from './components/PayByClassChart';
import PriorityInvoicesTable from './components/PriorityInvoicesTable';
import InvoiceStatusChart from './components/InvoiceStatusChart';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import DateRangeFilter from './components/DateRangeFilter';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('7days');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
    // Here you would typically refetch data based on the selected range
    console.log('Date range changed to:', range);
  };

  // Mock user data
  const currentUser = {
    name: 'Sarah Mitchell',
    role: 'School Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  // KPI data
  const kpiData = [
    {
      title: 'Total Students',
      value: '1,420',
      change: '+5.2%',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Outstanding Fees',
      value: '₦48,250',
      change: '-12.3%',
      changeType: 'positive',
      icon: 'Banknote',
      color: 'warning'
    },
    {
      title: 'Monthly Revenue',
      value: '₦58,000',
      change: '+8.1%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: 'Collection Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Target',
      color: 'accent'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Fixed spacing with consistent gap */}
          <div className="space-y-6">
            <Breadcrumb customItems={[]} />
            
            <PageHeader
              title="Dashboard"
              subtitle="Welcome back! Here's what's happening at your school today."
              icon="BarChart3"
              actions={
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Icon name="Download" size={16} className="mr-2" />
                    Export Report
                  </Button>
                  <Button size="sm" className="w-full sm:w-auto">
                    <Icon name="RefreshCw" size={16} className="mr-2" />
                    Refresh Data
                  </Button>
                </div>
              }
            />

            {/* Date Range Filter - Improved alignment */}
            <div className="flex justify-start">
              <DateRangeFilter onFilterChange={handleDateRangeChange} />
            </div>

            {/* KPI Cards - Fixed grid alignment with consistent heights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {kpiData?.map((kpi, index) => (
                <div key={index} className="h-full">
                  <KPICard
                    title={kpi?.title}
                    value={kpi?.value}
                    change={kpi?.change}
                    changeType={kpi?.changeType}
                    icon={kpi?.icon}
                    color={kpi?.color}
                  />
                </div>
              ))}
            </div>

            {/* Charts Section - Updated layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Collection Trend Chart - 2 columns on large screens */}
              <div className="lg:col-span-2">
                <div className="min-h-[400px]">
                  <MonthlyRevenueChart />
                </div>
              </div>
              
              {/* Invoice Status Chart - 1 column on large screens */}
              <div className="lg:col-span-1">
                <div className="min-h-[400px]">
                  <InvoiceStatusChart />
                </div>
              </div>
            </div>

            {/* Pay by Class Chart - Above Priority Invoices */}
            <div className="w-full">
              <div className="min-h-[400px]">
                <PayByClassChart />
              </div>
            </div>

            {/* Priority Invoices Section - Full Width */}
            <div className="w-full">
              <PriorityInvoicesTable />
            </div>

            {/* Bottom Section - Fixed alignment and consistent heights */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="min-h-[500px]">
                <RecentActivity />
              </div>
              <div className="min-h-[500px]">
                <QuickActions />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;