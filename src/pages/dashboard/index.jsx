import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

import KPICard from './components/KPICard';
import MonthlyRevenueChart from './components/MonthlyRevenueChart';
import PayByClassChart from './components/PayByClassChart';
import PriorityInvoicesTable from './components/PriorityInvoicesTable';
import InvoiceStatusChart from './components/InvoiceStatusChart';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import DateRangeFilter from './components/DateRangeFilter';
import dashboardService from '../../services/dashboardService';
import { getUser } from '../../utils/storage';

const defaultKpis = [
  {
    title: 'Total Students',
    value: '560',
    change: '+5.2%',
    changeType: 'positive',
    icon: 'Users',
    color: 'primary'
  },
  {
    title: 'Outstanding Fees',
    value: '\u20a62,108,000',
    change: '-12.3%',
    changeType: 'negative',
    icon: 'Banknote',
    color: 'warning'
  },
  {
    title: 'Total Fees Paid',
    value: '\u20a65,198,000',
    change: '+8.1%',
    changeType: 'positive',
    icon: 'TrendingUp',
    color: 'success'
  },
  {
    title: 'Over Due Payments',
    value: '234',
    change: '+5',
    changeType: 'negative',
    icon: 'Clock3',
    color: 'error'
  }
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('7days');
  const [dashboardData, setDashboardData] = useState({
    kpis: [],
    monthlyRevenue: [],
    invoiceStatus: [],
    payByClass: [],
    priorityInvoices: [],
    recentActivity: []
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService?.getDashboardData(selectedDateRange);
        setDashboardData({
          kpis: data?.kpis || [],
          monthlyRevenue: data?.monthlyRevenue || [],
          invoiceStatus: data?.invoiceStatus || [],
          payByClass: data?.payByClass || [],
          priorityInvoices: data?.priorityInvoices || [],
          recentActivity: data?.recentActivity || []
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setDashboardData({
          kpis: [],
          monthlyRevenue: [],
          invoiceStatus: [],
          payByClass: [],
          priorityInvoices: [],
          recentActivity: []
        });
      }
    };

    loadDashboard();
  }, [selectedDateRange]);

  const storedUser = getUser();
  const currentUser = storedUser ? {
    name: `${storedUser?.firstName || ''} ${storedUser?.lastName || ''}`?.trim() || storedUser?.email,
    role: storedUser?.role,
    avatar: storedUser?.avatar ?? "/default-avatar.png"
  } : null;
  const kpis = dashboardData?.kpis?.length ? dashboardData?.kpis : defaultKpis;

  return (
    <div className="min-h-screen bg-background elegant-scroll">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />

        <main className="p-4 sm:p-5 lg:p-6">
          <div className="space-y-5">
            <PageHeader
              title="Dashboard"
              subtitle="Welcome to Skupadi. Let's get your school ready to receive payments."
              className="mb-0"
              actions={
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button variant="outline" size="xs" className="w-full sm:w-auto h-8 px-3 text-xs bg-card">
                    <Icon name="Download" size={13} className="mr-2" />
                    Export Report
                  </Button>
                  <Button size="xs" className="w-full sm:w-auto h-8 px-3 text-xs">
                    <Icon name="RefreshCw" size={13} className="mr-2" />
                    Refresh Data
                  </Button>
                </div>
              }
            />

            <div className="flex justify-start mt-4 ">
              <DateRangeFilter onFilterChange={handleDateRangeChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-4 gap-5">
              {kpis?.map((kpi, index) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="min-h-[400px]">
                  <MonthlyRevenueChart data={dashboardData?.monthlyRevenue} />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="min-h-[400px]">
                  <InvoiceStatusChart data={dashboardData?.invoiceStatus} />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="min-h-[400px]">
                <PayByClassChart data={dashboardData?.payByClass} />
              </div>
            </div>

            <div className="w-full">
              <PriorityInvoicesTable invoices={dashboardData?.priorityInvoices} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="min-h-[500px]">
                <RecentActivity activities={dashboardData?.recentActivity} />
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
