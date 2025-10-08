import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvoiceDetails = ({ 
  invoiceData, 
  onInvoiceDataChange, 
  errors = {} 
}) => {
  const paymentTermsOptions = [
    { value: '7', label: 'Net 7 days' },
    { value: '15', label: 'Net 15 days' },
    { value: '30', label: 'Net 30 days' },
    { value: '45', label: 'Net 45 days' },
    { value: '60', label: 'Net 60 days' },
    { value: 'immediate', label: 'Due immediately' }
  ];

  const handleInputChange = (field, value) => {
    onInvoiceDataChange({
      ...invoiceData,
      [field]: value
    });
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Invoice Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="Invoice Number"
            type="text"
            value={invoiceData.invoiceNumber || generateInvoiceNumber()}
            onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            placeholder="Auto-generated"
            error={errors.invoiceNumber}
            required
          />

          <Input
            label="Due Date"
            type="date"
            value={invoiceData.dueDate || ''}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            error={errors.dueDate}
            required
            min={new Date().toISOString().split('T')[0]}
          />

          <Select
            label="Payment Terms"
            options={paymentTermsOptions}
            value={invoiceData.paymentTerms || '30'}
            onChange={(value) => handleInputChange('paymentTerms', value)}
            placeholder="Select payment terms"
          />
        </div>

        <div className="space-y-4">
          <Input
            label="Invoice Description"
            type="text"
            value={invoiceData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of the invoice"
            error={errors.description}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Notes <span className="text-muted-foreground">(Optional)</span>
            </label>
            <textarea
              value={invoiceData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes or payment instructions..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Invoice Date:</span>
            <p className="font-medium text-foreground">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Academic Year:</span>
            <p className="font-medium text-foreground">2024-2025</p>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>
            <p className="font-medium text-warning">Draft</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;