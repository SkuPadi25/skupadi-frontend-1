import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const InvoiceFilters = ({ onFiltersChange, activeFiltersCount }) => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    class: '',
    amountRange: '',
    search: ''
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const classOptions = [
    { value: '', label: 'All Classes' },
    { value: 'kindergarten', label: 'Kindergarten' },
    { value: 'grade-1', label: 'Grade 1' },
    { value: 'grade-2', label: 'Grade 2' },
    { value: 'grade-3', label: 'Grade 3' },
    { value: 'grade-4', label: 'Grade 4' },
    { value: 'grade-5', label: 'Grade 5' },
    { value: 'grade-6', label: 'Grade 6' },
    { value: 'grade-7', label: 'Grade 7' },
    { value: 'grade-8', label: 'Grade 8' },
    { value: 'grade-9', label: 'Grade 9' },
    { value: 'grade-10', label: 'Grade 10' },
    { value: 'grade-11', label: 'Grade 11' },
    { value: 'grade-12', label: 'Grade 12' }
  ];

  const amountRangeOptions = [
    { value: '', label: 'All Amounts' },
    { value: '0-100', label: '₦0 - ₦100' },
    { value: '100-500', label: '₦100 - ₦500' },
    { value: '500-1000', label: '₦500 - ₦1,000' },
    { value: '1000-5000', label: '₦1,000 - ₦5,000' },
    { value: '5000+', label: '₦5,000+' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      status: '',
      dateRange: '',
      class: '',
      amountRange: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Input
            type="search"
            placeholder="Search by invoice number or student name..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          placeholder="Filter by status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          placeholder="Select date range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />

        <Select
          placeholder="Filter by class"
          options={classOptions}
          value={filters?.class}
          onChange={(value) => handleFilterChange('class', value)}
        />

        <Select
          placeholder="Filter by amount"
          options={amountRangeOptions}
          value={filters?.amountRange}
          onChange={(value) => handleFilterChange('amountRange', value)}
        />
      </div>
      {/* Active Filters & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                iconName="X"
                iconSize={14}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download" iconSize={16}>
            Export
          </Button>
          <Button variant="outline" size="sm" iconName="Filter" iconSize={16}>
            Advanced Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFilters;