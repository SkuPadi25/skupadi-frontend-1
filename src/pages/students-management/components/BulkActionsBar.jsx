import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ 
  selectedCount, 
  onClearSelection, 
  onBulkDelete, 
  onBulkClassTransfer,
  onBulkInvoiceGeneration 
}) => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const classOptions = [
    { value: 'Grade 1', label: 'Grade 1' },
    { value: 'Grade 2', label: 'Grade 2' },
    { value: 'Grade 3', label: 'Grade 3' },
    { value: 'Grade 4', label: 'Grade 4' },
    { value: 'Grade 5', label: 'Grade 5' },
    { value: 'Grade 6', label: 'Grade 6' },
    { value: 'Grade 7', label: 'Grade 7' },
    { value: 'Grade 8', label: 'Grade 8' },
    { value: 'Grade 9', label: 'Grade 9' },
    { value: 'Grade 10', label: 'Grade 10' }
  ];

  const handleClassTransfer = () => {
    if (selectedClass) {
      onBulkClassTransfer(selectedClass);
      setShowTransferModal(false);
      setSelectedClass('');
    }
  };

  const handleBulkDelete = () => {
    onBulkDelete();
    setShowDeleteModal(false);
  };

  const handleDropdownAction = (action) => {
    setDropdownOpen(false);
    
    switch (action) {
      case 'transfer':
        setShowTransferModal(true);
        break;
      case 'invoices':
        onBulkInvoiceGeneration();
        break;
      case 'delete':
        setShowDeleteModal(true);
        break;
      case 'clear':
        onClearSelection();
        break;
      default:
        break;
    }
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="bg-primary text-primary-foreground rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Icon name="CheckSquare" size={16} color="white" />
          </div>
          <div>
            <p className="font-medium">
              {selectedCount} student{selectedCount > 1 ? 's' : ''} selected
            </p>
            <p className="text-sm opacity-90">Choose an action to perform</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Actions Dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              iconName="ChevronDown"
              iconPosition="right"
              iconSize={14}
            >
              Actions
            </Button>
            
            {dropdownOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDropdownOpen(false)}
                />
                
                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-20">
                  <div className="p-1">
                    <button
                      onClick={() => handleDropdownAction('transfer')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name="ArrowRightLeft" size={16} />
                      <span>Transfer Class</span>
                    </button>
                    
                    <button
                      onClick={() => handleDropdownAction('invoices')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name="FileText" size={16} />
                      <span>Generate Invoices</span>
                    </button>
                    
                    <hr className="my-1 border-border" />
                    
                    <button
                      onClick={() => handleDropdownAction('delete')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <Icon name="Trash2" size={16} />
                      <span>Delete Selected</span>
                    </button>
                    
                    <button
                      onClick={() => handleDropdownAction('clear')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name="X" size={16} />
                      <span>Clear Selection</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Class Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="ArrowRightLeft" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Transfer Students</h3>
                <p className="text-sm text-muted-foreground">
                  Move {selectedCount} student{selectedCount > 1 ? 's' : ''} to a new class
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <Select
                label="Select Target Class"
                placeholder="Choose a class"
                options={classOptions}
                value={selectedClass}
                onChange={setSelectedClass}
                required
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowTransferModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleClassTransfer}
                disabled={!selectedClass}
                className="flex-1"
              >
                Transfer Students
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Delete Students</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-foreground mb-6">
              Are you sure you want to delete <strong>{selectedCount} student{selectedCount > 1 ? 's' : ''}</strong>? 
              This will permanently remove their records and all associated data.
            </p>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="flex-1"
              >
                Delete Students
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;