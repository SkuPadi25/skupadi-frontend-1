import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { dynamicFeeService } from '../../../services/dynamicFeeService';

const LineItemsTable = ({ 
  lineItems, 
  onLineItemsChange, 
  errors = {},
  selectedStudents = [],
  paymentStructureContext = null,
  autoPopulatedFees = [],
  isGradeMode = false,
  currentGradeInfo = null,
  studentExceptions = {}
}) => {
  const [dynamicFeeOptions, setDynamicFeeOptions] = useState([]);
  const [isLoadingFees, setIsLoadingFees] = useState(false);

  // Load dynamic fee options when students change
  useEffect(() => {
    const loadDynamicFeeOptions = async () => {
      if (!selectedStudents?.length || !paymentStructureContext) {
        setDynamicFeeOptions([]);
        return;
      }

      setIsLoadingFees(true);
      try {
        const feeData = await dynamicFeeService?.getFeeOptionsForStudents(selectedStudents, paymentStructureContext);
        
        if (feeData?.allFeeOptions) {
          setDynamicFeeOptions(feeData?.allFeeOptions);
        } else {
          setDynamicFeeOptions([]);
        }
      } catch (error) {
        console.error('Error loading dynamic fee options:', error);
        setDynamicFeeOptions([]);
      } finally {
        setIsLoadingFees(false);
      }
    };

    loadDynamicFeeOptions();
  }, [selectedStudents, paymentStructureContext]);

  // Enhanced grade-based line item display
  const renderGradeBasedSummary = () => {
    if (!isGradeMode || !currentGradeInfo) return null;

    const regularStudentCount = selectedStudents?.length;
    const exceptionCount = Object.keys(studentExceptions)?.length;
    const totalStudentCount = regularStudentCount + exceptionCount;

    return (
      <div className="mb-6 p-4 bg-info/5 rounded-lg border border-info/20">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="GraduationCap" size={16} className="text-info" />
          <span className="text-sm font-medium text-info">Grade-Based Invoice Summary</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Grade:</span>
            <span className="font-medium text-foreground">{currentGradeInfo?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Regular Students:</span>
            <span className="font-medium text-foreground">{regularStudentCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Exceptions:</span>
            <span className="font-medium text-warning">{exceptionCount}</span>
          </div>
        </div>
        {exceptionCount > 0 && (
          <div className="mt-3 p-2 bg-warning/10 rounded border border-warning/20">
            <p className="text-xs text-warning">
              <Icon name="AlertTriangle" size={12} className="inline mr-1" />
              {exceptionCount} student{exceptionCount > 1 ? 's' : ''} marked as exception{exceptionCount > 1 ? 's' : ''} - will require individual fee handling
            </p>
          </div>
        )}
      </div>
    );
  };

  // Combine static and dynamic fee options
  const staticFeeOptions = [
    { value: 'other', label: 'Other', defaultPrice: 0.00, description: 'Custom fee type', category: 'other' }
  ];

  const allFeeOptions = [...dynamicFeeOptions, ...staticFeeOptions];

  const addLineItem = () => {
    const newItem = {
      id: Date.now(),
      feeType: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    onLineItemsChange([...lineItems, newItem]);
  };

  const removeLineItem = (id) => {
    onLineItemsChange(lineItems?.filter(item => item?.id !== id));
  };

  const updateLineItem = async (id, field, value) => {
    const updatedItems = lineItems?.map(item => {
      if (item?.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-populate description and price when fee type changes
        if (field === 'feeType') {
          if (value?.startsWith('payment_structure_')) {
            // Use smart defaults from payment structure context
            const smartDefaults = dynamicFeeService?.applySmartDefaults(value, selectedStudents, paymentStructureContext);
            if (smartDefaults) {
              updatedItem.description = smartDefaults?.description;
              updatedItem.unitPrice = smartDefaults?.unitPrice;
              updatedItem.category = smartDefaults?.category;
              updatedItem.classId = smartDefaults?.classId;
              updatedItem.className = smartDefaults?.className;
              updatedItem.structureId = smartDefaults?.structureId;
            }
          } else {
            // Fallback to static fee options
            const feeType = allFeeOptions?.find(option => option?.value === value);
            if (feeType) {
              updatedItem.description = feeType?.label;
              updatedItem.unitPrice = feeType?.defaultPrice;
              updatedItem.category = feeType?.category || 'other';
            }
          }
        }
        
        // Calculate total when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice' || field === 'feeType') {
          updatedItem.total = (updatedItem?.quantity || 0) * (updatedItem?.unitPrice || 0);
        }
        
        return updatedItem;
      }
      return item;
    });
    onLineItemsChange(updatedItems);
  };

  // Validate fee compatibility with selected students
  const validateFeeCompatibility = async (feeType, itemId) => {
    if (!feeType?.startsWith('payment_structure_') || !selectedStudents?.length) return;

    const validation = await dynamicFeeService?.validateFeeCompatibility(feeType, selectedStudents, paymentStructureContext);
    
    if (!validation?.isValid && validation?.warnings?.length > 0) {
      // Show warning to user
      const warningMessage = validation?.warnings?.join(', ');
      console.warn(`Fee compatibility warning for item ${itemId}: ${warningMessage}`);
      // In a real app, you might show this in the UI
    }
  };

  const subtotal = lineItems?.reduce((sum, item) => sum + (item?.total || 0), 0);
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {isGradeMode ? 'Grade-Based Line Items' : 'Line Items'}
          </h3>
          {autoPopulatedFees?.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {autoPopulatedFees?.length} mandatory fee{autoPopulatedFees?.length > 1 ? 's' : ''} auto-added 
              {isGradeMode ? ` for ${currentGradeInfo?.name}` : ' based on student classes'}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addLineItem}
          iconName="Plus"
          iconPosition="left"
          disabled={!selectedStudents?.length}
        >
          Add Line Item
        </Button>
      </div>

      {/* Grade-Based Summary */}
      {renderGradeBasedSummary()}

      {/* Loading indicator for dynamic fees */}
      {isLoadingFees && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-info/10 rounded-lg">
          <Icon name="Loader" size={16} className="animate-spin text-info" />
          <span className="text-sm text-info">Loading fee options based on selected students...</span>
        </div>
      )}

      {/* Student selection prompt */}
      {!selectedStudents?.length && (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <Icon name="Users" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-2">Select students first to see available fees</p>
          <p className="text-sm text-muted-foreground">Fees will be automatically loaded based on student classes</p>
        </div>
      )}

      {lineItems?.length === 0 && selectedStudents?.length > 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <Icon name="FileText" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">No line items added yet</p>
          <Button
            variant="outline"
            onClick={addLineItem}
            iconName="Plus"
            iconPosition="left"
          >
            Add First Line Item
          </Button>
        </div>
      ) : selectedStudents?.length > 0 ? (
        <>
          {/* Enhanced Desktop Table View for Grade Mode */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Fee Type</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground w-20">Qty</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground w-32">Unit Price</th>
                  {isGradeMode && (
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground w-20">Students</th>
                  )}
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground w-32">
                    {isGradeMode ? 'Total per Student' : 'Total'}
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lineItems?.map((item, index) => (
                  <tr key={item?.id} className="group">
                    <td className="py-3 px-2">
                      <div className="space-y-1">
                        <Select
                          options={allFeeOptions}
                          value={item?.feeType}
                          onChange={(value) => {
                            updateLineItem(item?.id, 'feeType', value);
                            validateFeeCompatibility(value, item?.id);
                          }}
                          placeholder={isLoadingFees ? "Loading fees..." : "Select fee type"}
                          error={errors?.[`lineItems.${index}.feeType`]}
                          required
                          disabled={isLoadingFees || item?.isAutoPopulated}
                        />
                        {item?.isAutoPopulated && (
                          <div className="flex items-center gap-1">
                            <Icon name="Zap" size={12} className="text-primary" />
                            <span className="text-xs text-primary">Auto-added</span>
                          </div>
                        )}
                        {item?.className && (
                          <div className="text-xs text-muted-foreground">
                            Class: {item?.className}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="text"
                        value={item?.description}
                        onChange={(e) => updateLineItem(item?.id, 'description', e?.target?.value)}
                        placeholder="Description"
                        error={errors?.[`lineItems.${index}.description`]}
                        disabled={item?.isAutoPopulated}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={item?.quantity}
                        onChange={(e) => updateLineItem(item?.id, 'quantity', parseFloat(e?.target?.value) || 0)}
                        min="0"
                        step="1"
                        error={errors?.[`lineItems.${index}.quantity`]}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={item?.unitPrice}
                        onChange={(e) => updateLineItem(item?.id, 'unitPrice', parseFloat(e?.target?.value) || 0)}
                        min="0"
                        step="0.01"
                        error={errors?.[`lineItems.${index}.unitPrice`]}
                      />
                    </td>
                    {isGradeMode && (
                      <td className="py-3 px-2">
                        <div className="text-center">
                          <span className="text-sm font-medium text-primary">{selectedStudents?.length}</span>
                          {item?.gradeBasedFee && (
                            <div className="text-xs text-muted-foreground">Grade fee</div>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-2">
                      <div className="text-right">
                        <div className="font-medium text-foreground">
                          ₦{(item?.total || 0)?.toFixed(2)}
                        </div>
                        {isGradeMode && selectedStudents?.length > 1 && (
                          <div className="text-xs text-muted-foreground">
                            ₦{((item?.total || 0) * selectedStudents?.length)?.toFixed(2)} total
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(item?.id)}
                        disabled={item?.mandatory || item?.isAutoPopulated}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error hover:bg-error/10 disabled:opacity-50"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Enhanced */}
          <div className="md:hidden space-y-4">
            {lineItems?.map((item, index) => (
              <div key={item?.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Line Item {index + 1}</span>
                    {item?.isAutoPopulated && (
                      <div className="flex items-center gap-1">
                        <Icon name="Zap" size={12} className="text-primary" />
                        <span className="text-xs text-primary">Auto-added</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLineItem(item?.id)}
                    disabled={item?.mandatory || item?.isAutoPopulated}
                    className="text-error hover:text-error hover:bg-error/10 disabled:opacity-50"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
                
                <Select
                  label="Fee Type"
                  options={allFeeOptions}
                  value={item?.feeType}
                  onChange={(value) => {
                    updateLineItem(item?.id, 'feeType', value);
                    validateFeeCompatibility(value, item?.id);
                  }}
                  placeholder={isLoadingFees ? "Loading fees..." : "Select fee type"}
                  error={errors?.[`lineItems.${index}.feeType`]}
                  required
                  disabled={isLoadingFees || item?.isAutoPopulated}
                />

                {item?.className && (
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
                    Applicable to: {item?.className}
                  </div>
                )}
                
                <Input
                  label="Description"
                  type="text"
                  value={item?.description}
                  onChange={(e) => updateLineItem(item?.id, 'description', e?.target?.value)}
                  placeholder="Description"
                  error={errors?.[`lineItems.${index}.description`]}
                  disabled={item?.isAutoPopulated}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Quantity"
                    type="number"
                    value={item?.quantity}
                    onChange={(e) => updateLineItem(item?.id, 'quantity', parseFloat(e?.target?.value) || 0)}
                    min="0"
                    step="1"
                    error={errors?.[`lineItems.${index}.quantity`]}
                  />
                  <Input
                    label="Unit Price"
                    type="number"
                    value={item?.unitPrice}
                    onChange={(e) => updateLineItem(item?.id, 'unitPrice', parseFloat(e?.target?.value) || 0)}
                    min="0"
                    step="0.01"
                    error={errors?.[`lineItems.${index}.unitPrice`]}
                  />
                </div>
                
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Total: </span>
                  <span className="font-medium text-foreground">₦{(item?.total || 0)?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Totals Section for Grade Mode */}
          <div className="mt-6 border-t border-border pt-4">
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal{isGradeMode ? ' per student:' : ':'}
                  </span>
                  <span className="font-medium text-foreground">₦{subtotal?.toFixed(2)}</span>
                </div>
                {isGradeMode && selectedStudents?.length > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      × {selectedStudents?.length} students:
                    </span>
                    <span className="font-medium text-foreground">
                      ₦{(subtotal * selectedStudents?.length)?.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%):</span>
                  <span className="font-medium text-foreground">
                    ₦{(taxAmount * (isGradeMode ? selectedStudents?.length : 1))?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">
                    ₦{(totalAmount * (isGradeMode ? selectedStudents?.length : 1))?.toFixed(2)}
                  </span>
                </div>
                {autoPopulatedFees?.length > 0 && (
                  <div className="text-xs text-muted-foreground pt-2">
                    * {autoPopulatedFees?.length} mandatory fee{autoPopulatedFees?.length > 1 ? 's' : ''} included automatically
                    {isGradeMode && ` for ${selectedStudents?.length} students`}
                  </div>
                )}
                {isGradeMode && Object.keys(studentExceptions)?.length > 0 && (
                  <div className="text-xs text-warning pt-1">
                    + {Object.keys(studentExceptions)?.length} exception student{Object.keys(studentExceptions)?.length > 1 ? 's' : ''} require separate handling
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default LineItemsTable;