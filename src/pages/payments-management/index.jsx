import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import payment management components
import PaymentSummaryCards from './components/PaymentSummaryCards';
import PaymentFilters from './components/PaymentFilters';
import PaymentTable from './components/PaymentTable';
import PaymentDetailsModal from './components/PaymentDetailsModal';
import ReceiptsTable from './components/ReceiptsTable';
import ReceiptModal from './components/ReceiptModal';
import RecordPaymentModal from './components/RecordPaymentModal';

// Import receipt service
import receiptService from '../../services/receiptService';

const PaymentsManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('payments');
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    dateRange: '',
    amountRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPayment(null);
  };

  const handleViewReceipt = async (receipt) => {
    try {
      // Load current school configuration for branding
      const schoolConfig = await loadSchoolBrandingConfiguration();
      
      // Get branded receipt data with current school configuration
      const brandedReceipt = receiptService?.getBrandedReceiptForDisplay(receipt?.id, schoolConfig);
      
      setSelectedReceipt(brandedReceipt || receipt);
      setIsReceiptModalOpen(true);
    } catch (error) {
      console.error('Error loading receipt with branding:', error);
      // Fallback to original receipt if branding fails
      setSelectedReceipt(receipt);
      setIsReceiptModalOpen(true);
    }
  };

  // Add this missing function
  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedReceipt(null);
  };

  // Load school branding configuration (this would typically come from settings/database)
  const loadSchoolBrandingConfiguration = async () => {
    try {
      // In a real application, this would fetch from your settings/database
      // For now, we'll use localStorage or a default configuration
      const storedConfig = localStorage.getItem('school_branding_config');
      
      if (storedConfig) {
        return JSON.parse(storedConfig);
      }

      // Default school branding configuration
      return {
        schoolName: 'EduFinance Academy',
        schoolEmail: 'info@edufinance.academy',
        schoolPhone: '+234-XXX-XXXX',
        streetName: '123 Education Street',
        city: 'Lagos',
        localGovernment: 'Lagos Island',
        state: 'Lagos State',
        receiptBrandingEnabled: true,
        receiptColorScheme: 'blue',
        receiptTemplate: 'standard',
        receiptElements: {
          studentName: true,
          studentId: true,
          studentClass: true,
          parentInfo: false,
          schoolName: true,
          schoolAddress: true,
          schoolEmail: true,
          schoolPhone: true,
          invoiceNumber: true,
          issueDate: true,
          dueDate: true,
          sessionTerm: true,
          paymentBreakdown: true,
          qrCode: true,
          watermark: false,
          eduFinanceBranding: true
        },
        schoolLogo: null, // URL to school logo
        letterheadTemplate: null, // URL to letterhead template
        watermarkImage: null, // URL to watermark image
        logoPosition: 'top-center',
        watermarkPosition: 'center-middle',
        footerStyle: 'standard'
      };
    } catch (error) {
      console.error('Error loading school branding configuration:', error);
      return null;
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleExport = () => {
    if (activeTab === 'payments') {
      // Mock payment export
      alert('Payment report exported successfully');
    } else {
      // Export receipts
      const exportData = receiptService?.exportReceipts();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL?.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipts-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      
      window.URL?.revokeObjectURL(url);
    }
  };

  // Handle record payment modal
  const handleOpenRecordPayment = () => {
    setIsRecordPaymentModalOpen(true);
  };

  const handleCloseRecordPayment = () => {
    setIsRecordPaymentModalOpen(false);
  };

  const handlePaymentRecorded = async (paymentData, receipt) => {
    console.log('Payment recorded:', paymentData);
    console.log('Receipt generated:', receipt);
    
    try {
      // Load current school configuration and apply branding to the new receipt
      const schoolConfig = await loadSchoolBrandingConfiguration();
      
      if (schoolConfig && receipt) {
        // Update the receipt with current branding configuration
        const brandedReceipt = receiptService?.applySchoolBrandingToReceipt(receipt, schoolConfig);
        console.log('Receipt updated with branding:', brandedReceipt);
      }
      
      // Refresh the receipts list to show updated branding
      if (activeTab === 'receipts') {
        // Force refresh of receipts table to reflect branding updates
        window.location?.reload();
      }
    } catch (error) {
      console.error('Error applying branding to new receipt:', error);
    }
  };

  // Mock user data
  const currentUser = {
    name: 'Sarah Mitchell',
    role: 'Finance Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  // Get receipt statistics
  const receiptStats = receiptService?.getReceiptStatistics();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <Breadcrumb customItems={[]} />
            
            <PageHeader
              title="Payments Management"
              subtitle="Track and manage all payment transactions with comprehensive oversight"
              icon="CreditCard"
              actions={
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleExport}>
                    <Icon name="Download" size={16} className="mr-2" />
                    Export {activeTab === 'payments' ? 'Payments' : 'Receipts'}
                  </Button>
                  <Button size="sm" className="w-full sm:w-auto" onClick={handleOpenRecordPayment}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Record Payment
                  </Button>
                </div>
              }
            />

            {/* Payment Summary Cards */}
            <PaymentSummaryCards />

            {/* Tab Navigation */}
            <div className="bg-card rounded-lg border border-border">
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'payments' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="CreditCard" size={16} />
                      <span>Payments</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('receipts')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'receipts' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="FileText" size={16} />
                      <span>Receipts</span>
                      {receiptStats?.totalReceipts > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {receiptStats?.totalReceipts}
                        </span>
                      )}
                    </div>
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'payments' ? (
                  <>
                    {/* Payment Filters */}
                    <div className="mb-6">
                      <PaymentFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                      />
                    </div>

                    {/* Payment Table */}
                    <PaymentTable
                      filters={filters}
                      searchTerm={searchTerm}
                      onViewPayment={handleViewPayment}
                    />
                  </>
                ) : (
                  <>
                    {/* Receipt Filters */}
                    <div className="mb-6">
                      <PaymentFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        showReceiptFilters={true}
                      />
                    </div>

                    {/* Receipt Statistics */}
                    {receiptStats?.totalReceipts > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-muted/20 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon name="FileText" size={16} className="text-primary" />
                            <span className="text-sm text-muted-foreground">Total Receipts</span>
                          </div>
                          <div className="text-2xl font-bold text-foreground">{receiptStats?.totalReceipts}</div>
                        </div>
                        <div className="bg-muted/20 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon name="CheckCircle" size={16} className="text-success" />
                            <span className="text-sm text-muted-foreground">Full Payments</span>
                          </div>
                          <div className="text-2xl font-bold text-foreground">{receiptStats?.fullPaymentReceipts}</div>
                        </div>
                        <div className="bg-muted/20 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon name="Clock" size={16} className="text-warning" />
                            <span className="text-sm text-muted-foreground">Partial Payments</span>
                          </div>
                          <div className="text-2xl font-bold text-foreground">{receiptStats?.partialPaymentReceipts}</div>
                        </div>
                        <div className="bg-muted/20 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon name="Banknote" size={16} className="text-accent" />
                            <span className="text-sm text-muted-foreground">Total Amount</span>
                          </div>
                          <div className="text-lg font-bold text-foreground">
                            {new Intl.NumberFormat('en-NG', {
                              style: 'currency',
                              currency: 'NGN',
                              notation: 'compact'
                            })?.format(receiptStats?.totalAmount)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Receipts Table */}
                    <ReceiptsTable
                      filters={filters}
                      searchTerm={searchTerm}
                      onViewReceipt={handleViewReceipt}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Payment Details Modal */}
            {isPaymentModalOpen && selectedPayment && (
              <PaymentDetailsModal
                payment={selectedPayment}
                onClose={handleClosePaymentModal}
              />
            )}

            {/* Receipt Modal */}
            {isReceiptModalOpen && selectedReceipt && (
              <ReceiptModal
                receipt={selectedReceipt}
                onClose={handleCloseReceiptModal}
              />
            )}

            {/* Record Payment Modal */}
            <RecordPaymentModal
              isOpen={isRecordPaymentModalOpen}
              onClose={handleCloseRecordPayment}
              onPaymentRecorded={handlePaymentRecorded}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentsManagement;