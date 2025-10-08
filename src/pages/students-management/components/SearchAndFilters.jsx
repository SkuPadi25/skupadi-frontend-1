import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { studentClassService } from '../../../services/studentClassService';

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  activeFilters, 
  onFilterChange,
  onAdvancedFiltersToggle,
  showAdvancedFilters 
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [availableClasses, setAvailableClasses] = useState([]);

  // Load available classes from service
  useEffect(() => {
    const loadClasses = () => {
      const classes = studentClassService?.getAllClasses();
      setAvailableClasses([
        { value: 'all', label: 'All Classes' },
        ...classes?.map(cls => ({
          value: cls?.name,
          label: cls?.name,
          id: cls?.id,
          level: cls?.level
        }))
      ]);
    };

    loadClasses();
  }, []);

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setLocalSearch(value);
    onSearchChange(value);
  };

  // Group classes by education level for better UX
  const getClassDropdownOptions = () => {
    const classesByLevel = {
      quickAccess: availableClasses?.filter((cls, index) => cls?.value === 'all' || index <= 6),
      creche: availableClasses?.filter(cls => cls?.level === 'creche'),
      nursery: availableClasses?.filter(cls => cls?.level === 'nursery'),
      primary: availableClasses?.filter(cls => cls?.level === 'primary'),
      junior_secondary: availableClasses?.filter(cls => cls?.level === 'junior_secondary'),
      senior_secondary: availableClasses?.filter(cls => cls?.level === 'senior_secondary')
    };

    // Create grouped options for the dropdown
    const groupedOptions = [
      {
        label: 'Quick Access',
        options: classesByLevel?.quickAccess?.slice(0, 7) || []
      }
    ];

    // Add other levels if they have classes
    const levelMapping = {
      creche: 'Creche',
      nursery: 'Nursery',
      primary: 'Primary',
      junior_secondary: 'JSS (Junior Secondary)',
      senior_secondary: 'SSS (Senior Secondary)'
    };

    Object?.entries(levelMapping)?.forEach(([levelKey, levelLabel]) => {
      if (classesByLevel?.[levelKey]?.length > 0) {
        groupedOptions?.push({
          label: levelLabel,
          options: classesByLevel?.[levelKey]
        });
      }
    });

    return groupedOptions;
  };

  const filterOptions = {
    class: getClassDropdownOptions(),
    gender: [
      { value: 'all', label: 'All Genders' },
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ],
    feeStatus: [
      { value: 'all', label: 'All Status' },
      { value: 'paid', label: 'Paid' },
      { value: 'pending', label: 'Pending' },
      { value: 'overdue', label: 'Overdue' }
    ]
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters?.class !== 'all') count++;
    if (activeFilters?.gender !== 'all') count++;
    if (activeFilters?.feeStatus !== 'all') count++;
    return count;
  };

  const clearAllFilters = () => {
    onFilterChange({
      class: 'all',
      gender: 'all',
      feeStatus: 'all'
    });
  };

  const handleClassFilterChange = (value) => {
    onFilterChange({ ...activeFilters, class: value });
  };

  const handleGenderFilterChange = (value) => {
    onFilterChange({ ...activeFilters, gender: value });
  };

  const handleFeeStatusFilterChange = (value) => {
    onFilterChange({ ...activeFilters, feeStatus: value });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Search students by name, ID, or parent name..."
              value={localSearch}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onAdvancedFiltersToggle}
            iconName={showAdvancedFilters ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            Advanced Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
          
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Clean Dropdown Filter Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Class Filter Dropdown */}
        <div className="space-y-2">
          <Select
            label="Class Filter"
            placeholder="Select class..."
            value={activeFilters?.class}
            onChange={handleClassFilterChange}
            options={filterOptions?.class}
            groupOptions={true}
            searchable={true}
            clearable={activeFilters?.class !== 'all'}
            className="w-full"
          />
        </div>

        {/* Gender Filter Dropdown */}
        <div className="space-y-2">
          <Select
            label="Gender Filter"
            placeholder="Select gender..."
            value={activeFilters?.gender}
            onChange={handleGenderFilterChange}
            options={filterOptions?.gender}
            clearable={activeFilters?.gender !== 'all'}
            className="w-full"
          />
        </div>

        {/* Fee Status Filter Dropdown */}
        <div className="space-y-2">
          <Select
            label="Fee Status Filter"
            placeholder="Select status..."
            value={activeFilters?.feeStatus}
            onChange={handleFeeStatusFilterChange}
            options={filterOptions?.feeStatus}
            clearable={activeFilters?.feeStatus !== 'all'}
            className="w-full"
          />
        </div>
      </div>

      {/* Active Filter Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
              <div className="flex flex-wrap gap-2">
                {activeFilters?.class !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground">
                    Class: {availableClasses?.find(opt => opt?.value === activeFilters?.class)?.label}
                  </span>
                )}
                {activeFilters?.gender !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground">
                    Gender: {activeFilters?.gender}
                  </span>
                )}
                {activeFilters?.feeStatus !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground">
                    Status: {activeFilters?.feeStatus}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
              iconSize={12}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;