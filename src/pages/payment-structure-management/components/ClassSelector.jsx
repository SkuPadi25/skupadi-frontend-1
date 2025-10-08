import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ClassSelector = ({
  availableClasses,
  selectedClass,
  onClassSelect,
  searchTerm,
  onSearchChange,
  filterCategory,
  onFilterChange
}) => {
  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Academic', value: 'academic' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Accommodation', value: 'accommodation' },
    { label: 'Activities', value: 'activities' },
    { label: 'Administrative', value: 'administrative' },
    { label: 'Other', value: 'other' }
  ];

  const getSelectedClassLabel = () => {
    const selectedClassData = availableClasses?.find(cls => cls?.value === selectedClass);
    return selectedClassData?.label || 'Select Class/Grade';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">Class/Grade Selection</h3>
          <p className="text-sm text-muted-foreground">
            Select a class to view and configure its payment structure
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>Changes are automatically saved</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Class Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Class/Grade Level</label>
          <Select
            options={availableClasses}
            value={selectedClass}
            onChange={onClassSelect}
            placeholder="Select class/grade..."
            className="w-full"
          />
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Search Fee Types</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Filter by Category</label>
          <Select
            options={categoryOptions}
            value={filterCategory}
            onChange={onFilterChange}
            placeholder="Select category..."
            className="w-full"
          />
        </div>
      </div>

      {/* Selected Class Display */}
      {selectedClass && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="GraduationCap" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{getSelectedClassLabel()}</h4>
                <p className="text-sm text-muted-foreground">
                  Currently viewing payment structure for this class
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClassSelect('')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} className="mr-1" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* All Classes View Info */}
      {!selectedClass && (
        <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-info mt-0.5" />
            <div>
              <h4 className="font-medium text-info mb-1">Viewing All Classes</h4>
              <p className="text-sm text-info/80">
                You're currently viewing payment structures across all classes. 
                Select a specific class to add, edit, or manage fee types for that class.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSelector;