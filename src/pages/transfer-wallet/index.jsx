import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

// wallet components 
import WalletSummary from '../wallet/components/WalletSummary';

// Import transfer components
import TransferFormNew from './components/TransferFormNew';
import BeneficiaryList from './components/BeneficiaryList';
import AddBeneficiaryModal from './components/AddBeneficiaryModal';
import TransferConfirmationModal from './components/TransferConfirmationModal';
import TransferSuccessModal from './components/TransferSuccessModal';
import SecurityPinModal from './components/SecurityPinModal';

const TransferWallet = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddBeneficiaryOpen, setIsAddBeneficiaryOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSecurityPinOpen, setIsSecurityPinOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [transferData, setTransferData] = useState({
    recipient: null,
    amount: '',
    description: '',
    purpose: '',
    fees: 0
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTransferSubmit = (data) => {
    setTransferData({
      ...data,
      fees: calculateFees(data?.amount)
    });
    setIsConfirmationModalOpen(true);
  };

  const calculateFees = (amount) => {
    // Mock fee calculation
    const numAmount = parseFloat(amount?.replace(/[₦,]/g, '')) || 0;
    if (numAmount <= 5000) return 10;
    if (numAmount <= 50000) return 25;
    return 50;
  };

  const handleConfirmTransfer = () => {
    setIsConfirmationModalOpen(false);
    setIsSecurityPinOpen(true);
  };

  const handlePinVerified = () => {
    setIsSecurityPinOpen(false);
    // Simulate transfer processing
    setTimeout(() => {
      setIsSuccessModalOpen(true);
    }, 1500);
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    navigate('/wallet');
  };

  const handleBeneficiarySelect = (beneficiary) => {
    setTransferData(prev => ({
      ...prev,
      recipient: beneficiary
    }));
  };

  // Mock user data
  const currentUser = {
    name: 'Sarah Mitchell',
    role: 'Finance Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Wallet', path: '/wallet' },
    { label: 'Transfer', path: '/transfer-wallet' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <Breadcrumb customItems={breadcrumbItems} />
            
            <PageHeader
              title="Transfer"
              subtitle="Send money to beneficiaries"
              icon="ArrowUpRight"
              actions={[]}
            />
            
            {/* Wallet Summary Section */}
            <WalletSummary />
            <TransferFormNew
                    onSubmit={handleTransferSubmit}
                    selectedRecipient={transferData?.recipient}
            />
            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Transfer Form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Recent Transactions</h2>
                  
                  
                </div>
              </div>

              {/* Right Column - Beneficiary Management */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Beneficiaries</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsAddBeneficiaryOpen(true)}
                    >
                      <Icon name="Plus" size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>

                  <div className="mb-4">
                    <Input
                      placeholder="Search beneficiaries"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e?.target?.value)}
                      icon="Search"
                      className="w-full"
                    />
                  </div>

                  <BeneficiaryList
                    searchTerm={searchTerm}
                    onSelect={handleBeneficiarySelect}
                    selectedRecipient={transferData?.recipient}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isAddBeneficiaryOpen && (
        <AddBeneficiaryModal
          isOpen={isAddBeneficiaryOpen}
          onClose={() => setIsAddBeneficiaryOpen(false)}
          onAdd={(beneficiary) => {
            handleBeneficiarySelect(beneficiary);
            setIsAddBeneficiaryOpen(false);
          }}
        />
      )}

      {isConfirmationModalOpen && (
        <TransferConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          transferData={transferData}
          onConfirm={handleConfirmTransfer}
        />
      )}

      {isSecurityPinOpen && (
        <SecurityPinModal
          isOpen={isSecurityPinOpen}
          onClose={() => setIsSecurityPinOpen(false)}
          onVerified={handlePinVerified}
        />
      )}

      {isSuccessModalOpen && (
        <TransferSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleSuccessClose}
          transferData={transferData}
        />
      )}
    </div>
  );
};

export default TransferWallet;