import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Icon from '../components/AppIcon';

const PaymentStructureModal = ({ isOpen, onClose, onSave }) => {
  const [currentTab, setCurrentTab] = useState('setup');
  const [paymentItems, setPaymentItems] = useState([]);
  const [classAssignments, setClassAssignments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  // Mock data for classes
  const availableClasses = [
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
    { label: 'SS 3', value: 'ss_3' }
  ];

  const frequencyOptions = [
    { label: 'One-time', value: 'one_time' },
    { label: 'Termly', value: 'termly' },
    { label: 'Annually', value: 'annually' },
    { label: 'Custom', value: 'custom' }
  ];

  // Payment item form state
  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: '',
    defaultAmount: '',
    frequency: 'termly',
    isMandatory: true,
    description: '',
    category: 'academic'
  });

  const categoryOptions = [
    { label: 'Academic', value: 'academic' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Accommodation', value: 'accommodation' },
    { label: 'Activities', value: 'activities' },
    { label: 'Administrative', value: 'administrative' },
    { label: 'Other', value: 'other' }
  ];

  if (!isOpen) return null;

  const validatePaymentItem = () => {
    const newErrors = {};
    
    if (!currentItem?.name?.trim()) {
      newErrors.name = 'Fee name is required';
    } else if (paymentItems?.find(item => item?.name?.toLowerCase() === currentItem?.name?.toLowerCase() && item?.id !== currentItem?.id)) {
      newErrors.name = 'Fee name must be unique';
    }
    
    if (!currentItem?.defaultAmount || parseFloat(currentItem?.defaultAmount) <= 0) {
      newErrors.defaultAmount = 'Default amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleAddPaymentItem = () => {
    if (!validatePaymentItem()) return;
    
    const newItem = {
      ...currentItem,
      id: currentItem?.id || `item_${Date.now()}`,
      defaultAmount: parseFloat(currentItem?.defaultAmount)
    };
    
    if (currentItem?.id) {
      setPaymentItems(items => items?.map(item => 
        item?.id === currentItem?.id ? newItem : item
      ));
    } else {
      setPaymentItems(items => [...items, newItem]);
    }
    
    // Reset form
    setCurrentItem({
      id: null,
      name: '',
      defaultAmount: '',
      frequency: 'termly',
      isMandatory: true,
      description: '',
      category: 'academic'
    });
    setErrors({});
  };

  const handleEditPaymentItem = (item) => {
    setCurrentItem({
      ...item,
      defaultAmount: item?.defaultAmount?.toString()
    });
  };

  const handleDeletePaymentItem = (itemId) => {
    setPaymentItems(items => items?.filter(item => item?.id !== itemId));
    // Clean up class assignments for deleted item
    const newAssignments = { ...classAssignments };
    delete newAssignments?.[itemId];
    setClassAssignments(newAssignments);
  };

  const handleClassAssignment = (itemId, classIds, customAmount) => {
    setClassAssignments(prev => ({
      ...prev,
      [itemId]: {
        classes: classIds,
        customAmount: customAmount || null
      }
    }));
  };

  const handleBulkAssignment = () => {
    const selectedItems = paymentItems?.filter(item => 
      document.getElementById(`bulk_${item?.id}`)?.checked
    );
    const selectedClasses = availableClasses?.filter(cls => 
      document.getElementById(`bulk_class_${cls?.value}`)?.checked
    )?.map(cls => cls?.value);

    selectedItems?.forEach(item => {
      setClassAssignments(prev => ({
        ...prev,
        [item?.id]: {
          classes: [...(prev?.[item?.id]?.classes || []), ...selectedClasses]?.filter((v, i, a) => a?.indexOf(v) === i),
          customAmount: prev?.[item?.id]?.customAmount || null
        }
      }));
    });
  };

  const getAssignedItemsCount = () => {
    return Object.values(classAssignments)?.reduce((total, assignment) => {
      return total + (assignment?.classes?.length || 0);
    }, 0);
  };

  const handleSave = () => {
    if (paymentItems?.length === 0) {
      alert('Please add at least one payment item');
      return;
    }

    const structureData = {
      paymentItems,
      classAssignments,
      timestamp: new Date()?.toISOString()
    };

    onSave?.(structureData);
    console.log('Payment Structure Saved:', structureData);
  };

  const filteredItems = paymentItems?.filter(item =>
    item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    item?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg border border-border max-w-6xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Icon name="CreditCard" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Payment Structure Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Configure payment categories and assign them to classes
                </p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setCurrentTab('setup')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === 'setup' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Settings" size={16} />
                  <span>Payment Items Setup</span>
                  {paymentItems?.length > 0 && (
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                      {paymentItems?.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setCurrentTab('assignment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === 'assignment' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} />
                  <span>Class Assignment</span>
                  {getAssignedItemsCount() > 0 && (
                    <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs">
                      {getAssignedItemsCount()}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setCurrentTab('review')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === 'review' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Eye" size={16} />
                  <span>Review & Save</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tab 1: Payment Items Setup */}
            {currentTab === 'setup' && (
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-foreground mb-4">Add Payment Item</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                      label="Fee Name"
                      required
                      placeholder="e.g., Tuition Fee"
                      value={currentItem?.name}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e?.target?.value }))}
                      error={errors?.name}
                    />
                    
                    <Input
                      label="Default Amount (₦)"
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={currentItem?.defaultAmount}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, defaultAmount: e?.target?.value }))}
                      error={errors?.defaultAmount}
                    />
                    
                    <Select
                      label="Category"
                      options={categoryOptions}
                      value={currentItem?.category}
                      onChange={(value) => setCurrentItem(prev => ({ ...prev, category: value }))}
                    />
                    
                    <Select
                      label="Frequency"
                      options={frequencyOptions}
                      value={currentItem?.frequency}
                      onChange={(value) => setCurrentItem(prev => ({ ...prev, frequency: value }))}
                    />
                    
                    <div className="flex items-center space-x-3 pt-6">
                      <Input
                        type="checkbox"
                        checked={currentItem?.isMandatory}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, isMandatory: e?.target?.checked }))}
                      />
                      <label className="text-sm font-medium text-foreground">Mandatory</label>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Input
                      label="Description (Optional)"
                      placeholder="Additional details about this fee..."
                      value={currentItem?.description}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e?.target?.value }))}
                    />
                  </div>
                  
                  <div className="mt-6 flex items-center space-x-3">
                    <Button
                      variant="default"
                      onClick={handleAddPaymentItem}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      {currentItem?.id ? 'Update Item' : 'Add Item'}
                    </Button>
                    
                    {currentItem?.id && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentItem({
                            id: null,
                            name: '',
                            defaultAmount: '',
                            frequency: 'termly',
                            isMandatory: true,
                            description: '',
                            category: 'academic'
                          });
                          setErrors({});
                        }}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </div>

                {/* Payment Items List */}
                {paymentItems?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-foreground">Configured Payment Items</h3>
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e?.target?.value)}
                        className="max-w-sm"
                      />
                    </div>
                    
                    <div className="bg-background border border-border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                          <thead className="bg-muted/30">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Fee Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Frequency
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-background divide-y divide-border">
                            {filteredItems?.map((item) => (
                              <tr key={item?.id} className="hover:bg-muted/20">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-foreground">{item?.name}</div>
                                    {item?.description && (
                                      <div className="text-sm text-muted-foreground">{item?.description}</div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                                  ₦{item?.defaultAmount?.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground capitalize">
                                    {item?.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground capitalize">
                                  {item?.frequency?.replace('_', ' ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    item?.isMandatory 
                                      ? 'bg-error/10 text-error' :'bg-success/10 text-success'
                                  }`}>
                                    {item?.isMandatory ? 'Mandatory' : 'Optional'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditPaymentItem(item)}
                                      iconName="Edit"
                                      iconSize={14}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeletePaymentItem(item?.id)}
                                      iconName="Trash2"
                                      iconSize={14}
                                      className="text-error hover:text-error"
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Class Assignment */}
            {currentTab === 'assignment' && (
              <div className="space-y-6">
                {paymentItems?.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Payment Items</h3>
                    <p className="text-muted-foreground mb-4">
                      Please add payment items in the first tab before assigning them to classes.
                    </p>
                    <Button
                      variant="default"
                      onClick={() => setCurrentTab('setup')}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Add Payment Items
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Bulk Assignment Section */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-foreground mb-4">Bulk Assignment</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Select Payment Items</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                            {paymentItems?.map((item) => (
                              <div key={item?.id} className="flex items-center space-x-3">
                                <Input
                                  type="checkbox"
                                  id={`bulk_${item?.id}`}
                                />
                                <label htmlFor={`bulk_${item?.id}`} className="text-sm text-foreground">
                                  {item?.name} (₦{item?.defaultAmount?.toFixed(2)})
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Select Classes</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                            {availableClasses?.map((cls) => (
                              <div key={cls?.value} className="flex items-center space-x-3">
                                <Input
                                  type="checkbox"
                                  id={`bulk_class_${cls?.value}`}
                                />
                                <label htmlFor={`bulk_class_${cls?.value}`} className="text-sm text-foreground">
                                  {cls?.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          onClick={handleBulkAssignment}
                          iconName="Link"
                          iconPosition="left"
                        >
                          Apply Bulk Assignment
                        </Button>
                      </div>
                    </div>

                    {/* Individual Assignment */}
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Individual Class Assignment</h3>
                      
                      <div className="space-y-4">
                        {paymentItems?.map((item) => (
                          <div key={item?.id} className="bg-background border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-medium text-foreground">{item?.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Default: ₦{item?.defaultAmount?.toFixed(2)} • {item?.frequency?.replace('_', ' ')}
                                </p>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item?.isMandatory 
                                  ? 'bg-error/10 text-error' :'bg-success/10 text-success'
                              }`}>
                                {item?.isMandatory ? 'Mandatory' : 'Optional'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Select
                                label="Assign to Classes"
                                multiple
                                options={availableClasses}
                                value={classAssignments?.[item?.id]?.classes || []}
                                onChange={(value) => handleClassAssignment(item?.id, value)}
                                placeholder="Select classes..."
                              />
                              
                              <Input
                                label="Custom Amount (Optional)"
                                type="number"
                                step="0.01"
                                placeholder={`Default: ₦${item?.defaultAmount?.toFixed(2)}`}
                                value={classAssignments?.[item?.id]?.customAmount || ''}
                                onChange={(e) => {
                                  const currentAssignment = classAssignments?.[item?.id] || { classes: [] };
                                  handleClassAssignment(
                                    item?.id, 
                                    currentAssignment?.classes, 
                                    e?.target?.value
                                  );
                                }}
                              />
                            </div>
                            
                            {classAssignments?.[item?.id]?.classes?.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm text-muted-foreground mb-2">Assigned to:</p>
                                <div className="flex flex-wrap gap-2">
                                  {classAssignments?.[item?.id]?.classes?.map((classId) => {
                                    const className = availableClasses?.find(cls => cls?.value === classId)?.label;
                                    return (
                                      <span
                                        key={classId}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm bg-primary/10 text-primary"
                                      >
                                        {className}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const currentClasses = classAssignments?.[item?.id]?.classes?.filter(id => id !== classId);
                                            handleClassAssignment(item?.id, currentClasses, classAssignments?.[item?.id]?.customAmount);
                                          }}
                                          className="ml-1 text-primary hover:text-primary/80"
                                        >
                                          <Icon name="X" size={12} />
                                        </button>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab 3: Review & Save */}
            {currentTab === 'review' && (
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-foreground mb-4">Configuration Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="CreditCard" size={24} className="text-primary-foreground" />
                      </div>
                      <h4 className="text-2xl font-bold text-foreground">{paymentItems?.length}</h4>
                      <p className="text-sm text-muted-foreground">Payment Items</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="Users" size={24} className="text-success-foreground" />
                      </div>
                      <h4 className="text-2xl font-bold text-foreground">{getAssignedItemsCount()}</h4>
                      <p className="text-sm text-muted-foreground">Class Assignments</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-info rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="DollarSign" size={24} className="text-info-foreground" />
                      </div>
                      <h4 className="text-2xl font-bold text-foreground">
                        ₦{paymentItems?.reduce((sum, item) => sum + item?.defaultAmount, 0)?.toFixed(2)}
                      </h4>
                      <p className="text-sm text-muted-foreground">Total Default Fees</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Review */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-foreground">Detailed Configuration</h3>
                  
                  {paymentItems?.map((item) => {
                    const assignment = classAssignments?.[item?.id];
                    const assignedClasses = assignment?.classes || [];
                    
                    return (
                      <div key={item?.id} className="bg-background border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-foreground">{item?.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item?.category} • {item?.frequency?.replace('_', ' ')} • 
                              <span className={item?.isMandatory ? 'text-error' : 'text-success'}>
                                {' '}{item?.isMandatory ? 'Mandatory' : 'Optional'}
                              </span>
                            </p>
                            {item?.description && (
                              <p className="text-sm text-muted-foreground mt-1">{item?.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-foreground">
                              ₦{assignment?.customAmount || item?.defaultAmount?.toFixed(2)}
                            </p>
                            {assignment?.customAmount && (
                              <p className="text-xs text-muted-foreground">
                                (Default: ₦{item?.defaultAmount?.toFixed(2)})
                              </p>
                            )}
                          </div>
                        </div>
                        {assignedClasses?.length > 0 ? (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">
                              Assigned to {assignedClasses?.length} classes:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {assignedClasses?.map((classId) => {
                                const className = availableClasses?.find(cls => cls?.value === classId)?.label;
                                return (
                                  <span
                                    key={classId}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm bg-primary/10 text-primary"
                                  >
                                    {className}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
                            <div className="flex items-center space-x-2">
                              <Icon name="AlertTriangle" size={16} className="text-warning" />
                              <span className="text-sm text-warning">Not assigned to any classes</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {paymentItems?.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Configuration to Review</h3>
                    <p className="text-muted-foreground mb-4">
                      Please add payment items and assign them to classes before reviewing.
                    </p>
                    <Button
                      variant="default"
                      onClick={() => setCurrentTab('setup')}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Start Configuration
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {paymentItems?.length} items • {getAssignedItemsCount()} assignments
                </span>
                
                {paymentItems?.length > 0 && getAssignedItemsCount() === 0 && (
                  <div className="flex items-center space-x-2 text-warning">
                    <Icon name="AlertTriangle" size={14} />
                    <span className="text-xs">No class assignments</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                
                <Button
                  variant="default"
                  onClick={handleSave}
                  disabled={paymentItems?.length === 0}
                  iconName="Save"
                  iconPosition="left"
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentStructureModal;