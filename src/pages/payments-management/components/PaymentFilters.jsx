import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PaymentFilters = ({ filters, onFilterChange, searchTerm, onSearchChange }) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const methodOptions = [
    { value: '', label: 'All Methods' },
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Card' },
    { value: 'mobile_money', label: 'Mobile Money' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year', label: 'This Year' }
  ];

  const amountRangeOptions = [
    { value: '', label: 'All Amounts' },
    { value: '0-100000', label: '₦0 - ₦100,000' },
    { value: '100000-500000', label: '₦100,000 - ₦500,000' },
    { value: '500000-1000000', label: '₦500,000 - ₦1,000,000' },
    { value: '1000000+', label: '₦1,000,000+' }
  ];

  const clearFilters = () => {
    onFilterChange('status', '');
    onFilterChange('method', '');
    onFilterChange('dateRange', '');
    onFilterChange('amountRange', '');
    onSearchChange('');
  };

  const hasActiveFilters = Object.values(filters).some(value => value) || searchTerm;

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filter Payments</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <Icon name="X" size={16} className="mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-1">
          <Input
            type="text" 
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            icon="Search"
          />
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(value) => onFilterChange('status', value)}
          placeholder="Payment Status"
        />

        {/* Method Filter */}
        <Select
          options={methodOptions}
          value={filters.method}
          onChange={(value) => onFilterChange('method', value)}
          placeholder="Payment Method"
        />

        {/* Date Range Filter */}
        <Select
          options={dateRangeOptions}
          value={filters.dateRange}
          onChange={(value) => onFilterChange('dateRange', value)}
          placeholder="Date Range"
        />

        {/* Amount Range Filter */}
        <Select
          options={amountRangeOptions}
          value={filters.amountRange}
          onChange={(value) => onFilterChange('amountRange', value)}
          placeholder="Amount Range"
        />
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
              Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
              <button onClick={() => onFilterChange('status', '')} className="ml-1 hover:text-primary/80">
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters.method && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
              Method: {methodOptions.find(opt => opt.value === filters.method)?.label}
              <button onClick={() => onFilterChange('method', '')} className="ml-1 hover:text-primary/80">
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters.dateRange && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
              Date: {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
              <button onClick={() => onFilterChange('dateRange', '')} className="ml-1 hover:text-primary/80">
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters.amountRange && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
              Amount: {amountRangeOptions.find(opt => opt.value === filters.amountRange)?.label}
              <button onClick={() => onFilterChange('amountRange', '')} className="ml-1 hover:text-primary/80">
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
              Search: "{searchTerm}"
              <button onClick={() => onSearchChange('')} className="ml-1 hover:text-primary/80">
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentFilters;