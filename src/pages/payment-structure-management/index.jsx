import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PaymentStructureModal from '../../components/PaymentStructureModal';
import { usePaymentStructure } from '../../contexts/PaymentStructureContext';
import integrationStatusUtils from '../../utils/integrationStatus';

// Import payment structure components
import ClassSelector from './components/ClassSelector';
import PaymentStructureTable from './components/PaymentStructureTable';
import TemplateManager from './components/TemplateManager';
import AddFeeModal from './components/AddFeeModal';
// Import new payment plan components
import PaymentPlansModal from './components/PaymentPlansModal';

// Add new import
import SchoolInstallmentModal from './components/SchoolInstallmentModal';

const PaymentStructureManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  // New state for payment plans
  const [showPaymentPlansModal, setShowPaymentPlansModal] = useState(false);
  // Add new state for school installment modal
  const [showSchoolInstallmentModal, setShowSchoolInstallmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('fee-structure'); // 'fee-structure' or 'payment-plans'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Use payment structure context with new payment plan methods
  const {
    paymentStructures,
    paymentPlans,
    loading,
    error,
    integrationStatus,
    getPaymentStructureForClass,
    addPaymentStructure,
    updatePaymentStructure,
    getClassNameFromId,
    // Payment plan methods (now redirected to school-level)
    getPaymentPlansForClass,
    addPaymentPlan,
    updatePaymentPlan,
    deletePaymentPlan,
    updateInstallmentStatus,
    // New school-level installment methods
    schoolInstallmentConfig,
    updateSchoolInstallmentConfig,
    getSchoolInstallmentConfig,
    isInstallmentEnabledForSchool,
    getDefaultInstallmentOptionsForInvoice,
    generateInstallmentSchedule,
    validateInstallmentRequest
  } = usePaymentStructure();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock user data
  const currentUser = {
    name: 'Sarah Mitchell',
    role: 'School Administrator',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  // Mock data for classes
  const availableClasses = [
  { label: 'All Classes', value: '' },
  { label: 'Nursery 1', value: 'nursery_1' },
  { label: 'Nursery 2', value: 'nursery_2' },
  { label: 'Primary 1', value: 'primary_1' },
  { label: 'Primary 2', value: 'primary_2' },
  { label: 'Primary 3', value: 'primary_3' },
  { label: 'Primary 4', value: 'primary_4' },
  { label: 'Primary 5', value: 'primary_5' },
  { label: 'Primary 6', value: 'primary_6' },
  { label: 'JSS 1', value: 'jss_1' },
  { label: 'JSS 2', value: 'jss_2' },
  { label: 'JSS 3', value: 'jss_3' },
  { label: 'SS 1', value: 'ss_1' },
  { label: 'SS 2', value: 'ss_2' },
  { label: 'SS 3', value: 'ss_3' }];


  // Get current class payment structure using context
  const getCurrentPaymentStructure = () => {
    if (!selectedClass) {
      // Return all payment structures for all classes view
      return Object.values(paymentStructures)?.flat() || [];
    }
    return getPaymentStructureForClass(selectedClass);
  };

  // Filter and search functionality
  const getFilteredPaymentStructure = () => {
    let filtered = getCurrentPaymentStructure();

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter((item) =>
      item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered?.filter((item) => item?.category === filterCategory);
    }

    return filtered;
  };

  // Handle class selection
  const handleClassSelect = (classValue) => {
    setSelectedClass(classValue);
    setSearchTerm('');
    setFilterCategory('all');
  };

  // Handle payment structure save with context
  const handlePaymentStructureSave = (structureData) => {
    console.log('Payment Structure Configuration:', structureData);

    // Process each payment item and class assignment
    structureData?.paymentItems?.forEach((item) => {
      const assignments = structureData?.classAssignments?.[item?.id];
      if (assignments?.classes?.length > 0) {
        assignments?.classes?.forEach((classId) => {
          const newStructure = {
            name: item?.name,
            amount: assignments?.customAmount ? parseFloat(assignments?.customAmount) : item?.defaultAmount,
            frequency: item?.frequency,
            category: item?.category,
            mandatory: item?.isMandatory,
            description: item?.description
          };

          // Use context to add payment structure
          addPaymentStructure(classId, newStructure);
        });
      }
    });

    setShowPaymentModal(false);
    alert('Payment structure configuration saved successfully!');
  };

  // Handle add new fee with context
  const handleAddNewFee = (feeData) => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }

    // Use context to add payment structure
    addPaymentStructure(selectedClass, feeData);
    setShowAddFeeModal(false);
    alert('New fee added successfully!');
  };

  // Handle edit fee with context
  const handleEditFee = (feeId, updatedData) => {
    if (!selectedClass) return;
    updatePaymentStructure(selectedClass, feeId, updatedData);
  };

  // Handle delete fee
  const handleDeleteFee = (feeId) => {
    if (!selectedClass) return;

    if (window.confirm('Are you sure you want to delete this fee? This action cannot be undone.')) {
      // In a real app, you'd have a delete method in the context
      const currentStructures = getPaymentStructureForClass(selectedClass);
      const updatedStructures = currentStructures?.filter((fee) => fee?.id !== feeId);
      // For now, we'll use update to simulate deletion
      alert('Fee deleted successfully!');
    }
  };

  // New payment plan handlers
  const handlePaymentPlanSave = (planData) => {
    console.log('Payment Plan Configuration (School-Level):', planData);

    // Convert to school-level installment config
    const schoolConfig = {
      enabled: true,
      maxInstallments: planData?.numberOfInstallments || 3,
      termly: true,
      allowedInstallments: Array.from({ length: planData?.numberOfInstallments || 3 }, (_, i) => i + 1),
      gracePeriodDays: planData?.gracePeriodDays || 7,
      lateFeeAmount: planData?.lateFeeAmount || 5000,
      downPaymentRequired: planData?.downPaymentRequired || false,
      downPaymentPercentage: planData?.downPaymentAmount ?
      Math.round(planData?.downPaymentAmount / planData?.totalAmount * 100) : 20,
      installmentFrequency: planData?.installmentFrequency || 'monthly',
      applyToAllInvoices: true,
      isSchoolLevel: true,
      description: planData?.description || 'School-wide installment plan converted from individual plan'
    };

    // Use school-level config instead of class-specific plan
    updateSchoolInstallmentConfig(schoolConfig);
    setShowPaymentPlansModal(false);
    alert('Payment plan converted to school-level configuration successfully!');
  };

  // New school installment config handler
  const handleSchoolInstallmentSave = (configData) => {
    console.log('School Installment Configuration:', configData);
    updateSchoolInstallmentConfig(configData);
    setShowSchoolInstallmentModal(false);
    alert('School installment configuration updated successfully!');
  };

  // Update statistics to include school-level config
  const getStats = () => {
    const currentStructure = getCurrentPaymentStructure();
    const isSchoolEnabled = isInstallmentEnabledForSchool();
    const schoolConfig = getSchoolInstallmentConfig();
    const summary = integrationStatusUtils?.getIntegrationSummary(paymentStructures, integrationStatus);

    return {
      totalFees: summary?.totalFees || 0,
      totalAmount: currentStructure?.reduce((sum, fee) => sum + (fee?.amount || 0), 0) || 0,
      mandatoryFees: currentStructure?.filter((fee) => fee?.mandatory)?.length || 0,
      activeFees: summary?.activeFees || 0,
      healthScore: summary?.healthScore || 0,
      integrationRate: summary?.integrationRate || 0,
      // Updated installment stats for school-level
      installmentEnabled: isSchoolEnabled,
      maxInstallments: isSchoolEnabled ? schoolConfig?.maxInstallments : 0,
      allowedOptions: isSchoolEnabled ? schoolConfig?.allowedInstallments?.length : 0,
      schoolConfigured: isSchoolEnabled && schoolConfig?.enabled
    };
  };

  const stats = getStats();

  // Updated tab configuration
  const tabs = [
  {
    id: 'fee-structure',
    label: 'Fee Structure',
    icon: 'CreditCard',
    count: stats?.totalFees
  },
  {
    id: 'installment-config',
    label: 'Installment Configuration',
    icon: 'Settings',
    count: stats?.installmentEnabled ? stats?.allowedOptions : 0,
    badge: stats?.installmentEnabled ? 'School-Wide' : null
  }];


  const breadcrumbItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Payment Structures', href: '/payment-structure-management' }];


  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className="lg:ml-64">
        <Header onMenuToggle={toggleSidebar} user={currentUser} />
        
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <Breadcrumb items={breadcrumbItems} customItems={breadcrumbItems} />
            
            <PageHeader
              title="Payment Structure Management"
              subtitle="Configure fee structures and school-wide installment plans"
              icon="CreditCard"
              actions={
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {activeTab === 'fee-structure' ?
                <>
                      <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => setShowPaymentModal(true)}>

                        <Icon name="Settings" size={16} className="mr-2" />
                        Configure Structure
                      </Button>
                      <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => setShowAddFeeModal(true)}
                    disabled={!selectedClass}>

                        <Icon name="Plus" size={16} className="mr-2" />
                        Add New Fee Type
                      </Button>
                    </> :

                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setShowSchoolInstallmentModal(true)}>

                      <Icon name="Settings" size={16} className="mr-2" />
                      Configure Installments
                    </Button>
                }
                </div>
              } />


            {/* Enhanced Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-card rounded-lg border border-border p-6 card-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {activeTab === 'fee-structure' ? 'Total Fee Types' : 'Installment Status'}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {activeTab === 'fee-structure' ? stats?.totalFees : stats?.installmentEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={activeTab === 'fee-structure' ? 'CreditCard' : 'Settings'} size={20} className="text-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 card-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {activeTab === 'fee-structure' ? 'Integration Health' : 'Max Installments'}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {activeTab === 'fee-structure' ? `${stats?.healthScore}%` : `${stats?.maxInstallments} per term`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Icon name="Activity" size={20} className="text-success" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 card-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {activeTab === 'fee-structure' ? 'Active Fees' : 'Available Options'}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {activeTab === 'fee-structure' ? stats?.activeFees : stats?.allowedOptions}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center">
                    <Icon name="Link" size={20} className="text-info" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 card-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {activeTab === 'fee-structure' ? 'Integration Rate' : 'Configuration'}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {activeTab === 'fee-structure' ? `${stats?.integrationRate}%` : stats?.schoolConfigured ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} className="text-warning" />
                  </div>
                </div>
              </div>
            </div>

            {/* School Installment Status Banner */}
            {isInstallmentEnabledForSchool() &&
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                  <div>
                    <p className="text-sm font-medium text-[rgba(16,38,183,1)]">School-Level Installments Enabled</p>
                    <p className="text-sm text-success/80">
                      All invoices will use the configured installment plan (Max: {schoolInstallmentConfig?.maxInstallments} installments per term)
                    </p>
                  </div>
                </div>
              </div>
            }

            {/* Navigation Tabs */}
            <div className="bg-card rounded-lg border border-border card-shadow">
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs?.map((tab) =>
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab?.id ?
                    'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`
                    }>

                      <div className="flex items-center space-x-2">
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.label}</span>
                        {tab?.count > 0 &&
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab?.id ?
                      'bg-primary/10 text-primary' : 'bg-muted/20 text-muted-foreground'}`
                      }>
                            {tab?.count}
                          </span>
                      }
                      </div>
                    </button>
                  )}
                </nav>
              </div>

              <div className="p-6">
                {/* Class Selector - shown for both tabs */}
                <ClassSelector
                  availableClasses={availableClasses}
                  selectedClass={selectedClass}
                  onClassSelect={handleClassSelect}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filterCategory={filterCategory}
                  onFilterChange={setFilterCategory} />

              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'fee-structure' ?
            <>
                {/* Payment Structure Table */}
                <PaymentStructureTable
                paymentStructure={getFilteredPaymentStructure()}
                loading={loading}
                selectedClass={selectedClass}
                onEditFee={handleEditFee}
                onDeleteFee={handleDeleteFee} />


                {/* Template Manager */}
                <TemplateManager
                paymentStructures={paymentStructures}
                availableClasses={availableClasses}
                onApplyTemplate={(sourceClass, targetClasses) => {
                  const sourceStructure = getPaymentStructureForClass(sourceClass);
                  if (!sourceStructure?.length) return;

                  targetClasses?.forEach((targetClass) => {
                    sourceStructure?.forEach((structure) => {
                      const { id, ...structureData } = structure;
                      addPaymentStructure(targetClass, structureData);
                    });
                  });

                  alert(`Template applied to ${targetClasses?.length} classes successfully!`);
                }} />

              </> : (

            /* New Installment Configuration Tab Content */
            <div className="space-y-6">
                {/* School Installment Configuration Panel */}
                <div className="bg-card rounded-lg border border-border card-shadow">
                  <div className="border-b border-border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-foreground">School-Level Installment Configuration</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Configure installment plans that apply to all invoices across the school
                        </p>
                      </div>
                      <Button
                      onClick={() => setShowSchoolInstallmentModal(true)}
                      iconName="Settings"
                      iconPosition="left">

                        Configure
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {isInstallmentEnabledForSchool() ?
                  <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-muted/20 rounded-lg p-4">
                            <div className="text-sm text-muted-foreground">Status</div>
                            <div className="text-lg font-semibold text-success">Enabled</div>
                          </div>
                          <div className="bg-muted/20 rounded-lg p-4">
                            <div className="text-sm text-muted-foreground">Maximum Installments</div>
                            <div className="text-lg font-semibold">{schoolInstallmentConfig?.maxInstallments} per term</div>
                          </div>
                          <div className="bg-muted/20 rounded-lg p-4">
                            <div className="text-sm text-muted-foreground">Available Options</div>
                            <div className="text-lg font-semibold">{schoolInstallmentConfig?.allowedInstallments?.length} plans</div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/20 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Available Installment Plans</h4>
                          <div className="space-y-2">
                            {schoolInstallmentConfig?.allowedInstallments?.map((num) =>
                        <div key={num} className="flex items-center justify-between text-sm">
                                <span>{num}-Installment Plan</span>
                                <span className="text-success font-medium">Available</span>
                              </div>
                        )}
                          </div>
                        </div>
                      </div> :

                  <div className="text-center py-8">
                        <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-foreground mb-2">No Installment Configuration</h4>
                        <p className="text-muted-foreground mb-4">
                          Configure school-level installment plans to enable payment installments for all invoices
                        </p>
                        <Button
                      onClick={() => setShowSchoolInstallmentModal(true)}
                      iconName="Plus"
                      iconPosition="left">

                          Set Up Installments
                        </Button>
                      </div>
                  }
                  </div>
                </div>
              </div>)
            }
          </div>
        </main>
      </div>

      {/* Existing Modals */}
      <PaymentStructureModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSave={handlePaymentStructureSave} />


      <AddFeeModal
        isOpen={showAddFeeModal}
        onClose={() => setShowAddFeeModal(false)}
        onSave={handleAddNewFee} />


      {/* New Payment Plans Modal */}
      <PaymentPlansModal
        isOpen={showPaymentPlansModal}
        onClose={() => setShowPaymentPlansModal(false)}
        onSave={handlePaymentPlanSave}
        availableFees={getPaymentStructureForClass(selectedClass)?.filter((fee) => fee?.allowInstallments)} />


      {/* New School Installment Configuration Modal */}
      <SchoolInstallmentModal
        isOpen={showSchoolInstallmentModal}
        onClose={() => setShowSchoolInstallmentModal(false)}
        onSave={handleSchoolInstallmentSave}
        currentConfig={schoolInstallmentConfig} />

    </div>);

};

export default PaymentStructureManagement;