import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const InvoiceActions = ({ 
  onCreateInvoice, 
  onSaveDraft, 
  isValid, 
  isLoading,
  selectedStudents = [],
  lineItems = [],
  isGradeMode = false,
  currentGradeInfo = null,
  exceptionCount = 0
}) => {
  const calculateTotals = () => {
    const subtotal = lineItems?.reduce((sum, item) => sum + (item?.total || 0), 0);
    const taxAmount = subtotal * 0.08;
    const totalAmount = subtotal + taxAmount;
    const multiplier = isGradeMode ? selectedStudents?.length : 1;
    return {
      subtotal,
      taxAmount,
      totalAmount,
      grandTotal: totalAmount * multiplier
    };
  };

  const { grandTotal } = calculateTotals();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {isGradeMode && currentGradeInfo ? (
              <>
                Ready to create invoices for <span className="font-medium text-foreground">{currentGradeInfo?.name}</span>
                <br />
                <span className="text-xs">
                  {selectedStudents?.length} student{selectedStudents?.length > 1 ? 's' : ''} selected
                  {exceptionCount > 0 && (
                    <span className="text-warning"> • {exceptionCount} exception{exceptionCount > 1 ? 's' : ''} noted</span>
                  )}
                </span>
              </>
            ) : (
              <>
                {selectedStudents?.length > 0 ? (
                  <>
                    Ready to create {selectedStudents?.length} invoice{selectedStudents?.length > 1 ? 's' : ''}
                    <br />
                    <span className="text-xs">
                      Total amount: ₦{grandTotal?.toFixed(2)}
                    </span>
                  </>
                ) : (
                  'Select students and add line items to continue'
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={!isValid || isLoading}
            iconName="Save"
            iconPosition="left"
          >
            {isLoading ? 'Saving...' : 'Save Draft'}
          </Button>
          
          <Button
            variant="primary"
            onClick={onCreateInvoice}
            disabled={!isValid || isLoading}
            iconName="FileText"
            iconPosition="left"
          >
            {isLoading ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>
      </div>

      {isGradeMode && currentGradeInfo && (
        <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-info mt-0.5" />
            <div className="text-sm">
              <p className="text-info font-medium mb-1">Grade-Based Invoice Summary</p>
              <ul className="text-muted-foreground text-xs space-y-1">
                <li>• Common fees will be applied to {selectedStudents?.length} students in {currentGradeInfo?.name}</li>
                <li>• Each student will receive identical line items and amounts</li>
                {exceptionCount > 0 && (
                  <li className="text-warning">• {exceptionCount} student{exceptionCount > 1 ? 's' : ''} marked as exception{exceptionCount > 1 ? 's' : ''} - separate handling required</li>
                )}
                <li>• Total estimated amount: ₦{grandTotal?.toFixed(2)}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceActions;