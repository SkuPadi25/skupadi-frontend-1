import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DateRangeFilter = ({ onFilterChange }) => {
  const [selectedRange, setSelectedRange] = useState('7days');
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const predefinedRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    if (range !== 'custom') {
      setIsCustomOpen(false);
      onFilterChange?.(range);
    } else {
      setIsCustomOpen(true);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Date Range:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {predefinedRanges.map((range) => (
            <Button
              key={range.value}
              variant={selectedRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleRangeChange(range.value)}
              className="text-xs rounded-xl"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {isCustomOpen && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-foreground mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue="2025-01-01"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-foreground mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue="2025-07-22"
              />
            </div>
            <div className="flex items-end">
              <Button size="sm" onClick={() => onFilterChange?.('custom')}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;