import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import ExportDropdown from '../../components/ui/ExportDropdown';
import InvoiceSummaryCards from './components/InvoiceSummaryCards';
import InvoiceFilters from './components/InvoiceFilters';
import InvoiceTable from './components/InvoiceTable';
import SpecialInvoiceTab from './components/SpecialInvoiceTab';
import exportService from '../../services/exportService';

const InvoicesManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('regular'); // 'regular' or 'special'
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'desc' });

  // Mock data - in a real app, this would come from API/database
  const allInvoices = [
    {
      id: "INV-2025-001",
      studentName: "Emma Johnson",
      studentId: "STU-001",
      amount: 500000.00,
      dueDate: "2025-01-15",
      issueDate: "2024-12-15",
      status: "paid",
      class: "Grade 10",
      paymentDate: "2025-01-10"
    },
    {
      id: "INV-2025-002",
      studentName: "Michael Chen",
      studentId: "STU-002",
      amount: 580000.00,
      dueDate: "2025-01-20",
      issueDate: "2024-12-20",
      status: "overdue",
      class: "Grade 11",
      paymentDate: null
    },
    {
      id: "INV-2025-003",
      studentName: "Sarah Williams",
      studentId: "STU-003",
      amount: 540000.00,
      dueDate: "2025-01-25",
      issueDate: "2024-12-25",
      status: "pending",
      class: "Grade 9",
      paymentDate: null
    },
    {
      id: "INV-2025-004",
      studentName: "David Rodriguez",
      studentId: "STU-004",
      amount: 480000.00,
      dueDate: "2025-01-30",
      issueDate: "2024-12-30",
      status: "paid",
      class: "Grade 12",
      paymentDate: "2025-01-28"
    },
    {
      id: "INV-2025-005",
      studentName: "Lisa Anderson",
      studentId: "STU-005",
      amount: 560000.00,
      dueDate: "2025-02-05",
      issueDate: "2025-01-05",
      status: "pending",
      class: "Grade 8",
      paymentDate: null
    },
    {
      id: "INV-2025-006",
      studentName: "James Wilson",
      studentId: "STU-006",
      amount: 520000.00,
      dueDate: "2025-02-10",
      issueDate: "2025-01-10",
      status: "overdue",
      class: "Grade 7",
      paymentDate: null
    },
    {
      id: "INV-2025-007",
      studentName: "Maria Garcia",
      studentId: "STU-007",
      amount: 600000.00,
      dueDate: "2025-02-15",
      issueDate: "2025-01-15",
      status: "paid",
      class: "Grade 6",
      paymentDate: "2025-02-12"
    },
    {
      id: "INV-2025-008",
      studentName: "Robert Taylor",
      studentId: "STU-008",
      amount: 500000.00,
      dueDate: "2025-02-20",
      issueDate: "2025-01-20",
      status: "pending",
      class: "Grade 5",
      paymentDate: null
    },
    {
      id: "INV-2025-009",
      studentName: "Jessica Brown",
      studentId: "STU-009",
      amount: 450000.00,
      dueDate: "2025-02-25",
      issueDate: "2025-01-25",
      status: "overdue",
      class: "Grade 4",
      paymentDate: null
    },
    {
      id: "INV-2025-010",
      studentName: "Kevin Davis",
      studentId: "STU-010",
      amount: 620000.00,
      dueDate: "2025-03-01",
      issueDate: "2025-02-01",
      status: "pending",
      class: "Grade 3",
      paymentDate: null
    }
  ];

  // Apply filters and sorting to get filtered invoices
  const filteredInvoices = useMemo(() => {
    let filtered = [...allInvoices];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(invoice =>
        invoice?.id?.toLowerCase()?.includes(searchTerm) ||
        invoice?.studentName?.toLowerCase()?.includes(searchTerm) ||
        invoice?.studentId?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters?.status) {
      filtered = filtered?.filter(invoice => invoice?.status === filters?.status);
    }

    // Apply class filter
    if (filters?.class) {
      const classValue = filters?.class?.toLowerCase();
      filtered = filtered?.filter(invoice => 
        invoice?.class?.toLowerCase()?.includes(classValue?.replace('-', ' '))
      );
    }

    // Apply amount range filter
    if (filters?.amountRange) {
      filtered = filtered?.filter(invoice => {
        const amount = invoice?.amount || 0;
        switch (filters?.amountRange) {
          case '0-100':
            return amount >= 0 && amount <= 100000;
          case '100-500':
            return amount > 100000 && amount <= 500000;
          case '500-1000':
            return amount > 500000 && amount <= 1000000;
          case '1000-5000':
            return amount > 1000000 && amount <= 5000000;
          case '5000+':
            return amount > 5000000;
          default:
            return true;
        }
      });
    }

    // Apply date range filter
    if (filters?.dateRange) {
      const today = new Date();
      const todayStr = today?.toISOString()?.split('T')?.[0];
      
      filtered = filtered?.filter(invoice => {
        const invoiceDate = new Date(invoice?.dueDate);
        const invoiceDateStr = invoiceDate?.toISOString()?.split('T')?.[0];
        
        switch (filters?.dateRange) {
          case 'today':
            return invoiceDateStr === todayStr;
          case 'week':
            const weekAgo = new Date(today?.getTime() - 7 * 24 * 60 * 60 * 1000);
            return invoiceDate >= weekAgo && invoiceDate <= today;
          case 'month':
            const monthAgo = new Date(today?.getFullYear(), today?.getMonth() - 1, today?.getDate());
            return invoiceDate >= monthAgo && invoiceDate <= today;
          case 'quarter':
            const quarterAgo = new Date(today?.getFullYear(), today?.getMonth() - 3, today?.getDate());
            return invoiceDate >= quarterAgo && invoiceDate <= today;
          case 'year':
            const yearAgo = new Date(today?.getFullYear() - 1, today?.getMonth(), today?.getDate());
            return invoiceDate >= yearAgo && invoiceDate <= today;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aVal = a?.[sortConfig?.key];
        let bVal = b?.[sortConfig?.key];

        // Handle different data types
        if (sortConfig?.key === 'amount') {
          aVal = Number(aVal) || 0;
          bVal = Number(bVal) || 0;
        } else if (sortConfig?.key === 'dueDate' || sortConfig?.key === 'issueDate') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        } else if (typeof aVal === 'string') {
          aVal = aVal?.toLowerCase();
          bVal = bVal?.toLowerCase();
        }

        if (aVal < bVal) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [filters, sortConfig]);

  const user = {
    name: "Sarah Johnson",
    role: "Finance Administrator"
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters applied:', newFilters);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    console.log('Sort applied:', { key, direction });
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log('Bulk action:', action, selectedIds);
  };

  const handleBulkPDFGeneration = async () => {
    try {
      // Import PDF service dynamically
      const { default: pdfGenerationService } = await import('../../services/pdfGenerationService');
      
      // Generate PDFs for all invoices
      let result = await pdfGenerationService?.generateBulkInvoicePDFs(filteredInvoices, {
        download: true
      });

      if (result?.success) {
        // Show success notification
        if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
          new Notification('Bulk PDF Generation Complete', {
            body: `Generated ${result?.successCount} invoice PDFs successfully`,
            icon: '/favicon.ico'
          });
        }
        
        console.log('Bulk PDF generation completed:', result);
      } else {
        console.error('Bulk PDF generation failed:', result?.error);
      }
    } catch (error) {
      console.error('Error in bulk PDF generation:', error);
    }
  };

  const handleExport = async (format) => {
    try {
      let result;
      const exportData = activeTab === 'regular' ? filteredInvoices : []; // Special invoices would come from SpecialInvoiceTab

      if (activeTab === 'regular') {
        result = await exportService?.exportRegularInvoices(exportData, format, {
          filename: 'Regular_Invoices',
          includeTimestamp: true
        });
      } else {
        // For special invoices, this would be handled in the SpecialInvoiceTab component
        result = { success: false, error: 'Special invoices export handled in tab component' };
      }

      if (result?.success) {
        // Show success notification
        if (typeof Notification !== 'undefined' && Notification?.permission === 'granted') {
          new Notification('Export Complete', {
            body: `Successfully exported ${result?.recordCount} invoices as ${format?.toUpperCase()}`,
            icon: '/favicon.ico'
          });
        }
        console.log('Export completed:', result);
      } else {
        console.error('Export failed:', result?.error);
        alert(`Export failed: ${result?.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export error: ${error?.message}`);
    }
  };

  const getActiveFiltersCount = () => {
    return Object?.values(filters)?.filter(value => value && value !== '')?.length;
  };

  const pageHeaderActions = (
    <div className="flex items-center space-x-3">
      <ExportDropdown
        onExport={handleExport}
        recordCount={filteredInvoices?.length}
        exportTitle="Export All"
        variant="outline"
      />
      <Button 
        variant="outline" 
        iconName="FileText" 
        iconSize={16}
        onClick={handleBulkPDFGeneration}
      >
        Generate All PDFs
      </Button>
      <Button variant="outline" iconName="Settings" iconSize={16}>
        Bulk Actions
      </Button>
      <Link to="/create-invoice">
        <Button variant="default" iconName="Plus" iconSize={16}>
          Create Invoice
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:ml-64">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={user} />
        
        <main className="p-6">
          <Breadcrumb customItems={[]} />
          
          <PageHeader
            title="Invoices Management"
            subtitle="Manage student invoices, track payments, and monitor billing status"
            icon="FileText"
            actions={pageHeaderActions}
          />

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('regular')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'regular' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  Regular Invoices
                </button>
                <button
                  onClick={() => setActiveTab('special')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'special' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  Special Invoices
                  <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'regular' ? (
            <>
              <InvoiceSummaryCards />

              <InvoiceFilters
                onFiltersChange={handleFiltersChange}
                activeFiltersCount={getActiveFiltersCount()}
              />

              <InvoiceTable
                invoices={filteredInvoices}
                onSort={handleSort}
                sortConfig={sortConfig}
                onBulkAction={handleBulkAction}
              />
            </>
          ) : (
            <SpecialInvoiceTab />
          )}
        </main>
      </div>
    </div>
  );
};

export default InvoicesManagement;