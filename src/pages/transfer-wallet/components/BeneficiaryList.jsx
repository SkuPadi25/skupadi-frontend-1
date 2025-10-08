import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BeneficiaryList = ({ searchTerm, onSelect, selectedRecipient }) => {
  // Mock beneficiaries data
  const [beneficiaries] = useState([
    {
      id: 1,
      accountName: 'John Doe',
      bankName: 'First Bank',
      bankLogo: '/assets/images/no_image.png',
      accountNumber: '1234567890',
      lastUsed: '2025-01-15'
    },
    {
      id: 2,
      accountName: 'Jane Smith',
      bankName: 'GTBank',
      bankLogo: '/assets/images/no_image.png',
      accountNumber: '0987654321',
      lastUsed: '2025-01-10'
    },
    {
      id: 3,
      accountName: 'Michael Johnson',
      bankName: 'Access Bank',
      bankLogo: '/assets/images/no_image.png',
      accountNumber: '1122334455',
      lastUsed: '2025-01-08'
    },
    {
      id: 4,
      accountName: 'Sarah Wilson',
      bankName: 'Zenith Bank',
      bankLogo: '/assets/images/no_image.png',
      accountNumber: '5566778899',
      lastUsed: '2025-01-05'
    },
    {
      id: 5,
      accountName: 'David Brown',
      bankName: 'UBA',
      bankLogo: '/assets/images/no_image.png',
      accountNumber: '9988776655',
      lastUsed: '2025-01-03'
    }
  ]);

  const filteredBeneficiaries = beneficiaries?.filter(beneficiary =>
    beneficiary?.accountName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    beneficiary?.bankName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    beneficiary?.accountNumber?.includes(searchTerm)
  );

  const handleSelect = (beneficiary) => {
    onSelect?.(beneficiary);
  };

  const handleEdit = (beneficiary, e) => {
    e?.stopPropagation();
    // Handle edit beneficiary
    console.log('Edit beneficiary:', beneficiary);
  };

  const handleDelete = (beneficiary, e) => {
    e?.stopPropagation();
    // Handle delete beneficiary
    console.log('Delete beneficiary:', beneficiary);
  };

  if (filteredBeneficiaries?.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          {searchTerm ? 'No beneficiaries found' : 'No saved beneficiaries'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {searchTerm ? 'Try searching with a different term' : 'Add a new beneficiary to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {filteredBeneficiaries?.map((beneficiary) => (
        <div
          key={beneficiary?.id}
          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-secondary/50 ${
            selectedRecipient?.id === beneficiary?.id 
              ? 'border-primary bg-primary/5' :'border-border bg-card'
          }`}
          onClick={() => handleSelect(beneficiary)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Building2" size={16} className="text-muted-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {beneficiary?.accountName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {beneficiary?.bankName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {beneficiary?.accountNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => handleEdit(beneficiary, e)}
              >
                <Icon name="Edit2" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-error hover:text-error hover:bg-error/10"
                onClick={(e) => handleDelete(beneficiary, e)}
              >
                <Icon name="Trash2" size={14} />
              </Button>
            </div>
          </div>

          {selectedRecipient?.id === beneficiary?.id && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center space-x-1 text-primary">
                <Icon name="Check" size={12} />
                <span className="text-xs font-medium">Selected</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BeneficiaryList;