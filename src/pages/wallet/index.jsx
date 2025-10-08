import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import SchoolContext from 'contexts/SchoolContext';

// Import wallet components
import WalletSummary from './components/WalletSummary';
import TransactionFilters from './components/TransactionFilters';
import TransactionsTable from './components/TransactionsTable';
import TransferModal from './components/TransferModal';

const Wallet = ({SchoolContext}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    dateRange: '',
    status: ''
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleTransfer = () => {
    // Navigate to transfer wallet page instead of opening modal
    navigate('/transfer-wallet');
  };

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const handleTransferComplete = (transferData) => {
    console.log('Transfer completed:', transferData);
    // Handle transfer completion logic here
    setIsTransferModalOpen(false);
  };

  // Mock user data
  const currentUser = {
    name: 'Sarah Mitchell',
    role: 'Finance Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <Breadcrumb customItems={[]} />
            
            <PageHeader
              title="Wallet"
              subtitle="Your money, in one view"
              icon="Wallet"
              actions={[]}
            />

            {/* Wallet Summary Section */}
            <WalletSummary />

            {/* Search and Transfer Section */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by reference"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    icon="Search"
                    className="w-full"
                  />
                </div>
                <Button 
                  size="default" 
                  className="w-full sm:w-auto"
                  onClick={handleTransfer}
                >
                  <Icon name="ArrowUpRight" size={16} className="mr-2" />
                  Transfer
                </Button>
              </div>

              {/* Transaction Filters */}
              <TransactionFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-card rounded-lg border border-border">
              <div className="border-b border-border px-6 py-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
              </div>
              
              <div className="p-6">
                <TransactionsTable
                  searchTerm={searchTerm}
                  filters={filters}
                />
              </div>
            </div>

            {/* Transfer Modal - Keep for backward compatibility if needed */}
            {isTransferModalOpen && (
              <TransferModal
                isOpen={isTransferModalOpen}
                onClose={handleCloseTransferModal}
                onTransferComplete={handleTransferComplete}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Wallet;