import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const TemplateManager = ({ paymentStructures, availableClasses, onApplyTemplate }) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [sourceClass, setSourceClass] = useState('');
  const [targetClasses, setTargetClasses] = useState([]);
  const [templateName, setTemplateName] = useState('');

  // Filter out empty option and get classes with structures
  const classesWithStructures = availableClasses?.filter(cls => 
    cls?.value && paymentStructures?.[cls?.value]?.length > 0
  );

  const handleApplyTemplate = () => {
    if (!sourceClass || targetClasses?.length === 0) {
      alert('Please select source class and at least one target class');
      return;
    }

    const confirmMessage = `Are you sure you want to copy the payment structure from ${
      availableClasses?.find(cls => cls?.value === sourceClass)?.label
    } to ${targetClasses?.length} selected classes? This will overwrite existing structures.`;

    if (window.confirm(confirmMessage)) {
      onApplyTemplate?.(sourceClass, targetClasses);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setShowTemplateModal(false);
    setSourceClass('');
    setTargetClasses([]);
    setTemplateName('');
  };

  const getTargetClassOptions = () => {
    return availableClasses?.filter(cls => cls?.value && cls?.value !== sourceClass) || [];
  };

  const getTemplatePreview = () => {
    if (!sourceClass) return [];
    return paymentStructures?.[sourceClass] || [];
  };

  const calculateTemplateValue = () => {
    const preview = getTemplatePreview();
    return preview?.reduce((sum, fee) => sum + (fee?.amount || 0), 0) || 0;
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-6 card-shadow">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-medium text-foreground">Template Management</h3>
            <p className="text-sm text-muted-foreground">
              Copy fee structures between classes or create master templates for consistent application
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowTemplateModal(true)}
            disabled={classesWithStructures?.length === 0}
            iconName="Copy"
            iconPosition="left"
          >
            Copy Structure
          </Button>
        </div>

        {/* Quick Template Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classesWithStructures?.slice(0, 3)?.map((cls) => {
            const structure = paymentStructures?.[cls?.value];
            const totalAmount = structure?.reduce((sum, fee) => sum + (fee?.amount || 0), 0) || 0;
            
            return (
              <div key={cls?.value} className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{cls?.label}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSourceClass(cls?.value);
                      setShowTemplateModal(true);
                    }}
                    iconName="Copy"
                    iconSize={14}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fee Types:</span>
                    <span className="font-medium text-foreground">{structure?.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium text-foreground">₦{totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mandatory:</span>
                    <span className="font-medium text-foreground">
                      {structure?.filter(fee => fee?.mandatory)?.length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {classesWithStructures?.length === 0 && (
            <div className="col-span-full text-center py-8">
              <Icon name="Copy" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium text-foreground mb-2">No Templates Available</h4>
              <p className="text-sm text-muted-foreground">
                Configure payment structures for classes to create reusable templates
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleCloseModal} />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Copy Payment Structure</h2>
                  <p className="text-sm text-muted-foreground">
                    Copy fee structure from one class to multiple target classes
                  </p>
                </div>
                
                <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Source Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Source Class (Copy From)
                  </label>
                  <Select
                    options={classesWithStructures}
                    value={sourceClass}
                    onChange={setSourceClass}
                    placeholder="Select source class..."
                    className="w-full"
                  />
                </div>

                {/* Target Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Target Classes (Copy To)
                  </label>
                  <Select
                    options={getTargetClassOptions()}
                    value={targetClasses}
                    onChange={setTargetClasses}
                    multiple
                    placeholder="Select target classes..."
                    className="w-full"
                  />
                  {targetClasses?.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected {targetClasses?.length} classes for template application
                    </p>
                  )}
                </div>

                {/* Preview */}
                {sourceClass && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-3">Template Preview</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-background rounded border">
                        <Icon name="CreditCard" size={20} className="text-primary mx-auto mb-2" />
                        <div className="text-lg font-bold text-foreground">{getTemplatePreview()?.length}</div>
                        <div className="text-xs text-muted-foreground">Fee Types</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded border">
                        <Icon name="DollarSign" size={20} className="text-success mx-auto mb-2" />
                        <div className="text-lg font-bold text-foreground">₦{calculateTemplateValue()?.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Total Amount</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded border">
                        <Icon name="AlertCircle" size={20} className="text-warning mx-auto mb-2" />
                        <div className="text-lg font-bold text-foreground">
                          {getTemplatePreview()?.filter(fee => fee?.mandatory)?.length}
                        </div>
                        <div className="text-xs text-muted-foreground">Mandatory</div>
                      </div>
                    </div>

                    <div className="max-h-40 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-2 text-muted-foreground">Fee Name</th>
                            <th className="text-left p-2 text-muted-foreground">Amount</th>
                            <th className="text-left p-2 text-muted-foreground">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getTemplatePreview()?.map((fee, index) => (
                            <tr key={index} className="border-b border-border/50">
                              <td className="p-2 text-foreground">{fee?.name}</td>
                              <td className="p-2 text-foreground">₦{fee?.amount?.toLocaleString()}</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  fee?.mandatory 
                                    ? 'bg-error/10 text-error' :'bg-success/10 text-success'
                                }`}>
                                  {fee?.mandatory ? 'Mandatory' : 'Optional'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Warning */}
                {targetClasses?.length > 0 && (
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                      <div>
                        <h4 className="font-medium text-warning mb-1">Important Notice</h4>
                        <p className="text-sm text-warning/80">
                          This action will overwrite the existing payment structures for the selected target classes. 
                          Any custom configurations will be replaced with the source template.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {sourceClass && targetClasses?.length > 0 
                      ? `Ready to copy structure to ${targetClasses?.length} classes`
                      : 'Select source and target classes to proceed'
                    }
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    
                    <Button
                      variant="default"
                      onClick={handleApplyTemplate}
                      disabled={!sourceClass || targetClasses?.length === 0}
                      iconName="Copy"
                      iconPosition="left"
                    >
                      Apply Template
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TemplateManager;