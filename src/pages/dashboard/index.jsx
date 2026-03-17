import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
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

  return (
    <div className="min-h-screen bg-background elegant-scroll">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8">
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

            <div className="flex justify-start">
              <DateRangeFilter onFilterChange={handleDateRangeChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {dashboardData?.kpis?.map((kpi, index) => (
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
