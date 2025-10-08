import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AdvancedFiltersPanel = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}) => {
  const [filters, setFilters] = useState({
    enrollmentDateFrom: '',
    enrollmentDateTo: '',
    specificClass: 'all',
    ...currentFilters
  });

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    { value: 'Creche', label: 'Creche' },
    { value: 'Nursery 1', label: 'Nursery 1' },
    { value: 'Nursery 2', label: 'Nursery 2' },
    { value: 'Nursery 3', label: 'Nursery 3' },
    { value: 'Primary 1', label: 'Primary 1' },
    { value: 'Primary 2', label: 'Primary 2' },
    { value: 'Primary 3', label: 'Primary 3' },
    { value: 'Primary 4', label: 'Primary 4' },
    { value: 'Primary 5', label: 'Primary 5' },
    { value: 'Primary 6', label: 'Primary 6' },
    { value: 'JSS 1', label: 'JSS 1' },
    { value: 'JSS 2', label: 'JSS 2' },
    { value: 'JSS 3', label: 'JSS 3' },
    { value: 'SSS 1', label: 'SSS 1' },
    { value: 'SSS 2', label: 'SSS 2' },
    { value: 'SSS 3', label: 'SSS 3' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      enrollmentDateFrom: '',
      enrollmentDateTo: '',
      specificClass: 'all'
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Filter" size={16} color="white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Advanced Filters</h2>
                <p className="text-sm text-muted-foreground">Refine your search criteria</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Filter Options */}
          <div className="space-y-6">
            {/* Enrollment Date Range */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Enrollment Date Range</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  label="From"
                  value={filters?.enrollmentDateFrom}
                  onChange={(e) => handleFilterChange('enrollmentDateFrom', e?.target?.value)}
                />
                <Input
                  type="date"
                  label="To"
                  value={filters?.enrollmentDateTo}
                  onChange={(e) => handleFilterChange('enrollmentDateTo', e?.target?.value)}
                />
              </div>
            </div>

            {/* Specific Class */}
            <div>
              <Select
                label="Specific Class"
                options={classOptions}
                value={filters?.specificClass}
                onChange={(value) => handleFilterChange('specificClass', value)}
              />
            </div>

            {/* Additional Criteria */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Additional Criteria</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm text-foreground">Has outstanding fees</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm text-foreground">Recently enrolled (last 30 days)</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm text-foreground">Has siblings in school</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm text-foreground">Active enrollment status</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
            >
              Reset
            </Button>
            <Button
              variant="default"
              onClick={handleApply}
              className="flex-1"
              iconName="Check"
              iconPosition="left"
              iconSize={16}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedFiltersPanel;