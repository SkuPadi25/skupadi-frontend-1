import React from 'react';
import Select from '../../../components/ui/Select';

const TransactionFilters = ({ filters, onFilterChange }) => {
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'credit', label: 'Credit' },
    { value: 'debit', label: 'Debit' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'thismonth', label: 'This month' },
    { value: 'lastmonth', label: 'Last month' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Select
        value={filters?.type || ''}
        onChange={(value) => onFilterChange('type', value)}
        options={typeOptions}
        placeholder="Filter by type"
      />
      
      <Select
        value={filters?.status || ''}
        onChange={(value) => onFilterChange('status', value)}
        options={statusOptions}
        placeholder="Filter by status"
      />
      
      <Select
        value={filters?.dateRange || ''}
        onChange={(value) => onFilterChange('dateRange', value)}
        options={dateRangeOptions}
        placeholder="Filter by date"
      />
    </div>
  );
};

export default TransactionFilters;