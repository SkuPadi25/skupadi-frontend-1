import React, { useState, useEffect } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import { DollarSign, AlertCircle, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { specialInvoiceService } from '../../../services/specialInvoiceService';
import { SERVICE_TYPE_LABELS } from '../../../constants/specialInvoice';

const BillableItemsSection = ({ formData, errors, onChange }) => {
  const [availableBillableItems, setAvailableBillableItems] = useState([]);
  const [serviceConfigurations, setServiceConfigurations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);

  // Load service configurations and billable items when class changes
  useEffect(() => {
    if (formData?.class) {
      loadAvailableItems();
    }
  }, [formData?.class]);

  // Load service configurations from server
  useEffect(() => {
    loadServiceConfigurations();
  }, []);

  const loadServiceConfigurations = async () => {
    try {
      const configurations = await specialInvoiceService?.getServiceConfigurations();
      setServiceConfigurations(configurations);
    } catch (error) {
      console.error('Error loading service configurations:', error);
    }
  };

  const loadAvailableItems = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const items = getMockBillableItems(formData?.class);
      setAvailableBillableItems(items);

      // Initialize with mandatory items if no billable items exist yet
      if (!formData?.billableItems || formData?.billableItems?.length === 0) {
        const mandatoryItems = items?.filter(item => item?.mandatory)?.map(item => ({
          id: item?.id,
          serviceType: item?.serviceType,
          name: item?.name,
          description: item?.description,
          amount: item?.defaultAmount,
          isActive: true,
          isMandatory: true
        }));
        
        onChange('billableItems', mandatoryItems);
      }
    } catch (error) {
      console.error('Error loading billable items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced billable items based on service configurations and class
  const getMockBillableItems = (studentClass) => {
    const baseItems = [
      { 
        id: 'tuition', 
        serviceType: 'tuition',
        name: 'Tuition Fee', 
        description: 'Monthly tuition fee', 
        defaultAmount: 15000, 
        mandatory: true,
        category: 'academic'
      }
    ];

    // Add service-based items from configurations
    serviceConfigurations?.forEach(config => {
      baseItems?.push({
        id: config?.service_type,
        serviceType: config?.service_type,
        name: config?.name,
        description: config?.description,
        defaultAmount: config?.default_amount,
        mandatory: false,
        category: 'optional_service'
      });
    });

    // Add traditional items for compatibility
    const traditionalItems = [
      { id: 'uniform', serviceType: 'uniform', name: 'School Uniform', description: 'Complete school uniform set', defaultAmount: 5000, mandatory: false, category: 'materials' },
      { id: 'books', serviceType: 'books', name: 'Text Books', description: 'Required textbooks for the term', defaultAmount: 8000, mandatory: false, category: 'materials' },
      { id: 'exam', serviceType: 'examination_fee', name: 'Examination Fee', description: 'Terminal examination fee', defaultAmount: 2500, mandatory: false, category: 'academic' }
    ];

    baseItems?.push(...traditionalItems);

    // Add class-specific items
    if (['nursery', 'lkg', 'ukg']?.includes(studentClass)) {
      baseItems?.push(
        { id: 'playground', serviceType: 'playground', name: 'Playground Activities', description: 'Early childhood development activities', defaultAmount: 2000, mandatory: false, category: 'activities' },
        { id: 'snacks', serviceType: 'snacks', name: 'Snacks', description: 'Daily snacks provision', defaultAmount: 3000, mandatory: false, category: 'meals' }
      );
    }

    if (['1', '2', '3', '4', '5', '6']?.includes(studentClass)) {
      baseItems?.push(
        { id: 'library', serviceType: 'library_fee', name: 'Library Fee', description: 'Library access and maintenance', defaultAmount: 1500, mandatory: false, category: 'facilities' }
      );
    }

    return baseItems;
  };

  const handleToggleItem = (itemId, serviceType) => {
    const billableItems = formData?.billableItems || [];
    const existingIndex = billableItems?.findIndex(item => item?.id === itemId);
    
    if (existingIndex >= 0) {
      // Remove item if not mandatory
      const item = billableItems?.[existingIndex];
      if (!item?.isMandatory) {
        const updatedItems = billableItems?.filter(item => item?.id !== itemId);
        onChange('billableItems', updatedItems);
      }
    } else {
      // Add item
      const availableItem = availableBillableItems?.find(item => item?.id === itemId);
      if (availableItem) {
        const newItem = {
          id: availableItem?.id,
          serviceType: availableItem?.serviceType,
          name: availableItem?.name,
          description: availableItem?.description,
          amount: availableItem?.defaultAmount,
          isActive: true,
          isMandatory: availableItem?.mandatory,
          category: availableItem?.category
        };
        onChange('billableItems', [...billableItems, newItem]);
      }
    }
  };

  const handleAmountChange = (itemId, amount) => {
    const billableItems = formData?.billableItems || [];
    const updatedItems = billableItems?.map(item =>
      item?.id === itemId ? { ...item, amount: parseFloat(amount) || 0 } : item
    );
    onChange('billableItems', updatedItems);
  };

  const handleToggleActiveStatus = (itemId) => {
    const billableItems = formData?.billableItems || [];
    const updatedItems = billableItems?.map(item =>
      item?.id === itemId ? { ...item, isActive: !item?.isActive } : item
    );
    onChange('billableItems', updatedItems);
  };

  const isItemSelected = (itemId) => {
    return (formData?.billableItems || [])?.some(item => item?.id === itemId);
  };

  const getSelectedItem = (itemId) => {
    return (formData?.billableItems || [])?.find(item => item?.id === itemId);
  };

  const calculateTotal = () => {
    const billableItems = formData?.billableItems || [];
    return billableItems?.filter(item => item?.isActive)?.reduce((total, item) => total + (item?.amount || 0), 0);
  };

  const groupItemsByCategory = () => {
    const groups = {};
    availableBillableItems?.forEach(item => {
      const category = item?.category || 'other';
      if (!groups?.[category]) {
        groups[category] = [];
      }
      groups?.[category]?.push(item);
    });
    return groups;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      academic: 'Academic Fees',
      optional_service: 'Optional Services',
      materials: 'Materials & Supplies',
      activities: 'Activities',
      meals: 'Meals & Nutrition',
      facilities: 'Facilities',
      other: 'Other Items'
    };
    return labels?.[category] || 'Other Items';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'optional_service':
        return <Settings size={16} className="text-primary" />;
      case 'academic':
        return <DollarSign size={16} className="text-success" />;
      default:
        return <DollarSign size={16} className="text-muted-foreground" />;
    }
  };

  if (!formData?.class) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
          Optional Services & Billable Items
        </h3>
        <div className="flex items-center space-x-2 text-muted-foreground bg-muted/30 p-4 rounded-lg">
          <AlertCircle size={20} />
          <p>Please select a class first to configure billable items</p>
        </div>
      </div>
    );
  }

  const groupedItems = groupItemsByCategory();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground flex items-center">
          <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
          Optional Services & Billable Items
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Class: <span className="font-medium text-foreground">{formData?.class?.toUpperCase()}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
            iconName={showAdvancedConfig ? "ToggleRight" : "ToggleLeft"}
            iconPosition="left"
          >
            Advanced Config
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-muted-foreground">Loading available services for class {formData?.class}...</div>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-4">
            Configure optional services for this student. Toggle services on/off and set custom amounts for individual billing.
            <span className="block mt-1 text-xs">
              💡 These settings determine which special invoices this student is eligible for.
            </span>
          </div>

          <div className="space-y-6">
            {Object?.entries(groupedItems)?.map(([category, items]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-border pb-2">
                  {getCategoryIcon(category)}
                  <h4 className="font-medium text-foreground">{getCategoryLabel(category)}</h4>
                  <span className="text-xs text-muted-foreground">({items?.length} services)</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {items?.map((item) => {
                    const selectedItem = getSelectedItem(item?.id);
                    const isSelected = isItemSelected(item?.id);

                    return (
                      <div
                        key={item?.id}
                        className={`border rounded-lg p-4 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary/30 bg-primary/5' :'border-border hover:border-primary/20'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {isSelected ? (
                              <ToggleRight 
                                size={20} 
                                className="text-primary cursor-pointer"
                                onClick={() => !item?.mandatory && handleToggleItem(item?.id, item?.serviceType)}
                              />
                            ) : (
                              <ToggleLeft 
                                size={20} 
                                className="text-muted-foreground cursor-pointer hover:text-primary"
                                onClick={() => handleToggleItem(item?.id, item?.serviceType)}
                              />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-foreground">{item?.name}</h4>
                              {item?.mandatory && (
                                <span className="text-xs bg-error/10 text-error px-2 py-1 rounded-full">
                                  Required
                                </span>
                              )}
                              {category === 'optional_service' && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                  Special Service
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mt-1">{item?.description}</p>
                            
                            {isSelected && (
                              <div className="mt-3 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    label="Amount (₦)"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={selectedItem?.amount || 0}
                                    onChange={(e) => handleAmountChange(item?.id, e?.target?.value)}
                                    placeholder="0.00"
                                    className="text-sm"
                                  />
                                  
                                  {!item?.mandatory && (
                                    <div className="flex items-center space-x-2 pt-6">
                                      <Checkbox
                                        label="Active for invoicing"
                                        checked={selectedItem?.isActive || false}
                                        onChange={() => handleToggleActiveStatus(item?.id)}
                                        className="text-sm"
                                      />
                                    </div>
                                  )}
                                </div>

                                {showAdvancedConfig && category === 'optional_service' && (
                                  <div className="bg-muted/30 rounded-lg p-3 border border-border">
                                    <div className="text-xs text-muted-foreground mb-2">
                                      <strong>Service Configuration:</strong>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                      <div>
                                        <span className="text-muted-foreground">Service Type:</span>
                                        <div className="font-medium">{SERVICE_TYPE_LABELS?.[item?.serviceType] || item?.serviceType}</div>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Default Amount:</span>
                                        <div className="font-medium">₦{item?.defaultAmount?.toLocaleString()}</div>
                                      </div>
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                      This student will be eligible for "{item?.name}" special invoices when enabled.
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Summary */}
          {(formData?.billableItems || [])?.length > 0 && (
            <div className="bg-muted/30 rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-success" />
                  <span className="font-medium text-foreground">Billing Configuration Summary</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Active Services: {(formData?.billableItems || [])?.filter(item => item?.isActive)?.length}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    Total: ₦{calculateTotal()?.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-muted-foreground mb-2">Mandatory Services:</div>
                  {(formData?.billableItems || [])?.filter(item => item?.isMandatory)?.map(item => (
                    <div key={item?.id} className="flex justify-between">
                      <span>{item?.name}</span>
                      <span className="font-medium">₦{item?.amount?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-muted-foreground mb-2">Optional Services:</div>
                  {(formData?.billableItems || [])?.filter(item => !item?.isMandatory && item?.isActive)?.map(item => (
                    <div key={item?.id} className="flex justify-between">
                      <span>{item?.name}</span>
                      <span className="font-medium">₦{item?.amount?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Special Services: Eligible for bulk special invoicing</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Regular Items: Standard billing items</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {errors?.billableItems && (
            <div className="text-sm text-error">
              {errors?.billableItems}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BillableItemsSection;